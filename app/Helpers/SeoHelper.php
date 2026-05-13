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
                'company_country',
                'og_image_default',
                'twitter_image_default'
            ])
            ->where('lang_id', app('current_lang_id'))
            ->get();

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
            'og:site_name' => $seoData['company_name'] ?? 'CambiaFX',
            'og:image:type' => str_ends_with($image, '.png') ? 'image/png' : 'image/jpeg',
            'og:image:width' => '1200',
            'og:image:height' => '630',
            'og:image:secure_url' => str_starts_with($image, 'http') ? $image : url($image)
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
     * Genera el JSON-LD para Schema.org (Solo Organización por defecto)
     */
    public static function getJsonLD()
    {
        $seoData = self::getSeoData();
        $logo = $seoData['company_logo'] ?? $seoData['og_image_default'] ?? '/assets/img/icon-192x192.png';
        
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

    /**
     * Genera el JSON-LD para NewsArticle
     */
    public static function getNewsArticleSchema($article)
    {
        if (!$article) {
            return null;
        }

        $seoData = self::getSeoData();
        $logo = $seoData['company_logo'] ?? $seoData['og_image_default'] ?? '/assets/img/icon-192x192.png';

        $name = $article->name ?? $article['name'] ?? '';
        $image = $article->image ?? $article['image'] ?? '';
        $postDate = $article->post_date ?? $article['post_date'] ?? null;
        $createdAt = $article->created_at ?? $article['created_at'] ?? null;
        $updatedAt = $article->updated_at ?? $article['updated_at'] ?? null;
        $description = $article->description ?? $article['description'] ?? '';

        $authorName = ($article->author ?? $article['author'] ?? null) ?: 'Equipo Cambia FX';
        $authorType = ($article->author_type ?? $article['author_type'] ?? null) ?: 'Organization';

        return [
            '@context' => 'https://schema.org',
            '@type' => 'NewsArticle',
            'headline' => $name,
            'image' => [
                str_starts_with($image, 'http') ? $image : url("/api/posts/media/{$image}")
            ],
            'datePublished' => $postDate ?? $createdAt,
            'dateModified' => $updatedAt ?? $postDate ?? $createdAt,
            'author' => [
                [
                    '@type' => $authorType,
                    'name' => $authorName,
                    'url' => url('/')
                ]
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => $seoData['company_name'] ?? 'Cambia FX',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => str_starts_with($logo, 'http') ? $logo : url($logo)
                ]
            ],
            'description' => strip_tags($description)
        ];
    }

    /**
     * Genera el JSON-LD para FAQPage
     */
    public static function getFaqSchema($faqs = [])
    {
        if (empty($faqs)) {
            return null;
        }

        $questions = [];
        foreach ($faqs as $faq) {
            // Soporte para estructura de landing transactional (question/answer) 
            // y estructura de tabla faqs (name/description)
            $question = $faq['question'] ?? $faq['name'] ?? $faq->question ?? $faq->name ?? '';
            $answer = $faq['answer'] ?? $faq['description'] ?? $faq->answer ?? $faq->description ?? '';

            if (empty($question) || empty($answer)) continue;

            $questions[] = [
                '@type' => 'Question',
                'name' => $question,
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => strip_tags($answer)
                ]
            ];
        }

        if (empty($questions)) return null;

        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $questions
        ];
    }

    /**
     * Genera el JSON-LD para BreadcrumbList
     */
    public static function getBreadcrumbSchema($items = [])
    {
        if (empty($items)) {
            return null;
        }

        $itemListElement = [];
        foreach ($items as $index => $item) {
            $name = $item['name'] ?? $item->name ?? '';
            $url = $item['url'] ?? $item->url ?? '';
            $itemListElement[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $name,
                'item' => str_starts_with($url, 'http') ? $url : url($url)
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $itemListElement
        ];
    }

    /**
     * Genera el JSON-LD para FinancialService
     */
    public static function getFinancialServiceSchema($service)
    {
        if (!$service) {
            return null;
        }

        $seoData = self::getSeoData();
        $logo = $seoData['company_logo'] ?? $seoData['og_image_default'] ?? '/assets/img/icon-192x192.png';

        return [
            '@context' => 'https://schema.org',
            '@type' => 'FinancialService',
            'name' => $service['name'] ?? '',
            'description' => $service['description'] ?? '',
            'url' => url()->current(),
            'logo' => str_starts_with($logo, 'http') ? $logo : url($logo),
            'telephone' => $seoData['company_phone'] ?? '+51 922 985 423',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $seoData['company_address'] ?? '',
                'addressLocality' => $seoData['company_locality'] ?? '',
                'addressRegion' => $seoData['company_region'] ?? '',
                'addressCountry' => $seoData['company_country'] ?? 'PE'
            ],
            'serviceType' => 'Currency Exchange',
            'areaServed' => 'PE',
            'provider' => [
                '@type' => 'Organization',
                'name' => $seoData['company_name'] ?? 'Cambia FX'
            ]
        ];
    }
}
