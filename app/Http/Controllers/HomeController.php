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

class HomeController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {

        $langId = app('current_lang_id');

        $landing = LandingHome::where('correlative', 'like', 'page_home%')->where('lang_id', $langId)->get();
        /*CAMBIO Y GERENCIA */
        $sliders = Slider::where('status', true)->where('visible', true)->orderBy('created_at', 'DESC')->get();
        $brands = Brand::where('status', true)->where('visible', true)->orderBy('created_at', 'DESC')->get();
        $strengths = Strength::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $posts = Post::where('status', true)->orderBy('created_at', 'desc')->with('category')->where('lang_id', $langId)->limit(10)->get();
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
    }
}
