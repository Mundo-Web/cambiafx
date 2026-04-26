<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use App\Helpers\SeoHelper;

class SeoMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Compartir los datos SEO con todas las vistas
        View::share('seoHelper', new SeoHelper());
        
        // Obtener datos SEO específicos para esta página
        $routeName = $request->route()->getName();
        $seoData = $this->getPageSeoData($routeName);
        
        // Compartir datos SEO específicos de la página
        View::share('seoTitle', $seoData['title']);
        View::share('seoDescription', $seoData['description']);
        View::share('seoKeywords', $seoData['keywords']);
        View::share('seoImage', $seoData['image']);
        View::share('seoUrl', $seoData['url']);
        View::share('ogTitle', $seoData['og_title'] ?? null);
        View::share('ogDescription', $seoData['og_description'] ?? null);
        
        return $next($request);
    }
    
    /**
     * Obtiene los datos SEO específicos para cada página
     */
    private function getPageSeoData($routeName)
    {
        $seoData = SeoHelper::getSeoData();
        $defaultImage = $seoData['og_image_default'] ?? $seoData['company_logo'] ?? '/assets/img/icon.png';
        
        // Configuración SEO específica por página
        $pageConfigs = [
            'Home.jsx' => [
                'title' => $seoData['seo_title'] ?? 'CambiaFX - Casa de Cambio Online',
                'description' => $seoData['seo_description'] ?? 'Casa de cambio online con las mejores tasas de cambio. Compra y vende dólares de forma segura y rápida.',
                'keywords' => $seoData['seo_keywords'] ?? 'casa de cambio, cambio de dólares, cambio de soles, tipo de cambio',
                'image' => $defaultImage,
                'url' => url('/')
            ],
            'Nosotros.jsx' => [
                'title' => 'Nosotros - CambiaFX',
                'description' => 'Conoce más sobre CambiaFX, tu casa de cambio de confianza. Experiencia, seguridad y las mejores tasas del mercado.',
                'keywords' => 'nosotros, sobre cambiafx, casa de cambio confiable, experiencia',
                'image' => $defaultImage,
                'url' => url('/nosotros')
            ],
            'Contacto.jsx' => [
                'title' => 'Contacto y Soporte - Cambia FX | Casa de Cambio Online en Peru',
                'description' => '¿Tienes dudas sobre tu cambio de dolares? Contactanos por WhatsApp, telefono o correo. Soporte personalizado de Cambia FX, rapidez y seguridad garantizada.',
                'keywords' => 'contacto, soporte, atención al cliente, ayuda cambiafx, telefono cambiafx, whatsapp cambiafx',
                'image' => $defaultImage,
                'url' => url('/contacto')
            ],
            'Servicios.jsx' => [
                'title' => 'Servicios de Cambio de Moneda Online en Peru | Cambia FX',
                'description' => 'Descubre como cambiar dolares y soles de forma segura con Cambia FX. Transferencias inmediatas, mejores tasas que el banco y atencion preferencial.',
                'keywords' => 'servicios, cambio divisas, cambio dólares, cambio euros, transferencia inmediata, casa de cambio online',
                'image' => $defaultImage,
                'url' => url('/servicios')
            ],
            'Blog.jsx' => [
                'title' => 'Blog sobre tipo de cambio y economia en Peru | Cambia FX',
                'description' => 'Noticias del dolar en Peru, analisis del tipo de cambio y consejos financieros actualizados. Por Cambia FX, casa de cambio digital registrada en la SBS.',
                'og_title' => 'Blog sobre tipo de cambio en Peru | Cambia FX',
                'og_description' => 'Noticias del dolar, analisis del tipo de cambio y consejos financieros. Cambia FX, SBS.',
                'keywords' => 'blog, noticias, tipo de cambio, economía, tips financieros, dolar peru, sbs',
                'image' => $defaultImage,
                'url' => url('/blog')
            ]
        ];
        
        // Configuración por defecto
        $defaultConfig = [
            'title' => $seoData['seo_title'] ?? 'CambiaFX - Casa de Cambio Online',
            'description' => $seoData['seo_description'] ?? 'Casa de cambio online con las mejores tasas de cambio.',
            'keywords' => $seoData['seo_keywords'] ?? 'casa de cambio, cambio de dólares',
            'image' => $defaultImage,
            'url' => url()->current(),
            'og_title' => null,
            'og_description' => null
        ];
        
        return $pageConfigs[$routeName] ?? $defaultConfig;
    }
}
