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
            $langId = app()->has('current_lang_id') ? app('current_lang_id') : (\App\Models\Lang::where('is_default', true)->value('id') ?? 1);
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
            ->where('lang_id', $langId)
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
        
        $title = $title ?? $seoData['seo_title'] ?? 'Cambia FX | Cambio de Dólares y Soles Online en Perú';
        // Limitar a longitud ideal de Google (50-60 caracteres) si se detecta el título anterior largo
        if ($title === 'Cambia FX | Cambia Dólares y Soles Online de Forma Segura en Perú') {
            $title = 'Cambia FX | Cambio de Dólares y Soles Online en Perú';
        }
        $description = $description ?? $seoData['seo_description'] ?? 'Casa de cambio online líder en Perú con las mejores tasas de cambio. Compra y vende dólares de forma segura, rápida y sin comisiones.';
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
        
        $title = $title ?? $seoData['seo_title'] ?? 'Cambia FX | Cambio de Dólares y Soles Online en Perú';
        if ($title === 'Cambia FX | Cambia Dólares y Soles Online de Forma Segura en Perú') {
            $title = 'Cambia FX | Cambio de Dólares y Soles Online en Perú';
        }
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
        
        $title = $title ?? $seoData['seo_title'] ?? 'Cambia FX | Cambio de Dólares y Soles Online en Perú';
        if ($title === 'Cambia FX | Cambia Dólares y Soles Online de Forma Segura en Perú') {
            $title = 'Cambia FX | Cambio de Dólares y Soles Online en Perú';
        }
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
     * Genera el JSON-LD unificado para Organization + FinancialService en todas las páginas
     * Cumpliendo con el requerimiento del ticket A4 para Google y modelos de IA.
     */
    public static function getJsonLD()
    {
        $seoData = self::getSeoData();
        $logo = $seoData['company_logo'] ?? $seoData['og_image_default'] ?? '/assets/img/icon-192x192.png';
        $logoUrl = str_starts_with($logo, 'http') ? $logo : url($logo);
        $baseUrl = rtrim(url('/'), '/');

        // Redes sociales oficiales (misma entidad) sin duplicados ni mensajería
        $socials = \App\Models\Social::where('visible', true)->pluck('link')->toArray();
        $defaultSocials = [
            $seoData['facebook_page'] ?? 'https://www.facebook.com/cambiafx',
            $seoData['instagram_profile'] ?? 'https://www.instagram.com/cambiafx',
            $seoData['linkedin_profile'] ?? 'https://www.linkedin.com/company/cambia-fx',
            $seoData['twitter_site'] ?? 'https://twitter.com/cambiafx'
        ];

        $candidateUrls = array_merge($socials, $defaultSocials);
        $normalizedMap = [];

        foreach ($candidateUrls as $rawUrl) {
            $url = trim($rawUrl);
            if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
                continue;
            }

            // Excluir WhatsApp o mensajería (ya incluido en canal telefónico/contacto)
            if (preg_match('/wa\.me|whatsapp\.com/i', $url)) {
                continue;
            }

            $parsed = parse_url($url);
            $host = strtolower($parsed['host'] ?? '');
            $path = rtrim(strtolower($parsed['path'] ?? ''), '/');

            // Excluir URLs raíz sin usuario/perfil
            if (empty($path) || $path === '/') {
                continue;
            }

            $cleanHost = preg_replace('/^www\./', '', $host);
            $cleanPath = preg_replace('/[^a-z0-9@_]/', '', $path);
            $normalizedKey = $cleanHost . '_' . $cleanPath;

            if (!isset($normalizedMap[$normalizedKey])) {
                $prefix = in_array($cleanHost, ['twitter.com', 'x.com']) ? 'https://' : 'https://www.';
                $normalizedMap[$normalizedKey] = $prefix . $cleanHost . rtrim($parsed['path'], '/');
            }
        }

        $sameAs = array_values($normalizedMap);

        return [
            '@context' => 'https://schema.org',
            '@type' => ['Organization', 'FinancialService'],
            '@id' => "{$baseUrl}/#organization",
            'name' => $seoData['company_name'] ?? 'Cambia FX',
            'legalName' => 'TU CAMBIO S.A.C.',
            'alternateName' => ['CambiaFX', 'Cambia FX Perú'],
            'description' => $seoData['company_description'] ?? $seoData['seo_description'] ?? 'Casa de cambio online registrada en la SBS para cambio de dólares y soles en Perú con transferencias directas e interbancarias en minutos.',
            'url' => $baseUrl,
            'logo' => $logoUrl,
            'image' => $logoUrl,
            'telephone' => $seoData['company_phone'] ?? '+51 922 985 423',
            'email' => $seoData['company_email'] ?? 'contacto@cambiafx.pe',
            'taxID' => '20603864957',
            'vatID' => '20603864957',
            'currenciesAccepted' => 'USD, PEN',
            'paymentAccepted' => 'Bank Transfer',
            'priceRange' => '$$',
            'serviceType' => 'Currency Exchange',
            'areaServed' => [
                '@type' => 'Country',
                'name' => 'Perú'
            ],
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $seoData['company_address'] ?? 'Av. Javier Prado Este N° 560, Oficina 2302',
                'addressLocality' => $seoData['company_locality'] ?? 'San Isidro',
                'addressRegion' => $seoData['company_region'] ?? 'Lima',
                'postalCode' => '15046',
                'addressCountry' => 'PE'
            ],
            'geo' => [
                '@type' => 'GeoCoordinates',
                'latitude' => -12.097029,
                'longitude' => -77.037251
            ],
            'openingHoursSpecification' => [
                [
                    '@type' => 'OpeningHoursSpecification',
                    'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    'opens' => '08:30',
                    'closes' => '18:30'
                ],
                [
                    '@type' => 'OpeningHoursSpecification',
                    'dayOfWeek' => ['Saturday'],
                    'opens' => '09:00',
                    'closes' => '14:00'
                ]
            ],
            'hasCredential' => [
                [
                    '@type' => 'EducationalOccupationalCredential',
                    'credentialCategory' => 'Registro Oficial SBS',
                    'name' => 'Resolución SBS N° 04993-2018 (Casa de Cambio Online Regulada)',
                    'recognizedBy' => [
                        '@type' => 'Organization',
                        'name' => 'Superintendencia de Banca, Seguros y AFP (SBS)'
                    ]
                ]
            ],
            'aggregateRating' => [
                '@type' => 'AggregateRating',
                'ratingValue' => '4.9',
                'bestRating' => '5',
                'worstRating' => '1',
                'ratingCount' => '1250'
            ],
            'about' => [
                [
                    '@type' => 'Thing',
                    'name' => 'Tipo de cambio',
                    'sameAs' => 'https://es.wikipedia.org/wiki/Tipo_de_cambio'
                ],
                [
                    '@type' => 'Thing',
                    'name' => 'Sol (moneda de Perú)',
                    'sameAs' => 'https://es.wikipedia.org/wiki/Sol_(moneda_de_Per%C3%BA)'
                ],
                [
                    '@type' => 'Thing',
                    'name' => 'Dólar estadounidense',
                    'sameAs' => 'https://es.wikipedia.org/wiki/D%C3%B3lar_estadounidense'
                ]
            ],
            'sameAs' => $sameAs
        ];
    }

    /**
     * Genera el JSON-LD para WebSite con SearchAction en la Home
     */
    public static function getWebSiteSchema()
    {
        $baseUrl = rtrim(url('/'), '/');
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => "{$baseUrl}/#website",
            'name' => 'Cambia FX',
            'url' => $baseUrl,
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => "{$baseUrl}/blog?search={search_term_string}"
                ],
                'query-input' => 'required name=search_term_string'
            ]
        ];
    }

    /**
     * Genera el JSON-LD para Article / BlogPosting con autor y fecha
     */
    public static function getNewsArticleSchema($article)
    {
        if (!$article) {
            return null;
        }

        $seoData = self::getSeoData();
        $logo = $seoData['company_logo'] ?? $seoData['og_image_default'] ?? '/assets/img/icon-192x192.png';
        $baseUrl = rtrim(url('/'), '/');

        $name = $article->name ?? $article['name'] ?? '';
        $slug = $article->slug ?? $article['slug'] ?? '';
        $image = $article->image ?? $article['image'] ?? '';
        $postDate = $article->post_date ?? $article['post_date'] ?? $article->created_at ?? $article['created_at'] ?? now();
        $updatedAt = $article->updated_at ?? $article['updated_at'] ?? $postDate;
        $description = $article->summary ?? $article['summary'] ?? $article->description ?? $article['description'] ?? '';

        $authorName = ($article->author ?? $article['author'] ?? null) ?: 'Equipo de Análisis Financiero Cambia FX';
        $authorType = ($article->author_type ?? $article['author_type'] ?? null) ?: 'Organization';

        // Fechas en formato ISO 8601 exigido por Google
        $datePublished = is_string($postDate) ? date('c', strtotime($postDate)) : (method_exists($postDate, 'toIso8601String') ? $postDate->toIso8601String() : date('c'));
        $dateModified = is_string($updatedAt) ? date('c', strtotime($updatedAt)) : (method_exists($updatedAt, 'toIso8601String') ? $updatedAt->toIso8601String() : $datePublished);

        $imageUrl = !empty($image) ? (str_starts_with($image, 'http') ? $image : url("/api/posts/media/{$image}")) : url($logo);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => "{$baseUrl}/blog/{$slug}"
            ],
            'headline' => $name,
            'description' => strip_tags($description),
            'image' => [
                $imageUrl
            ],
            'datePublished' => $datePublished,
            'dateModified' => $dateModified,
            'author' => [
                '@type' => $authorType,
                'name' => $authorName,
                'url' => $baseUrl
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'Cambia FX',
                'legalName' => 'TU CAMBIO S.A.C.',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => str_starts_with($logo, 'http') ? $logo : url($logo)
                ]
            ]
        ];
    }

    /**
     * Genera el JSON-LD para FAQPage en landings
     */
    public static function getFaqSchema($faqs = [])
    {
        $questions = [];

        // Si se pasan FAQs en props
        if (!empty($faqs)) {
            foreach ($faqs as $faq) {
                if (is_array($faq)) {
                    $question = $faq['question'] ?? $faq['name'] ?? '';
                    $answer = $faq['answer'] ?? $faq['description'] ?? '';
                } elseif (is_object($faq)) {
                    $question = $faq->question ?? $faq->name ?? '';
                    $answer = $faq->answer ?? $faq->description ?? '';
                } else {
                    continue;
                }

                if (empty($question) || empty($answer)) continue;

                $questions[] = [
                    '@type' => 'Question',
                    'name' => trim(strip_tags($question)),
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => trim(strip_tags($answer))
                    ]
                ];
            }
        }

        // Si no hay FAQs en props, buscar si corresponde a una de las landings conocidas
        if (empty($questions)) {
            $defaultFaqs = self::getLandingDefaultFaqs(request()->path());
            if (!empty($defaultFaqs)) {
                $questions = $defaultFaqs;
            }
        }

        if (empty($questions)) return null;

        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $questions
        ];
    }

    /**
     * Preguntas frecuentes estándar para las landings SEO
     */
    public static function getLandingDefaultFaqs($path = '')
    {
        $path = trim($path, '/');

        $faqsPorLanding = [
            'tipo-de-cambio-hoy' => [
                ['name' => '¿A cuánto está el tipo de cambio de compra y venta hoy en Perú?', 'text' => 'En Cambia FX el tipo de cambio del dólar se actualiza en tiempo real de lunes a sábado según las fluctuaciones de la cotización interbancaria.'],
                ['name' => '¿Cómo congelar el tipo de cambio en Cambia FX?', 'text' => 'Al ingresar tu monto en el cotizador y hacer clic en cambiar, tu tipo de cambio queda reservado y congelado por 15 minutos.'],
                ['name' => '¿Qué bancos tienen transferencias inmediatas?', 'text' => 'Contamos con transferencias inmediatas (10 a 20 minutos) con BCP e Interbank, y transferencias interbancarias CCE con BBVA, Scotiabank, BanBif y Pichincha.']
            ],
            'compra-y-venta-de-dolares' => [
                ['name' => '¿Cómo comprar o vender dólares por internet en Perú?', 'text' => 'Solo debes registrarte en cambiafx.pe, cotizar el monto deseado, transferir desde tu banca móvil a las cuentas de Cambia FX y recibir tus fondos en minutos.'],
                ['name' => '¿Es seguro comprar dólares online en Cambia FX?', 'text' => 'Sí, operamos formalmente registrados ante la Superintendencia de Banca, Seguros y AFP (SBS) mediante Resolución N° 04993-2018.'],
                ['name' => '¿Emite comprobante de pago SUNAT?', 'text' => 'Sí, cada operación emite automáticamente Boleta o Factura electrónica con plena validez tributaria.']
            ],
            'cambio-de-dolar' => [
                ['name' => '¿Cómo cambiar dólares por soles online en Perú?', 'text' => 'Regístrate gratis en Cambia FX, cotiza el tipo de cambio del día, transfiere desde tu banco y recibe el abono en minutos.'],
                ['name' => '¿Cuál es el tipo de cambio de dólar hoy?', 'text' => 'El tipo de cambio se actualiza en tiempo real en nuestra plataforma según el mercado interbancario.'],
                ['name' => '¿Cuánto puedo ahorrar al cambiar dólares en Cambia FX?', 'text' => 'Por cada US$ 1,000 puedes ahorrar significativamente frente a la tasa promedio de los bancos tradicionales.']
            ],
            'soles-a-dolares' => [
                ['name' => '¿Puedo cambiar soles a dólares desde cualquier banco?', 'text' => 'Sí, aceptamos transferencias desde BCP, Interbank, BBVA, Scotiabank y cualquier entidad del sistema financiero nacional.'],
                ['name' => '¿Hay comisión por cambiar soles a dólares?', 'text' => 'No cobramos ninguna comisión oculta; el monto que ves en la pantalla cotizada es exactamente lo que recibes en tu cuenta.']
            ],
            'casa-de-cambio-digital' => [
                ['name' => '¿Qué ventajas ofrece una casa de cambio digital frente a una física?', 'text' => 'Mayor seguridad al no transportar dinero en efectivo en la calle, tipo de cambio preferencial más competitivo y atención rápida desde tu celular o computadora.'],
                ['name' => '¿Cambia FX está supervisada por la SBS?', 'text' => 'Sí, Tu Cambio S.A.C. (Cambia FX) se encuentra debidamente inscrita en el Registro de Casas de Cambio de la SBS bajo Resolución N° 04993-2018.']
            ]
        ];

        if (isset($faqsPorLanding[$path])) {
            $result = [];
            foreach ($faqsPorLanding[$path] as $item) {
                $result[] = [
                    '@type' => 'Question',
                    'name' => $item['name'],
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => $item['text']
                    ]
                ];
            }
            return $result;
        }

        return [];
    }

    /**
     * Genera el JSON-LD para BreadcrumbList (con auto-generación si no viene definido)
     */
    public static function getBreadcrumbSchema($items = [])
    {
        $baseUrl = rtrim(url('/'), '/');
        $itemListElement = [];

        if (!empty($items)) {
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
        } else {
            // Auto-generación basada en la URL actual
            $path = trim(request()->path(), '/');
            if (empty($path)) {
                return [
                    '@context' => 'https://schema.org',
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => [
                        [
                            '@type' => 'ListItem',
                            'position' => 1,
                            'name' => 'Inicio',
                            'item' => $baseUrl
                        ]
                    ]
                ];
            }

            $nombresRutas = [
                'blog' => 'Blog',
                'tipo-de-cambio-hoy' => 'Tipo de Cambio Hoy',
                'compra-y-venta-de-dolares' => 'Compra y Venta de Dólares',
                'cambio-de-dolar' => 'Cambio de Dólar',
                'soles-a-dolares' => 'Soles a Dólares',
                'casa-de-cambio-digital' => 'Casa de Cambio Digital',
                'sorteo-cambiafx' => 'Sorteo Cambia FX',
                'servicios' => 'Servicios',
                'services' => 'Servicios',
                'empresas' => 'Empresas',
                'nosotros' => 'Nosotros',
                'contacto' => 'Contacto',
                'legal/terminos-y-condiciones' => 'Términos y Condiciones',
                'legal/politicas-de-privacidad' => 'Políticas de Privacidad'
            ];

            $currentName = $nombresRutas[$path] ?? ucwords(str_replace(['-', '/'], ' ', $path));

            $itemListElement[] = [
                '@type' => 'ListItem',
                'position' => 1,
                'name' => 'Inicio',
                'item' => $baseUrl
            ];

            if (str_starts_with($path, 'blog/')) {
                $itemListElement[] = [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => 'Blog',
                    'item' => "{$baseUrl}/blog"
                ];
                $itemListElement[] = [
                    '@type' => 'ListItem',
                    'position' => 3,
                    'name' => $currentName,
                    'item' => url()->current()
                ];
            } else {
                $itemListElement[] = [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => $currentName,
                    'item' => url()->current()
                ];
            }
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
        return self::getJsonLD();
    }
}
