<?php

namespace App\Helpers;

use App\Models\General;
use Illuminate\Support\Facades\Cache;

class SeoHelper
{
    /**
     * Obtiene los datos SEO de la tabla generals
     */
    public static function getSeoData()
    {
        return Cache::remember('seo_data', 3600, function () {
            $generals = General::whereIn('correlative', [
                'seo_title',
                'seo_description', 
                'seo_keywords',
                'company_name',
                'company_description',
                'company_logo',
                'company_url',
                'company_phone',
                'company_email',
                'company_address',
                'twitter_site',
                'facebook_page',
                'instagram_profile',
                'linkedin_profile',
                'company_locality',
                'company_region',
                'company_country'
            ])->get();

            $seoData = [];
            foreach ($generals as $general) {
                $seoData[$general->correlative] = $general->description;
            }

            return $seoData;
        });
    }

    /**
     * Obtiene el valor de un correlativo específico
     */
    public static function getValue($correlative, $default = '')
    {
        $seoData = self::getSeoData();
        return $seoData[$correlative] ?? $default;
    }

    /**
     * Genera las meta tags SEO básicas
     */
    public static function getBasicMetaTags($title = null, $description = null, $keywords = null)
    {
        $seoData = self::getSeoData();
        
        $title = $title ?? $seoData['seo_title'] ?? 'CambiaFX - Casa de Cambio Online';
        $description = $description ?? $seoData['seo_description'] ?? 'Casa de cambio online con las mejores tasas de cambio. Compra y vende dólares de forma segura y rápida.';
        $keywords = $keywords ?? $seoData['seo_keywords'] ?? 'casa de cambio, cambio de dólares, cambio de soles, tipo de cambio, compra dólares';
        
        return [
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords
        ];
    }

    /**
     * Genera las meta tags Open Graph para redes sociales
     */
    public static function getOpenGraphTags($title = null, $description = null, $image = null, $url = null)
    {
        $seoData = self::getSeoData();
        
        $title = $title ?? $seoData['seo_title'] ?? 'CambiaFX - Casa de Cambio Online';
        $description = $description ?? $seoData['seo_description'] ?? 'Casa de cambio online con las mejores tasas de cambio. Compra y vende dólares de forma rápida, segura y al mejor tipo de cambio usando bancos peruanos.';
        
        // Prioridad de imagen: Específica > og_image_default > company_logo > icon.png
        $image = $image ?? $seoData['og_image_default'] ?? $seoData['company_logo'] ?? '/assets/img/icon.png';
        $url = $url ?? $seoData['company_url'] ?? url()->current();
        
        return [
            'og:title' => $title,
            'og:description' => $description,
            'og:image' => str_starts_with($image, 'http') ? $image : url($image),
            'og:url' => $url,
            'og:type' => 'website',
            'og:site_name' => $seoData['company_name'] ?? 'CambiaFX'
        ];
    }

    /**
     * Genera las meta tags Twitter Card
     */
    public static function getTwitterCardTags($title = null, $description = null, $image = null)
    {
        $seoData = self::getSeoData();
        
        $title = $title ?? $seoData['seo_title'] ?? 'CambiaFX - Casa de Cambio Online';
        $description = $description ?? $seoData['seo_description'] ?? 'Casa de cambio online con las mejores tasas de cambio. Compra y vende dólares de forma rápida, segura y al mejor tipo de cambio usando bancos peruanos.';
        
        // Prioridad de imagen: Específica > twitter_image_default > og_image_default > company_logo > icon.png
        $image = $image ?? $seoData['twitter_image_default'] ?? $seoData['og_image_default'] ?? $seoData['company_logo'] ?? '/assets/img/icon.png';
        $twitterSite = $seoData['twitter_site'] ?? '@cambiafx';
        
        return [
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $title,
            'twitter:description' => $description,
            'twitter:image' => str_starts_with($image, 'http') ? $image : url($image),
            'twitter:site' => $twitterSite,
            'twitter:creator' => $twitterSite,
            'twitter:url' => url()->current(),
            'twitter:domain' => request()->getHost()
        ];
    }

    /**
     * Genera el JSON-LD para Schema.org
     */
    public static function getJsonLD($type = 'Organization')
    {
        $seoData = self::getSeoData();
        
        if ($type === 'Organization') {
            $logo = $seoData['company_logo'] ?? '/assets/img/icon-192x192.png';
            return [
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                'name' => $seoData['company_name'] ?? 'Cambia FX',
                'description' => $seoData['company_description'] ?? $seoData['seo_description'] ?? 'Casa de cambio online con las mejores tasas de cambio',
                'url' => $seoData['company_url'] ?? url('/'),
                'logo' => str_starts_with($logo, 'http') ? $logo : url($logo),
                'telephone' => $seoData['company_phone'] ?? '+51 922 985 423',
                'email' => $seoData['company_email'] ?? 'hola@cambiafx.pe',
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress' => $seoData['company_address'] ?? 'Av. Javier Prado Este N.560 Of. 2302',
                    'addressLocality' => $seoData['company_locality'] ?? 'San Isidro',
                    'addressRegion' => $seoData['company_region'] ?? 'Lima',
                    'addressCountry' => $seoData['company_country'] ?? 'PE'
                ],
                'sameAs' => \App\Models\Social::where('visible', true)->pluck('link')->toArray()
            ];
        }
        
        return [];
    }
}
