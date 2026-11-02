<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\Ad;
use App\Models\App;
use App\Models\Banner;
use App\Models\Benefit;
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

class HomeEmpresaController extends BasicController
{
    public $reactView = 'HomeEmpresa';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {

        $langId = app('current_lang_id');

        $landing = LandingHome::where('correlative', 'like', 'page_empresas%')->where('lang_id', $langId)->get();
        /*CAMBIO Y GERENCIA */
        $sliders = Slider::where('status', true)->where('visible', true)->orderBy('created_at', 'DESC')->get();
        $brands = Brand::where('status', true)->where('visible', true)->orderBy('created_at', 'DESC')->get();
        $strengths = Strength::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $posts = Post::where('status', true)->orderBy('created_at', 'desc')->with('category')->where('lang_id', $langId)->limit(10)->get();
        $testimonios = Testimony::where('status', true)->where('lang_id', $langId)->get();
        $indicators = Indicator::where('status', true)->where('correlative','empresas_stats')->where('lang_id', $langId)->get();

        $allServices = Service::where('status', true)->where('lang_id', $langId)->get();



        $apps = App::where('visible', true)->get();
        $pasos = Specialty::where('visible', true)
            ->where('lang_id', $langId)
            ->orderBy('created_at', 'asc')
            ->get();
        $cupones = Coupon::where('status', true)

            ->orderBy('created_at', 'desc')
          
            ->get();

        $core_values = CoreValue::where('status', true)
            ->where('lang_id', $langId)
        
            ->get();

        $benefits = Benefit::where('status', true)
            ->where('visible', true)
            ->where('correlative', 'empresas')
           
            ->orderBy('order', 'asc')
            ->get();

        $banner = Banner::where('status', true)
            ->where('visible', true)
            ->where('section', 'empresa')
            ->where('position', 'primera_operacion')
            ->orderBy('created_at', 'desc')
            ->first();

        $bannerEmpresas = Banner::where('status', true)
            ->where('visible', true)
            ->where('section', 'empresa')
            ->where('position', 'cambia_empresas')
            ->orderBy('created_at', 'desc')
            ->first();

        $faqs = Faq::where('status', true)
            ->where('visible', true)
            ->whereNull('service_id')
            ->where('lang_id', $langId)
            ->get();

        // Tipo de cambio en tiempo real (reutiliza caché de 30s)
        $initialRates = Cache::remember('current_rates_home', 30, function () {
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
            'beneficios' => $benefits,
            'banner' => $banner,
            'bannerEmpresas' => $bannerEmpresas,
            'faqs' => $faqs,
            'initialRates' => $initialRates,
            'seoTitle' => 'Cambia FX Empresas | Tipo de Cambio Preferencial y Gestión Corporativa en Perú',
            'seoDescription' => 'Cambia dólares y soles para tu empresa en Perú. Cotizaciones preferenciales por volumen, transferencias interbancarias inmediatas y factura electrónica SUNAT.',
            'seoKeywords' => 'cambio de divisas empresas, tipo de cambio corporativo peru, comprar dolares ruc 20, casa de cambio empresas sbs, cambia fx empresas, transferencias interbancarias empresas, facturacion electronica dolares',
            'breadcrumbs' => [
                ['name' => 'Inicio', 'url' => '/'],
                ['name' => 'Empresas', 'url' => '/empresas']
            ],
        ];
    }
}
