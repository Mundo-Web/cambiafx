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
    $jsonLD = App\Helpers\SeoHelper::getJsonLD($schemaType ?? 'Organization');
    $faqSchema = isset($faqs) ? App\Helpers\SeoHelper::getFaqSchema($faqs) : null;
    $breadcrumbSchema = isset($breadcrumbs) ? App\Helpers\SeoHelper::getBreadcrumbSchema($breadcrumbs) : null;
    $newsArticleSchema = isset($article) ? App\Helpers\SeoHelper::getNewsArticleSchema($article) : null;
    $financialServiceSchema = isset($financialService) ? App\Helpers\SeoHelper::getFinancialServiceSchema($financialService) : null;
@endphp

<!-- SEO Meta Tags -->
<title>{{ $basicMeta['title'] }}</title>
<meta name="description" content="{{ $basicMeta['description'] }}" />
<meta name="keywords" content="{{ $basicMeta['keywords'] }}" />
<meta name="author" content="{{ $seoData['company_name'] ?? 'CambiaFX' }}" />
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

<!-- Canonical URL -->
<link rel="canonical" href="{{ $url ?? url()->current() }}" />

<!-- Schema.org JSON-LD -->
@if(!empty($jsonLD))
<script type="application/ld+json">
    {!! json_encode($jsonLD, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- FAQ Schema.org JSON-LD -->
@if(!empty($faqSchema))
<script type="application/ld+json">
    {!! json_encode($faqSchema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- Breadcrumb Schema.org JSON-LD -->
@if(!empty($breadcrumbSchema))
<script type="application/ld+json">
    {!! json_encode($breadcrumbSchema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- NewsArticle Schema.org JSON-LD -->
@if(!empty($newsArticleSchema))
<script type="application/ld+json">
    {!! json_encode($newsArticleSchema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif

<!-- FinancialService Schema.org JSON-LD -->
@if(!empty($financialServiceSchema))
<script type="application/ld+json">
    {!! json_encode($financialServiceSchema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
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
