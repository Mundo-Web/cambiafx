<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Brand;
use App\Models\Faq;
use App\Models\LandingHome;
use App\Models\Service;
use App\Models\Specialty;
use App\Models\Testimony;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ServiceController extends BasicController
{
    public $model = Service::class;
    public $reactView = 'ServiciosPage';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');

        $services = Service::where('status', true)
            ->where('visible', true)
            ->where('lang_id', $langId)
            ->orderBy('created_at', 'ASC')
            ->get();

        $brands = Brand::where('status', true)->where('visible', true)->orderBy('updated_at', 'DESC')->get();
        $testimonios = Testimony::where('status', true)->where('lang_id', $langId)->get();

        $banner_slider = Banner::where('status', true)
            ->where('visible', true)
            ->where('section', 'servicios')
            ->where('position', 'slider')
            ->orderBy('order', 'asc')
            ->get();

        $faqs = Faq::where('status', true)
            ->where('visible', true)
            ->where('lang_id', $langId)
            ->get();

        $pasos = Specialty::where('visible', true)
            ->where('lang_id', $langId)
            ->orderBy('created_at', 'asc')
            ->get();

        $landing = LandingHome::where('lang_id', $langId)->get();

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
            'services' => $services,
            'allServices' => $services,
            'pasos' => $pasos,
            'brands' => $brands,
            'testimonios' => $testimonios,
            'banner_slider' => $banner_slider,
            'faqs' => $faqs,
            'initialRates' => $initialRates,
            'seoTitle' => 'Servicios de Cambio de Dólares y Divisas Online en Perú | Cambia FX',
            'seoDescription' => 'Conoce los servicios de Cambia FX: Compra y venta de dólares online, Transferencia FX interbancaria a baja comisión y RapiCash FX para convertir tu línea de crédito en efectivo con transferencias inmediatas en Perú.',
            'seoKeywords' => 'servicios cambia fx, cambio de dolares online peru, transferencia fx, rapicash fx, casa de cambio digital sbs, comprar dolares peru, transferencias interbancarias inmediatas, cambio de divisas',
            'breadcrumbs' => [
                ['name' => 'Inicio', 'url' => '/'],
                ['name' => 'Servicios', 'url' => '/servicios']
            ],
        ];
    }
}
