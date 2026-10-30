{{-- 
    Componente para generar meta tags SEO 
    Uso: @include('components.seo-meta-tags', ['title' => 'Mi Título', 'description' => 'Mi descripción'])
--}}

@php
    // Obtener datos SEO de la tabla generals
    $seoData = App\Helpers\SeoHelper::getSeoData();
    $basicMeta = App\Helpers\SeoHelper::getBasicMetaTags($title ?? null, $description ?? null, $keywords ?? null);
    $openGraphTags = App\Helpers\SeoHelper::getOpenGraphTags($ogTitle ?? $title ?? null, $ogDescription ?? $description ?? null, $image ?? null, $url ?? null);
    $twitterCardTags = App\Helpers\SeoHelper::getTwitterCardTags($ogTitle ?? $title ?? null, $ogDescription ?? $description ?? null, $image ?? null);

    // Estandarización de Canonical a sin-www (Requerimiento A2)
    $canonicalUrl = $url ?? url()->current();
    $canonicalUrl = str_replace('://www.cambiafx.pe', '://cambiafx.pe', $canonicalUrl);

    // Esquemas JSON-LD (Requerimiento A4 para Google y modelos de IA)
    $jsonLD = App\Helpers\SeoHelper::getJsonLD(); // Organization + FinancialService unificado en todas las páginas
    $webSiteSchema = request()->is('/') ? App\Helpers\SeoHelper::getWebSiteSchema() : null; // WebSite con SearchAction en Home
    $faqSchema = App\Helpers\SeoHelper::getFaqSchema($faqs ?? null); // FAQPage en landings
    $articleSchema = isset($article) ? App\Helpers\SeoHelper::getNewsArticleSchema($article) : null; // Article en posts
    $breadcrumbSchema = App\Helpers\SeoHelper::getBreadcrumbSchema($breadcrumbs ?? null); // BreadcrumbList en landings y posts
@endphp

<!-- SEO Meta Tags -->
<title>{{ $basicMeta['title'] }}</title>
<meta name="description" content="{{ $basicMeta['description'] }}" />
<meta name="keywords" content="{{ $basicMeta['keywords'] }}" />
<meta name="author" content="{{ $seoData['company_name'] ?? 'Cambia FX' }}" />
<meta name="robots" content="index, follow" />

<!-- Open Graph Meta Tags para redes sociales -->
@foreach($openGraphTags as $property => $content)
    @if($content)
        <meta property="{{ $property }}" content="{{ $content }}" />
    @endif
@endforeach

<!-- Twitter Card Meta Tags -->
@foreach($twitterCardTags as $name => $content)
    @if($content)
        <meta name="{{ $name }}" content="{{ $content }}" />
    @endif
@endforeach

<!-- Canonical URL Consolidado (sin www) -->
<link rel="canonical" href="{{ $canonicalUrl }}" />

<!-- 1. Schema.org JSON-LD: Organization + FinancialService (En todas las páginas) -->
@if(!empty($jsonLD))
<script type="application/ld+json">
    {!! json_encode($jsonLD, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- 2. Schema.org JSON-LD: WebSite con SearchAction (En Home) -->
@if(!empty($webSiteSchema))
<script type="application/ld+json">
    {!! json_encode($webSiteSchema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- 3. Schema.org JSON-LD: FAQPage (En Landings SEO) -->
@if(!empty($faqSchema))
<script type="application/ld+json">
    {!! json_encode($faqSchema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- 4. Schema.org JSON-LD: Article (En Posts del Blog) -->
@if(!empty($articleSchema))
<script type="application/ld+json">
    {!! json_encode($articleSchema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- 5. Schema.org JSON-LD: BreadcrumbList (En Landings y Posts) -->
@if(!empty($breadcrumbSchema))
<script type="application/ld+json">
    {!! json_encode($breadcrumbSchema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- Verificación de sitio web (Google, Bing, etc.) -->
@if(isset($seoData['google_site_verification']) && $seoData['google_site_verification'])
    <meta name="google-site-verification" content="{{ $seoData['google_site_verification'] }}" />
@endif

@if(isset($seoData['bing_site_verification']) && $seoData['bing_site_verification'])
    <meta name="msvalidate.01" content="{{ $seoData['bing_site_verification'] }}" />
@endif

<!-- Idioma del contenido -->
<meta name="language" content="es" />
<meta property="og:locale" content="es_PE" />

<!-- Información adicional -->
<meta name="distribution" content="global" />
<meta name="revisit-after" content="1 days" />
<meta name="rating" content="general" />

<!-- Prevenir traducción automática -->
<meta name="google" content="notranslate" />
