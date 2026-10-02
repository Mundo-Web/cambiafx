<?php

namespace App\Jobs;

use App\Models\Post;
use App\Models\PostNewsletterCampaign;
use App\Models\PostNewsletterLog;
use App\Models\Subscription;
use App\Notifications\BlogPublishedNotification;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessNewsletterBatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $campaignId;
    protected int $batchChunkSize;

    /**
     * Create a new job instance.
     *
     * @param string $campaignId
     * @param int $batchChunkSize Cantidad de correos por bloque de ejecución (máx 25 para respetar tasa de Microsoft)
     */
    public function __construct(string $campaignId, int $batchChunkSize = 25)
    {
        $this->campaignId = $campaignId;
        $this->batchChunkSize = $batchChunkSize;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $campaign = PostNewsletterCampaign::with('post')->find($this->campaignId);

        if (!$campaign || in_array($campaign->status, ['completed', 'cancelled'])) {
            return;
        }

        $post = $campaign->post;
        if (!$post) {
            $campaign->update(['status' => 'cancelled']);
            return;
        }

        // Marcar inicio si es la primera vez
        if (!$campaign->started_at) {
            $campaign->started_at = Carbon::now();
        }

        // Verificar límite diario de hoy
        $sentToday = PostNewsletterLog::where('campaign_id', $campaign->id)
            ->where('sent_at', '>=', Carbon::now()->startOfDay())
            ->count();

        if ($sentToday >= $campaign->daily_limit) {
            // Límite diario alcanzado: pausar hasta mañana a las 8:00 AM
            $nextRun = Carbon::now()->startOfDay()->addDay()->setHour(8)->setMinute(0);
            $campaign->update([
                'status' => 'paused',
                'next_batch_at' => $nextRun,
            ]);

            Log::info("Campaña de newsletter {$campaign->id}: límite diario alcanzado ({$sentToday}/{$campaign->daily_limit}). Pausado hasta {$nextRun->toDateTimeString()}");

            // Programar reanudación para mañana
            self::dispatch($campaign->id, $this->batchChunkSize)
                ->delay($nextRun);

            return;
        }

        $campaign->update(['status' => 'processing']);

        // Calcular cuántos correos faltan para el cupo de hoy
        $remainingToday = $campaign->daily_limit - $sentToday;
        $chunkLimit = min($this->batchChunkSize, $remainingToday);

        // Obtener los suscriptores activos que aún no han recibido notificación de este post
        $alreadyNotifiedIds = PostNewsletterLog::where('post_id', $post->id)
            ->pluck('subscription_id')
            ->toArray();

        $query = Subscription::where('status', true);
        if (!empty($alreadyNotifiedIds)) {
            $query->whereNotIn('id', $alreadyNotifiedIds);
        }

        // Aplicar orden según configuración (más recientes o más antiguos primero)
        $query->orderBy('created_at', $campaign->target_order === 'oldest' ? 'asc' : 'desc');

        $pendingSubscriptions = $query->limit($chunkLimit)->get();

        if ($pendingSubscriptions->isEmpty()) {
            // No quedan más suscriptores pendientes: Campaña completada
            $campaign->update([
                'status' => 'completed',
                'completed_at' => Carbon::now(),
                'next_batch_at' => null,
            ]);
            Log::info("Campaña de newsletter {$campaign->id} para el post '{$post->name}' completada exitosamente. Total enviados: {$campaign->sent_count}");
            return;
        }

        // Procesar lote con espaciado de seguridad (2.2 segundos entre cada envío)
        // Esto garantiza máximo 27 correos por minuto, respetando el límite de 30/min de Microsoft 365
        $validatedDomains = [];

        foreach ($pendingSubscriptions as $subscription) {
            $email = trim($subscription->description ?? '');
            $status = 'sent';
            $errorMessage = null;

            // Validación anticipada: sintaxis y existencia real del dominio (registros MX)
            $parts = explode('@', $email);
            $domain = count($parts) === 2 ? trim(end($parts)) : null;

            $isDomainValid = false;
            if (filter_var($email, FILTER_VALIDATE_EMAIL) && $domain) {
                if (!isset($validatedDomains[$domain])) {
                    $validatedDomains[$domain] = @checkdnsrr($domain, 'MX');
                }
                $isDomainValid = $validatedDomains[$domain];
            }

            if (!$isDomainValid) {
                // Correo falso / dominio sin servidor de correo
                $errorMessage = 'Dominio de correo falso o sin servidor activo (MX)';
                $campaign->increment('failed_count');
                Log::warning("Correo inválido detectado antes de enviar: {$email}");

                try {
                    $subscription->update([
                        'last_error' => $errorMessage,
                        'failed_at' => Carbon::now(),
                    ]);
                } catch (\Throwable $err) {}

                try {
                    PostNewsletterLog::create([
                        'campaign_id' => $campaign->id,
                        'post_id' => $post->id,
                        'subscription_id' => $subscription->id,
                        'email' => $email ?: 'sin-email',
                        'status' => 'failed',
                        'error_message' => $errorMessage,
                        'sent_at' => Carbon::now(),
                    ]);
                } catch (\Throwable $e) {}

                $campaign->update([
                    'last_processed_subscription_id' => $subscription->id,
                    'last_sent_at' => Carbon::now(),
                ]);

                // No gastar cuota de Microsoft 365 ni pausar 2.2 segundos para este correo falso
                continue;
            }

            try {
                $subscription->notifyNow(new BlogPublishedNotification($post));
                $campaign->increment('sent_count');

                // Si tenía error previo, lo limpiamos porque ahora se envió correctamente
                if ($subscription->last_error) {
                    $subscription->update([
                        'last_error' => null,
                        'failed_at' => null,
                    ]);
                }
            } catch (\Throwable $th) {
                $status = 'failed';
                $errorMessage = mb_substr($th->getMessage(), 0, 500);
                $campaign->increment('failed_count');
                Log::error("Error enviando boletín a {$email}: " . $th->getMessage());

                // Marcar el error en el suscriptor para que el cliente pueda verlo y depurarlo manualmente
                try {
                    $subscription->update([
                        'last_error' => $errorMessage,
                        'failed_at' => Carbon::now(),
                    ]);
                } catch (\Throwable $err) {
                    // Ignorar si la columna aún no existe antes de migrar
                }
            }

            // Registrar log para idempotencia (nunca repetir al mismo destinatario)
            try {
                PostNewsletterLog::create([
                    'campaign_id' => $campaign->id,
                    'post_id' => $post->id,
                    'subscription_id' => $subscription->id,
                    'email' => $email ?? 'sin-email',
                    'status' => $status,
                    'error_message' => $errorMessage,
                    'sent_at' => Carbon::now(),
                ]);
            } catch (\Throwable $e) {
                Log::warning("No se pudo guardar el log de newsletter: " . $e->getMessage());
            }

            $campaign->update([
                'last_processed_subscription_id' => $subscription->id,
                'last_sent_at' => Carbon::now(),
            ]);

            // Pausa de 2.2 segundos para respetar límite por minuto de Microsoft 365
            usleep(2200000);
        }

        // Revisar si aún quedan más suscriptores
        $remainingTotal = Subscription::where('status', true)
            ->whereNotIn('id', PostNewsletterLog::where('post_id', $post->id)->pluck('subscription_id'))
            ->count();

        if ($remainingTotal <= 0) {
            $campaign->update([
                'status' => 'completed',
                'completed_at' => Carbon::now(),
                'next_batch_at' => null,
            ]);
            return;
        }

        // Verificar si se alcanzó el límite diario tras este lote
        $updatedSentToday = PostNewsletterLog::where('campaign_id', $campaign->id)
            ->where('sent_at', '>=', Carbon::now()->startOfDay())
            ->count();

        if ($updatedSentToday >= $campaign->daily_limit) {
            $nextRun = Carbon::now()->startOfDay()->addDay()->setHour(8)->setMinute(0);
            $campaign->update([
                'status' => 'paused',
                'next_batch_at' => $nextRun,
            ]);

            self::dispatch($campaign->id, $this->batchChunkSize)->delay($nextRun);
        } else {
            // Continuar con el siguiente bloque tras 10 segundos
            $campaign->update([
                'next_batch_at' => Carbon::now()->addSeconds(10),
            ]);
            self::dispatch($campaign->id, $this->batchChunkSize)->delay(Carbon::now()->addSeconds(10));
        }
    }
}
