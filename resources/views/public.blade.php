@php
$component = Route::currentRouteName();
$isHome = $component === 'Home.jsx';
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf_token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://flagcdn.com">
    <link rel="preconnect" href="https://apiluna.cambiafx.pe">

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

    <!-- PWA Configuration -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#007bff">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="CambiaFX">
    <link rel="apple-touch-icon" href="/assets/img/icon.png">

    <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/png">

    <!-- Web Fonts Asíncronas (No bloqueantes del FCP/LCP) -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"></noscript>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"></noscript>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap"></noscript>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"></noscript>


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
        body {
            margin: 0;
            width: 100%;
            overflow-x: hidden;
            background-color: #ffffff;
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

    @vite(['resources/css/app.css', 'resources/js/' . $page['component'] . '.jsx'])
    @inertiaHead

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

    <link rel="stylesheet" href="/assets/fonts/aspekta/font-face.css" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="/assets/fonts/aspekta/font-face.css"></noscript>


    <!-- Carga inteligente de Marketing & GTM en primera interacción (TBT < 100ms) -->
    <script>
        (function() {
            var marketingLoaded = false;
            function loadThirdPartyScripts() {
                if (marketingLoaded) return;
                marketingLoaded = true;

                // Remover listeners de interacción
                var events = ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'];
                for (var i = 0; i < events.length; i++) {
                    window.removeEventListener(events[i], loadThirdPartyScripts, { passive: true });
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

            // Activar al primer contacto humano (scroll, touch, clic o tecla)
            var events = ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'];
            for (var i = 0; i < events.length; i++) {
                window.addEventListener(events[i], loadThirdPartyScripts, { passive: true, once: true });
            }

            // Fallback pasivo de 7 segundos (por si el usuario lee sin tocar la pantalla)
            setTimeout(loadThirdPartyScripts, 7000);
        })();
    </script>
    <!-- End Google Tag Manager -->
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
    <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KSHS2XZ"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
    @inertia

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
</body>

</html>
