<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Feature Flags - Performance & Accessibility
    |--------------------------------------------------------------------------
    |
    | Control de features para rollout gradual de optimizaciones
    | Permite activar/desactivar features sin cambiar código
    |
    */

    'performance' => [
        // Critical CSS inline en <head>
        'critical_css' => env('FEATURE_CRITICAL_CSS', false),

        // Conversión automática a WebP/AVIF
        'webp_images' => env('FEATURE_WEBP_IMAGES', true),

        // Lazy loading de imágenes
        'lazy_loading' => env('FEATURE_LAZY_LOADING', true),

        // Code splitting de JavaScript
        'code_splitting' => env('FEATURE_CODE_SPLITTING', true),

        // Preload de recursos críticos
        'resource_hints' => env('FEATURE_RESOURCE_HINTS', true),

        // Cache de fragmentos HTML
        'fragment_cache' => env('FEATURE_FRAGMENT_CACHE', true),

        // CDN para assets
        'cdn_assets' => env('FEATURE_CDN_ASSETS', false),

        // Service Worker / PWA
        'service_worker' => env('FEATURE_SERVICE_WORKER', true),

        // Web Vitals monitoring
        'web_vitals' => env('FEATURE_WEB_VITALS', true),

        // Compresión Brotli (requiere servidor)
        'brotli_compression' => env('FEATURE_BROTLI', false),
    ],

    'accessibility' => [
        // Skip navigation links
        'skip_links' => env('FEATURE_SKIP_LINKS', true),

        // ARIA labels completos
        'aria_labels' => env('FEATURE_ARIA_LABELS', true),

        // Focus trap en modales
        'focus_trap' => env('FEATURE_FOCUS_TRAP', true),

        // High contrast mode
        'high_contrast' => env('FEATURE_HIGH_CONTRAST', false),

        // Screen reader announcer
        'sr_announcer' => env('FEATURE_SR_ANNOUNCER', true),

        // Keyboard navigation indicators
        'keyboard_nav' => env('FEATURE_KEYBOARD_NAV', true),
    ],

    'experimental' => [
        // HTTP/3 QUIC
        'http3' => env('FEATURE_HTTP3', false),

        // Early hints (103 status)
        'early_hints' => env('FEATURE_EARLY_HINTS', false),

        // Priority Hints API
        'priority_hints' => env('FEATURE_PRIORITY_HINTS', false),

        // View Transitions API
        'view_transitions' => env('FEATURE_VIEW_TRANSITIONS', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | CDN Configuration
    |--------------------------------------------------------------------------
    */
    'cdn' => [
        'enabled' => env('CDN_ENABLED', false),
        'url' => env('CDN_URL', ''),
        'domains' => [
            'assets' => env('CDN_ASSETS_DOMAIN', ''),
            'images' => env('CDN_IMAGES_DOMAIN', ''),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache TTL (Time To Live)
    |--------------------------------------------------------------------------
    */
    'cache_ttl' => [
        'landing' => env('CACHE_TTL_LANDING', 3600), // 1 hora
        'posts' => env('CACHE_TTL_POSTS', 1800), // 30 minutos
        'indicators' => env('CACHE_TTL_INDICATORS', 3600),
        'core_values' => env('CACHE_TTL_CORE_VALUES', 7200), // 2 horas
        'menu' => env('CACHE_TTL_MENU', 3600),
        'footer' => env('CACHE_TTL_FOOTER', 3600),
    ],

    /*
    |--------------------------------------------------------------------------
    | Image Optimization
    |--------------------------------------------------------------------------
    */
    'images' => [
        'formats' => [
            'avif' => env('IMAGE_FORMAT_AVIF', true),
            'webp' => env('IMAGE_FORMAT_WEBP', true),
        ],
        'quality' => [
            'avif' => env('IMAGE_QUALITY_AVIF', 80),
            'webp' => env('IMAGE_QUALITY_WEBP', 85),
            'jpeg' => env('IMAGE_QUALITY_JPEG', 90),
        ],
        'max_width' => env('IMAGE_MAX_WIDTH', 1920),
        'lazy_threshold' => env('IMAGE_LAZY_THRESHOLD', 0.01), // IntersectionObserver threshold
    ],

    /*
    |--------------------------------------------------------------------------
    | Web Vitals Thresholds
    |--------------------------------------------------------------------------
    */
    'vitals' => [
        'lcp' => [
            'good' => 2500,
            'poor' => 4000,
        ],
        'fid' => [
            'good' => 100,
            'poor' => 300,
        ],
        'cls' => [
            'good' => 0.1,
            'poor' => 0.25,
        ],
        'inp' => [
            'good' => 200,
            'poor' => 500,
        ],
        'fcp' => [
            'good' => 1800,
            'poor' => 3000,
        ],
        'ttfb' => [
            'good' => 800,
            'poor' => 1800,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Third Party Scripts
    |--------------------------------------------------------------------------
    */
    'third_party' => [
        'google_analytics' => env('GA_ENABLED', true),
        'facebook_pixel' => env('FB_PIXEL_ENABLED', true),
        'tawk_to' => env('TAWK_TO_ENABLED', true),
        'google_translate' => env('GOOGLE_TRANSLATE_ENABLED', true),
        
        // Delays en ms
        'delays' => [
            'analytics' => env('DELAY_ANALYTICS', 1500),
            'tawk_to' => env('DELAY_TAWK_TO', 2500),
            'translate' => env('DELAY_TRANSLATE', 4000),
        ],
    ],
];
