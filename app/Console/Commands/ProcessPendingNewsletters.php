<?php

namespace App\Console\Commands;

use App\Jobs\ProcessNewsletterBatchJob;
use App\Models\PostNewsletterCampaign;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessPendingNewsletters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'newsletter:process-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Procesa lotes pendientes de boletines de correo respetando cuotas de envío';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Verificando campañas de boletín activas...');

        $campaigns = PostNewsletterCampaign::whereIn('status', ['pending', 'processing', 'paused'])
            ->where(function ($q) {
                $q->whereNull('next_batch_at')
                  ->orWhere('next_batch_at', '<=', Carbon::now());
            })
            ->get();

        if ($campaigns->isEmpty()) {
            $this->info('No hay campañas pendientes o esperando turno en este momento.');
            return 0;
        }

        foreach ($campaigns as $campaign) {
            $this->info("Procesando bloque para campaña {$campaign->id} (Post: {$campaign->post_id})...");
            ProcessNewsletterBatchJob::dispatchSync($campaign->id, 80);
        }

        $this->info('Comando finalizado.');
        return 0;
    }
}
