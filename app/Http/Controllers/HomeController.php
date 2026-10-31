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

class HomeController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');

        // Caché de 30 minutos con payload podado para reducir TTFB y tamaño de HTML de 220KB a ~40KB
        return Cache::remember("home_view_data_{$langId}", 1800, function () use ($langId) {
            $landing = LandingHome::select('id', 'correlative', 'title', 'subtitle', 'description', 'image', 'link', 'is_video', 'video')
                ->where('correlative', 'like', 'page_home%')
                ->where('lang_id', $langId)
                ->get();

            // Solo los 6 posts más recientes con columnas estrictas (sin content ni description pesados)
            $posts = Post::select('id', 'name', 'slug', 'image', 'created_at')
                ->where('status', true)
                ->where('lang_id', $langId)
                ->orderBy('created_at', 'desc')
                ->limit(6)
                ->get();

            $indicators = Indicator::select('id', 'correlative', 'name', 'description')
                ->where('status', true)
                ->where('lang_id', $langId)
                ->get();

            $apps = App::select('id', 'name', 'image', 'link', 'visible')
                ->where('visible', true)
                ->get();

            $pasos = Specialty::select('id', 'name', 'description', 'image', 'visible')
                ->where('visible', true)
                ->where('lang_id', $langId)
                ->orderBy('created_at', 'asc')
                ->get();

            $cupones = Coupon::where('status', true)
                ->where(function($query) {
                    $query->where(function($subQuery) {
                        $subQuery->where('date_begin', '<=', now())
                                 ->where('date_end', '>=', now());
                    })->orWhere(function($subQuery) {
                        $subQuery->whereNull('date_begin')
                                 ->whereNull('date_end');
                    })->orWhere(function($subQuery) {
                        $subQuery->where('date_begin', '<=', now())
                                 ->whereNull('date_end');
                    })->orWhere(function($subQuery) {
                        $subQuery->whereNull('date_begin')
                                 ->where('date_end', '>=', now());
                    });
                })
                ->orderBy('created_at', 'desc')
                ->get();

            $core_values = CoreValue::select('id', 'name', 'description', 'image', 'icon', 'status')
                ->where('status', true)
                ->where('lang_id', $langId)
                ->get();

            $banner_operacion = Banner::select('id', 'name', 'image', 'image_mobile', 'link', 'title', 'description', 'position', 'section')
                ->where('status', true)
                ->where('visible', true)
                ->where('section', 'home')
                ->where('position', 'primera_operacion')
                ->orderBy('created_at', 'desc')
                ->first();

            $banner_slider = Banner::select('id', 'name', 'image', 'image_mobile', 'link', 'title', 'description', 'position', 'section', 'order')
                ->where('status', true)
                ->where('visible', true)
                ->where('section', 'home')
                ->where('position', 'cambia_empresas')
                ->orderBy('order', 'asc')
                ->get();

            $faqs = Faq::select('id', 'name', 'description')
                ->where('status', true)
                ->where('visible', true)
                ->whereNull('service_id')
                ->where('lang_id', $langId)
                ->get();

            return [
                'landing' => $landing,
                'sliders' => [],      // Secciones comentadas en Home.jsx - se evitan consultas innecesarias
                'brands' => [],
                'strengths' => [],
                'testimonios' => [],
                'allServices' => [],
                'posts' => $posts,
                'indicators' => $indicators,
                'apps' => $apps,
                'pasos' => $pasos,
                'cupones' => $cupones,
                'core_values' => $core_values,
                'banner_operacion' => $banner_operacion,
                'banner_slider' => $banner_slider,
                'faqs' => $faqs
            ];
        });
    }
}
