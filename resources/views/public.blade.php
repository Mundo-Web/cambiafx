@php
    $component = Route::currentRouteName();
    $isHome = $component === 'Home.jsx';
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf_token" content="{{ csrf_token() }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://flagcdn.com">
    <link rel="preconnect" href="https://apiluna.cambiafx.pe">
    <link rel="preconnect" href="https://translate-pa.googleapis.com">
    <link rel="preload" as="font" type="font/woff2" href="/build/GeneralSans-Semibold.woff2" crossorigin>
    <link rel="preload" as="font" type="font/woff2" href="/build/GeneralSans-Regular.woff2" crossorigin>

    <!-- SEO Meta Tags -->
    @include('components.seo-meta-tags', [
        'title' => $seoTitle ?? null,
        'description' => $seoDescription ?? null,
        'keywords' => $seoKeywords ?? null,
        'image' => $seoImage ?? null,
        'url' => $seoUrl ?? null,
        'schemaType' => $schemaType ?? 'Organization'
    ])
    
    <!-- PWA Configuration -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#007bff">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="CambiaFX">
    <link rel="apple-touch-icon" href="/icon-192x192.png">
    
    <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/png">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"></noscript>

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet" media="print" onload="this.media='all'">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" media="print" onload="this.media='all'" />

    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" media="print" onload="this.media='all'">

    <!--CAMBIO GERENCIA-->
    <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    
  
    <style>
        * {
            box-sizing: border-box;
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

    <link href="/lte/assets/libs/quill/quill.snow.css" rel="stylesheet" type="text/css" media="print" onload="this.media='all'" />
    <link href="/lte/assets/libs/quill/quill.bubble.css" rel="stylesheet" type="text/css" media="print" onload="this.media='all'" />
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
</head>

<style>
    body {
        /*background-image: url('/assets/img/maqueta/Blog.png');*/
        width: 100%;
        overflow-x: hidden;
        height: auto;
        background-color:#FFFFFF;
        background-size: 100% auto;
        background-repeat: no-repeat;
        /* Asegura que la imagen no se repita */
        background-position: top center;
        /* Centra la imagen en la parte superior */
    }
</style>

<body class="font-poppins">
    @inertia

    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js" defer></script>

    @unless ($isHome)
        <script src="/lte/assets/libs/moment/min/moment.min.js" defer></script>
        <script src="/lte/assets/libs/moment/moment-timezone.js" defer></script>
        <script src="/lte/assets/libs/moment/locale/es.js" defer></script>
        <script src="/lte/assets/libs/quill/quill.min.js" defer></script>
    @endunless

    @if ($component == 'MyAccount.jsx')
        <script src="/lte/assets/libs/dxdatagrid/js/dx.all.js"></script>
        <script src="/lte/assets/libs/dxdatagrid/js/localization/dx.messages.es.js"></script>
        <script src="/lte/assets/libs/dxdatagrid/js/localization/dx.messages.en.js"></script>
    @endif

    <script src="/lte/assets/libs/tippy.js/tippy.all.min.js" defer></script>

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

    <script>
        window.loadGoogleTranslate = function() {
            if (typeof google === 'undefined' || !google.translate) {
                return;
            }

            new google.translate.TranslateElement({
                pageLanguage: 'es',
                includedLanguages: 'es,en',
                autoDisplay: false
            }, 'google_translate_element');
        };

        (function() {
            const schedule = (callback, timeout = 4000) => {
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(callback, { timeout });
                } else {
                    setTimeout(callback, timeout);
                }
            };

            schedule(() => {
                const translateScript = document.createElement('script');
                translateScript.src = 'https://translate.google.com/translate_a/element.js?cb=loadGoogleTranslate';
                translateScript.async = true;
                translateScript.defer = true;
                document.body.appendChild(translateScript);
            });

            schedule(() => {
                if (window.fbq) {
                    window.fbq('track', 'PageView');
                    return;
                }

                !function(f, b, e, v, n, t, s) {
                    if (f.fbq) return;
                    n = f.fbq = function() {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                    };
                    if (!f._fbq) f._fbq = n;
                    n.push = n;
                    n.loaded = true;
                    n.version = '2.0';
                    n.queue = [];
                    t = b.createElement(e);
                    t.async = true;
                    t.src = v;
                    s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s);
                }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

                window.fbq('init', '1098274404490481');
                window.fbq('track', 'PageView');
            }, 1500);

            schedule(() => {
                window.Tawk_API = window.Tawk_API || {};
                window.Tawk_LoadStart = new Date();

                const tawkScript = document.createElement('script');
                tawkScript.async = true;
                tawkScript.src = 'https://embed.tawk.to/5c3563c212db2461b16b4a9b/default';
                tawkScript.charset = 'UTF-8';
                tawkScript.setAttribute('crossorigin', '*');
                document.body.appendChild(tawkScript);
            }, 2500);
        })();
    </script>

    <noscript>
        <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=1098274404490481&ev=PageView&noscript=1" />
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
