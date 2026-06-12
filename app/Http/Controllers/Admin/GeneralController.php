<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\General;
use App\Models\Lang;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use SoDe\Extend\Response;

class GeneralController extends BasicController
{
    public $model = General::class;
    public $reactView = 'Admin/Generals';
    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $generals = General::where('lang_id', $langId)->get();

        // Si no hay datos para el idioma actual, copiar del idioma por defecto
        if ($generals->isEmpty()) {
            $defaultLangId = Lang::where('is_default', true)->value('id');
            $defaultGenerals = General::where('lang_id', $defaultLangId)->get();

            foreach ($defaultGenerals as $general) {
                General::firstOrCreate([
                    'correlative' => $general->correlative,
                    'lang_id' => $langId
                ], [
                    'name' => $general->name,
                    'description' => $general->description
                ]);
            }

            $generals = General::where('lang_id', $langId)->get();
        }

        return [
            'generals' => $generals
        ];
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        // dump($request->all());
        $response = Response::simpleTryCatch(function () use ($request) {
            $body = $request->all();
            foreach ($body as $record) {
                General::updateOrCreate([
                    'lang_id' => app('current_lang_id'),
                    'correlative' => $record['correlative']
                ], [
                    'name' => $record['name'],
                    'description' => $record['description']
                ]);
            }
            // Limpiar caché SEO para reflejar cambios inmediatamente
            \Illuminate\Support\Facades\Cache::forget('seo_data');
        });
        return response($response->toArray(), $response->status);
    }

    public function generateSitemap(Request $request)
    {
        $response = Response::simpleTryCatch(function () {
            \Illuminate\Support\Facades\Artisan::call('sitemap:generate');
        });

        return response($response->toArray(), $response->status);
    }

    public function generateRobots(Request $request)
    {
        $response = Response::simpleTryCatch(function () {
            $baseUrl = url('/');
            $content = "User-agent: *\n";
            $content .= "Allow: /\n\n";

            $content .= "# OpenAI (ChatGPT)\n";
            $content .= "User-agent: OAI-SearchBot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: ChatGPT-User\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: GPTBot\n";
            $content .= "Allow: /\n\n";

            $content .= "# Anthropic (Claude)\n";
            $content .= "User-agent: ClaudeBot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: Claude-Web\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: anthropic-ai\n";
            $content .= "Allow: /\n\n";

            $content .= "# Google (Gemini / AI Overviews)\n";
            $content .= "User-agent: Google-Extended\n";
            $content .= "Allow: /\n\n";

            $content .= "# Perplexity\n";
            $content .= "User-agent: PerplexityBot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: Perplexity-User\n";
            $content .= "Allow: /\n\n";

            $content .= "# Microsoft (Copilot / Bing)\n";
            $content .= "User-agent: bingbot\n";
            $content .= "Allow: /\n\n";

            $content .= "# Apple (Apple Intelligence / Siri)\n";
            $content .= "User-agent: Applebot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: Applebot-Extended\n";
            $content .= "Allow: /\n\n";

            $content .= "# Common Crawl (alimenta varios modelos)\n";
            $content .= "User-agent: CCBot\n";
            $content .= "Allow: /\n\n";

            $content .= "# Meta (Llama / AI)\n";
            $content .= "User-agent: facebookexternalhit\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: meta-externalagent\n";
            $content .= "Allow: /\n\n";

            $content .= "Sitemap: " . $baseUrl . "/sitemap.xml\n";

            file_put_contents(public_path('robots.txt'), $content);
        });

        return response($response->toArray(), $response->status);
    }
}
