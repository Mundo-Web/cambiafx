@php
    $component = Route::currentRouteName();
    // Obtener datos SEO de la tabla generals
    $seoData = App\Helpers\SeoHelper::getSeoData();
    $basicMeta = App\Helpers\SeoHelper::getBasicMetaTags($seoTitle ?? null, $seoDescription ?? null, $seoKeywords ?? null);
    $openGraphTags = App\Helpers\SeoHelper::getOpenGraphTags($seoTitle ?? null, $seoDescription ?? null, $seoImage ?? null, $seoUrl ?? null);
    $twitterCardTags = App\Helpers\SeoHelper::getTwitterCardTags($seoTitle ?? null, $seoDescription ?? null, $seoImage ?? null);
    $jsonLD = App\Helpers\SeoHelper::getJsonLD();
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    
    <!-- SEO Meta Tags -->
    <title>{{ $basicMeta['title'] }}</title>
    <meta name="description" content="{{ $basicMeta['description'] }}" />
    <meta name="keywords" content="{{ $basicMeta['keywords'] }}" />
    <meta name="author" content="{{ $seoData['company_name'] ?? 'CambiaFX' }}" />
    <meta name="robots" content="index, follow" />
    <meta name="csrf_token" content="{{ csrf_token() }}">
    
    <!-- Open Graph Meta Tags para redes sociales -->
    @foreach($openGraphTags as $property => $content)
        <meta property="{{ $property }}" content="{{ $content }}" />
    @endforeach
    
    <!-- Twitter Card Meta Tags -->
    @foreach($twitterCardTags as $name => $content)
        <meta name="{{ $name }}" content="{{ $content }}" />
    @endforeach
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
        {!! json_encode($jsonLD, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>
    
    <!-- PWA Configuration -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#007bff">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="CambiaFX">
    <link rel="apple-touch-icon" href="/icon-192x192.png">
    
    <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/png">

    <!-- Resource Hints para mejorar performance -->
    <!-- DNS-Prefetch para dominios externos -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="//unpkg.com">
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="//translate.google.com">
    <link rel="dns-prefetch" href="//checkout.culqi.com">
    <link rel="dns-prefetch" href="//connect.facebook.net">
    <link rel="dns-prefetch" href="//embed.tawk.to">
    
    <!-- Preconnect para recursos críticos -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Preload de fuentes críticas -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" as="style">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap" as="style">
    
    <!-- Preload de imagen LCP (Hero) - Ajusta la ruta según tu imagen principal -->
    @if(Route::currentRouteName() === 'Home.jsx')
    <link rel="preload" as="image" href="/assets/img/hero-banner.webp" fetchpriority="high">
    @endif

    <link href="/lte/assets/css/icons.min.css" rel="stylesheet" type="text/css" />

    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" media="print" onload="this.media='all'">

    <!-- Fuentes optimizadas con font-display: swap -->
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" media="print" onload="this.media='all'" />

    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" media="print" onload="this.media='all'">

    <!--CAMBIO GERENCIA-->
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Añadido para traducir - Defer para no bloquear render -->
    <script>
        function loadGoogleTranslate() {
            new google.translate.TranslateElement({
                pageLanguage: 'es',
                includedLanguages: 'es,en',
                autoDisplay: false
            }, 'google_translate_element');
        }
    </script>
    <script defer src="https://translate.google.com/translate_a/element.js?cb=loadGoogleTranslate"></script>

    <style>
        * {
            box-sizing: border-box;
        }
        
        /* Critical CSS para evitar CLS */
        img, picture, video {
            max-width: 100%;
            height: auto;
        }
        
        /* Aspect ratio para evitar layout shift */
        .aspect-ratio-16-9 {
            aspect-ratio: 16 / 9;
        }
        
        .aspect-ratio-1-1 {
            aspect-ratio: 1 / 1;
        }
    </style>

    @if ($component == 'Checkout.jsx')
        <script type="application/javascript" src="https://checkout.culqi.com/js/v4"></script>
    @elseif ($component == 'MyAccount.jsx')
        <link href="/lte/assets/libs/dxdatagrid/css/dx.light.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
            rel="stylesheet" type="text/css" id="dg-default-stylesheet" />
        <link href="/lte/assets/libs/dxdatagrid/css/dx.dark.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
            rel="stylesheet" type="text/css" id="dg-dark-stylesheet" disabled="disabled" />
    @endif

    @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
    @inertiaHead

    <link href="/lte/assets/libs/quill/quill.snow.css" rel="stylesheet" type="text/css" />
    <link href="/lte/assets/libs/quill/quill.bubble.css" rel="stylesheet" type="text/css" />
    <style>
        .ql-editor blockquote {
            border-left: 4px solid #f8b62c;
            padding-left: 16px;
        }

        .ql-editor * {
            color: #475569;
        }

        .ql-editor img {
            border-radius: 8px;
        }
    </style>

    <!-- Meta Pixel Code -->
    <script>
        ! function(f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1098274404490481');
        fbq('track', 'PageView');
    </script>
    <noscript>
        <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=1098274404490481&ev=PageView&noscript=1" />
    </noscript>
    <!-- End Meta Pixel Code -->
    <link rel="stylesheet" href="/assets/fonts/aspekta/font-face.css" />
</head>

<style>
    body {
        /*background-image: url('/assets/img/maqueta/Blog.png');*/
        width: 100%;
        height: auto;
        background-size: 100% auto;
        background-repeat: no-repeat;
        /* Asegura que la imagen no se repita */
        background-position: top center;
        /* Centra la imagen en la parte superior */
    }
</style>

<body class="font-poppins">
    @inertia

    <script src="/lte/assets/js/vendor.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js"></script>
    <script src="/lte/assets/libs/moment/min/moment.min.js"></script>
    <script src="/lte/assets/libs/moment/moment-timezone.js"></script>
    <script src="/lte/assets/libs/moment/locale/es.js"></script>
    <script src="/lte/assets/libs/quill/quill.min.js"></script>

    @if ($component == 'MyAccount.jsx')
        <script src="/lte/assets/libs/dxdatagrid/js/dx.all.js"></script>
        <script src="/lte/assets/libs/dxdatagrid/js/localization/dx.messages.es.js"></script>
        <script src="/lte/assets/libs/dxdatagrid/js/localization/dx.messages.en.js"></script>
    @endif

    <script src="/lte/assets/libs/tippy.js/tippy.all.min.js"></script>

    <script>
        document.addEventListener('click', function(event) {
            const target = event.target;

            if (target.tagName === 'BUTTON' && target.hasAttribute('href')) {
                const href = target.getAttribute('href');

                if (target.getAttribute('target') === '_blank') {
                    window.open(href, '_blank');
                } else {
                    window.location.href = href;
                }
            }
        });
    </script>

    <!--Start of Tawk.to Script-->
    <script type="text/javascript">
        var Tawk_API=Tawk_API||{};
        Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/5c3563c212db2461b16b4a9b/default';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
    </script>
    <!--End of Tawk.to Script-->

    <!-- PWA Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/serviceworker.js')
                    .then(function(registration) {
                        //console.log('PWA: Service Worker registered successfully:', registration.scope);
                    })
                    .catch(function(error) {
                        //console.log('PWA: Service Worker registration failed:', error);
                    });
            });
        }
    </script>
</body>

</html>
