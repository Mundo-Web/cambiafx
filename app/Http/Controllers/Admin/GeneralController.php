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
            $content .= "Allow: /\n";
            $content .= "User-agent: facebookexternalhit\n";
            $content .= "Allow: /\n";

        
            $content .= "Sitemap: " . $baseUrl . "/sitemap.xml\n";

            file_put_contents(public_path('robots.txt'), $content);
        });

        return response($response->toArray(), $response->status);
    }
}
