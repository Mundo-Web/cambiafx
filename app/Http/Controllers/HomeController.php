<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\Ad;
use App\Models\App;
use App\Models\Banner;
use App\Models\Brand;
use App\Models\CoreValue;
use App\Models\Coupon;
use App\Models\Indicator;
use App\Models\InstagramPost;
use App\Models\Item;
use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Post;
use App\Models\Service;
use App\Models\Solution;
use App\Models\PurchaseOption;
use App\Models\Slider;
use App\Models\Specialty;
use App\Models\Staff;
use App\Models\Strength;
use App\Models\Supply;
use App\Models\Testimony;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class HomeController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');

        // Caché de 3 minutos para el tipo de cambio real de apiluna (elimina bloqueo de TTFB)
        $initialRates = Cache::remember('current_rates_home', 180, function () {
            try {
                $response = Http::timeout(2)->get('https://apiluna.cambiafx.pe/api/BackendPizarra/getTcCustomerNoAuth', [
                    'idParCurrency' => 1
                ]);
                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Throwable $e) {
                // Silencioso en caso de timeout
            }
            return null;
        });

        // Caché de 30 minutos (1800s) para máximo rendimiento y reducción de TTFB/TBT.
        // Se invalida automáticamente con Cache::flush() cada vez que se guarda o elimina en el CMS o se usa "Limpiar Caché Web".
        $homeData = Cache::remember("home_view_data_{$langId}", 1800, function () use ($langId) {
            $landing = LandingHome::where('correlative', 'like', 'page_home%')->where('lang_id', $langId)->get();
            /*CAMBIO Y GERENCIA */
            $sliders = Slider::where('status', true)->where('visible', true)->orderBy('created_at', 'DESC')->get();
            $brands = Brand::where('status', true)->where('visible', true)->orderBy('created_at', 'DESC')->get();
            $strengths = Strength::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
            
            // Optimización de payload: excluir el campo HTML pesado 'description' de los posts en la home
            $posts = Post::select('id', 'name', 'slug', 'image', 'summary', 'category_id', 'created_at')
                ->where('status', true)
                ->orderBy('created_at', 'desc')
                ->with(['category:id,name,slug'])
                ->where('lang_id', $langId)
                ->limit(6)
                ->get();

            $testimonios = Testimony::where('status', true)->where('lang_id', $langId)->get();
            $indicators = Indicator::where('status', true)->where('lang_id', $langId)->get();

            $allServices = Service::where('status', true)->where('lang_id', $langId)->get();

            $apps = App::where('visible', true)->get();
            $pasos = Specialty::where('visible', true)
                ->where('lang_id', $langId)
                ->orderBy('created_at', 'asc')
                ->get();
            $cupones = Coupon::where('status', true)
                ->where(function($query) {
                    $query->where(function($subQuery) {
                        // Cupones con fechas válidas
                        $subQuery->where('date_begin', '<=', now())
                                 ->where('date_end', '>=', now());
                    })->orWhere(function($subQuery) {
                        // Cupones sin fechas (siempre vigentes)
                        $subQuery->whereNull('date_begin')
                                 ->whereNull('date_end');
                    })->orWhere(function($subQuery) {
                        // Cupones solo con fecha de inicio
                        $subQuery->where('date_begin', '<=', now())
                                 ->whereNull('date_end');
                    })->orWhere(function($subQuery) {
                        // Cupones solo con fecha de fin
                        $subQuery->whereNull('date_begin')
                                 ->where('date_end', '>=', now());
                    });
                })
                ->orderBy('created_at', 'desc')
                ->get();

            $core_values = CoreValue::where('status', true)
                ->where('lang_id', $langId)
                ->get();

            $banner_operacion = Banner::where('status', true)
                ->where('visible', true)
                ->where('section', 'home')
                ->where('position', 'primera_operacion')
                ->orderBy('created_at', 'desc')
                ->first();

            $banner_slider = Banner::where('status', true)
                ->where('visible', true)
                ->where('section', 'home')
                ->where('position', 'cambia_empresas')
                ->orderBy('order', 'asc')
                ->get();

            $faqs = Faq::where('status', true)
                ->where('visible', true)
                ->whereNull('service_id')
                ->where('lang_id', $langId)
                ->get();

            return [
                'landing' => $landing,
                'sliders' => $sliders,
                'brands' => $brands,
                'strengths' => $strengths,
                'posts' => $posts,
                'testimonios' => $testimonios,
                'indicators' => $indicators,
                'allServices' => $allServices,
                'apps' => $apps,
                'pasos' => $pasos,
                'cupones' => $cupones,
                'core_values' => $core_values,
                'banner_operacion' => $banner_operacion,
                'banner_slider' => $banner_slider,
                'faqs' => $faqs
            ];
        });

        return array_merge($homeData, [
            'initialRates' => $initialRates,
        ]);
    }
}
