<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Jobs\ProcessNewsletterBatchJob;
use App\Models\Post;
use App\Models\PostNewsletterCampaign;
use App\Models\PostTag;
use App\Models\Subscription;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Ramsey\Uuid\Uuid;

class PostController extends BasicController
{
    public $model = Post::class;
    public $reactView = 'Admin/Posts';

    public $imageFields = ['image'];

    public function setPaginationInstance(string $model)
    {
        $relations = ['category', 'tags'];
        if (Schema::hasTable('post_newsletter_campaigns')) {
            $relations[] = 'newsletterCampaign';
        }
        return $model::with($relations);
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        $tags = \explode(',', $request->tags ?? '');

        DB::transaction(function () use ($jpa, $tags) {
            // Eliminar tags que ya no están asociados
            PostTag::where('post_id', $jpa->id)->whereNotIn('tag_id', $tags)->delete();

            foreach ($tags as $tag) {
                if (Uuid::isValid($tag)) {
                    // Es un UUID existente
                    $tagId = $tag;
                } else {
                    // Es un nuevo tag
                    $tagJpa = Tag::firstOrCreate(['name' => $tag]);
                    $tagId = $tagJpa->id;
                }

                PostTag::updateOrCreate([
                    'post_id' => $jpa->id,
                    'tag_id' => $tagId
                ]);
            }
        });

        // Notificar a los suscriptores de forma segura y por lotes si el administrador activó la opción
        if ($request->boolean('send_newsletter') && Schema::hasTable('post_newsletter_campaigns')) {
            $order = in_array($request->newsletter_target, ['recent', 'oldest']) ? $request->newsletter_target : 'recent';
            $dailyLimit = (int) $request->input('newsletter_daily_limit', 5000);
            if ($dailyLimit < 500 || $dailyLimit > 8500) {
                $dailyLimit = 5000;
            }

            // Evitar duplicar campañas si ya existe una en progreso o completada para este post
            $existingCampaign = PostNewsletterCampaign::where('post_id', $jpa->id)
                ->whereIn('status', ['pending', 'processing', 'paused', 'completed'])
                ->first();

            if (!$existingCampaign) {
                $totalSubscribers = Subscription::where('status', true)->count();

                if ($totalSubscribers > 0) {
                    $campaign = PostNewsletterCampaign::create([
                        'post_id' => $jpa->id,
                        'total_subscribers' => $totalSubscribers,
                        'daily_limit' => $dailyLimit,
                        'target_order' => $order,
                        'status' => 'pending',
                        'next_batch_at' => now(),
                    ]);

                    // Si la cola está en 'sync', no bloqueamos la petición web del usuario
                    // (el post se guarda al instante y el schedule:run o worker procesa los envíos en segundo plano)
                    if (config('queue.default') !== 'sync') {
                        ProcessNewsletterBatchJob::dispatch($campaign->id);
                    }
                }
            }
        }
    }
}
