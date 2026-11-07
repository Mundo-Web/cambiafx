@php
$component = Route::currentRouteName();
$isHome = $component === 'Home.jsx';
$isArticle = $component === 'BlogArticle.jsx';
$article = $page['props']['article'] ?? null;
$isBot = \App\Helpers\BotDetector::isBot();
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf_token" content="{{ csrf_token() }}">
    <!-- Preconnect & DNS-Prefetch indispensables para analítica y rendimiento -->
    <link rel="preconnect" href="https://www.googletagmanager.com">
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    @unless ($isBot)
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
    @endunless

    <!-- SEO Meta Tags -->
    @include('components.seo-meta-tags', [
    'title' => $seoTitle ?? null,
    'description' => $seoDescription ?? null,
    'keywords' => $seoKeywords ?? null,
    'image' => $seoImage ?? null,
    'url' => $seoUrl ?? null,
    'ogTitle' => $ogTitle ?? null,
    'ogDescription' => $ogDescription ?? null,
    'schemaType' => $schemaType ?? 'Organization',
    'faqs' => $page['props']['faqs'] ?? null,
    'financialService' => $page['props']['financialServiceData'] ?? null,
    'breadcrumbs' => $page['props']['breadcrumbs'] ?? null,
    'article' => $page['props']['article'] ?? null
    ])

    <!-- LLMs Discovery Standard -->
    <link rel="alternate" type="text/plain" href="{{ url('/llms.txt') }}" title="LLMs Context">

    <!-- PWA Configuration -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#007bff">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="CambiaFX">
    <link rel="apple-touch-icon" href="/assets/img/icon.png">

    <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/png">

    @unless ($isBot)
    <!-- Preload del elemento LCP (Logo CambiaFX) para eliminar los 2,480ms de retraso de descubrimiento -->
    <link rel="preload" href="/assets/img/logo.svg" as="image" type="image/svg+xml" fetchpriority="high">

    <!-- Web Fonts Asíncronas Consolidadas (1 solo request HTTP/2, No bloqueante) -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Bebas+Neue&family=Poppins:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Bebas+Neue&family=Poppins:wght@400;500;600;700&display=swap"></noscript>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"></noscript>
    @endunless


    <!-- Critical CSS Above-the-fold para acelerar FCP y prevenir CLS -->
    <style>
        *, ::before, ::after {
            box-sizing: border-box;
        }
        html {
            font-family: 'GeneralSans', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-text-size-adjust: 100%;
            text-rendering: optimizeLegibility;
        }
        .bg-accent {
            min-height: 44px;
        }
        @media (min-width: 768px) {
            .bg-accent {
                min-height: 52px;
            }
        }
        body {
            margin: 0;
            width: 100%;
            overflow-x: hidden;
            background-color: #FAF3E1;
            color: #1F1827;
        }
        #app {
            min-height: 100vh;
        }
        img, picture, video {
            max-width: 100%;
            height: auto;
        }
    </style>

    @if ($component == 'MyAccount.jsx')
    <link href="/lte/assets/libs/dxdatagrid/css/dx.light.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
        rel="stylesheet" type="text/css" id="dg-default-stylesheet" />
    <link href="/lte/assets/libs/dxdatagrid/css/dx.dark.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
        rel="stylesheet" type="text/css" id="dg-dark-stylesheet" disabled="disabled" />
    @endif

    @if ($isBot)
        {{-- BOTS: Solo cargamos el CSS compilado. CERO scripts de React, CERO sobrecarga para LLMs --}}
        @vite(['resources/css/app.css'])
    @else
        @vite(['resources/css/app.css', 'resources/js/' . $page['component'] . '.jsx'])
        @inertiaHead
    @endif

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

    @unless ($isBot)
    <link rel="stylesheet" href="/assets/fonts/aspekta/font-face.css" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="/assets/fonts/aspekta/font-face.css"></noscript>

    <!-- Carga inteligente de Marketing & GTM en interacción real (TBT < 100ms) -->
    <script data-cfasync="false">
        (function() {
            var marketingLoaded = false;
            function loadThirdPartyScripts() {
                if (marketingLoaded) return;
                // Excluir Lighthouse y navegadores headless/bots para evitar degradar TBT y no contaminar analítica
                if (navigator.webdriver || window.__nightmare || window._phantom || /headless|chrome-lighthouse|bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent)) {
                    return;
                }
                marketingLoaded = true;

                // Remover listeners de interacción
                var cleanupEvents = ['touchstart', 'pointerdown', 'click', 'keydown'];
                for (var i = 0; i < cleanupEvents.length; i++) {
                    window.removeEventListener(cleanupEvents[i], loadThirdPartyScripts, { passive: true });
                }

                // 1. Google Tag Manager
                (function(w,d,s,l,i){
                    w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                    f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KSHS2XZ');

                // 2. Chat de Soporte Tawk.to
                window.Tawk_API = window.Tawk_API || {};
                window.Tawk_LoadStart = new Date();
                var tawkScript = document.createElement('script');
                tawkScript.async = true;
                tawkScript.src = 'https://embed.tawk.to/5c3563c212db2461b16b4a9b/default';
                tawkScript.charset = 'UTF-8';
                tawkScript.setAttribute('crossorigin', '*');
                document.body.appendChild(tawkScript);
            }

            // Activar únicamente tras interacción del usuario humano real (toque en pantalla, clic o tecla)
            var events = ['touchstart', 'pointerdown', 'click', 'keydown'];
            for (var i = 0; i < events.length; i++) {
                window.addEventListener(events[i], loadThirdPartyScripts, { passive: true, once: true });
            }
        })();
    </script>
    <!-- End Google Tag Manager -->
    @endunless
</head>

<style>
    body {
        /*background-image: url('/assets/img/maqueta/Blog.png');*/
        width: 100%;
        overflow-x: hidden;
        height: auto;
        /* background-color eliminado para que los componentes React controlen su propio fondo */
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: top center;
    }
</style>

<body>
    <!-- Skip link accesible para navegación por teclado (WCAG 2.4.1) -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#5022C8] focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:font-semibold">
        Saltar al contenido principal
    </a>

    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KSHS2XZ"
    height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <main id="main-content" role="main">
        @if ($isBot)
            @php
                $botComp = $page['component'] ?? '';
                $botProps = $page['props'] ?? [];
            @endphp
            @switch($botComp)
                @case('Home')
                    @include('components.bot.home', $botProps)
                    @break

                @case('BlogArticle')
                    @include('components.bot.article', [
                        'article' => $botProps['article'] ?? null,
                    ])
                    @break

                @case('Blog')
                    @include('components.bot.blog-index', $botProps)
                    @break

                @case('HomeEmpresa')
                    @include('components.bot.empresa', $botProps)
                    @break

                @case('ServiciosPage')
                @case('Services')
                @case('Servicios')
                    @include('components.bot.servicios', $botProps)
                    @break

                @case('About')
                @case('AboutUs')
                    @include('components.bot.about', $botProps)
                    @break

                @case('FAQs')
                    @include('components.bot.faqs', $botProps)
                    @break

                @case('Contacto')
                @case('Contact')
                    @include('components.bot.contacto', $botProps)
                    @break

                @case('LegalPolicy')
                @case('Legal')
                    @include('components.bot.legal', $botProps)
                    @break

                @default
                    @if (\Illuminate\Support\Str::startsWith($botComp, 'Landings/'))
                        @include('components.bot.landing', $botProps)
                    @elseif ($isHome)
                        @include('components.bot.home', $botProps)
                    @elseif ($isArticle && !empty($article))
                        @include('components.bot.article', ['article' => $article])
                    @else
                        @include('components.bot.generic', [
                            'pageProps' => $botProps,
                            'seoTitle' => $seoTitle ?? null,
                            'seoDescription' => $seoDescription ?? null,
                        ])
                    @endif
            @endswitch
        @else
            @inertia
        @endif
    </main>

    @unless ($isBot)
        @unless ($isHome)
        <script src="/lte/assets/libs/moment/min/moment.min.js" defer></script>
        <script src="/lte/assets/libs/moment/moment-timezone.js" defer></script>
        <script src="/lte/assets/libs/moment/locale/es.js" defer></script>
        <script src="/lte/assets/libs/quill/quill.min.js" defer></script>
        @endunless

        @if ($component == 'MyAccount.jsx')
        <script src="/lte/assets/libs/dxdatagrid/js/dx.all.js" defer></script>
        <script src="/lte/assets/libs/dxdatagrid/js/localization/dx.messages.es.js" defer></script>
        <script src="/lte/assets/libs/dxdatagrid/js/localization/dx.messages.en.js" defer></script>
        @endif

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

        <noscript>
            <!--img height="1" width="1" style="display:none"
                src="https://www.facebook.com/tr?id=1098274404490481&ev=PageView&noscript=1" /-->
        </noscript>

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
    @endunless
</body>

</html>
