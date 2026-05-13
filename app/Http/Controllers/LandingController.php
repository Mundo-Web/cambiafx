<?php

namespace App\Http\Controllers;

use App\Models\App;
use App\Models\Faq;
use App\Models\General;
use App\Models\Indicator;
use App\Models\Post;
use App\Models\Specialty;
use App\Models\TransactionalLanding;
use App\Models\Social;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends BasicController
{
    public $reactRootView = 'public';

    public function solesADolares(Request $request)
    {
        return $this->renderLanding('soles-a-dolares', 'Landings/SolesADolares');
    }

    public function tipoDeCambioHoy(Request $request)
    {
        return $this->renderLanding('tipo-de-cambio-hoy', 'Landings/TipoDeCambioHoy');
    }

    public function casaDeCambioDigital(Request $request)
    {
        return $this->renderLanding('casa-de-cambio-digital', 'Landings/CasaDeCambioDigital');
    }

    public function compraVentaDolares(Request $request)
    {
        return $this->renderLanding('compra-y-venta-de-dolares', 'Landings/CompraVentaDolares');
    }

    private function getMarketRates()
    {
        return \Cache::remember('market_rates', 1800, function () {
            try {
                $url = "https://cuantoestaeldolar.pe/";
                $options = [
                    "http" => [
                        "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\r\n"
                    ]
                ];
                $context = stream_context_create($options);
                $html = file_get_contents($url, false, $context);

                if ($html === FALSE) return [];

                $doc = new \DOMDocument();
                libxml_use_internal_errors(true);
                $doc->loadHTML($html);
                libxml_clear_errors();

                $xpath = new \DOMXPath($doc);
                $rates = [];

                // 1. Extraer SUNAT (Lógica exacta del script de prueba)
                $nodosSunat = $xpath->query("//div[contains(@class, 'QuotacionValue_title') and contains(translate(., 'SUNAT', 'sunat'), 'sunat')]/following-sibling::div//p[contains(@class, 'ValueCurrency_item_cost')]");
                if ($nodosSunat->length >= 2) {
                    $rates[] = [
                        'entity' => 'SUNAT',
                        'buy' => trim($nodosSunat->item(0)->nodeValue),
                        'sell' => trim($nodosSunat->item(1)->nodeValue),
                        'is_highlight' => false,
                        'category' => 'Oficial'
                    ];
                }

                // 2. Extraer Dólar Paralelo (Lógica exacta del script de prueba)
                $nodosParalelo = $xpath->query("//div[contains(@class, 'QuotacionValue_title') and contains(., 'paralelo')]/following-sibling::div//p[contains(@class, 'ValueCurrency_item_cost')]");
                if ($nodosParalelo->length >= 2) {
                    $rates[] = [
                        'entity' => 'Paralelo',
                        'buy' => trim($nodosParalelo->item(0)->nodeValue),
                        'sell' => trim($nodosParalelo->item(1)->nodeValue),
                        'is_highlight' => false,
                        'category' => 'Paralelo'
                    ];
                }

                return $rates;
            } catch (\Exception $e) {
                return [];
            }
        });
    }

    private function getLiveRates()
    {
        return \Cache::remember('live_market_updates_v2', 600, function () {
            try {
                $url = "https://api.cuantoestaeldolar.pe/envivo?page=1&limit=20";
                $ch = curl_init();
                curl_setopt_array($ch, [
                    CURLOPT_URL => $url,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_TIMEOUT => 15,
                    CURLOPT_HTTPHEADER => [
                        'Accept: application/json',
                        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Origin: https://cuantoestaeldolar.pe',
                        'Referer: https://cuantoestaeldolar.pe/'
                    ]
                ]);
                $response = curl_exec($ch);
                curl_close($ch);
                
                if (!$response) return ['momentos' => []];
                $data = json_decode($response, true);
                if (!isset($data['details'])) return ['momentos' => []];

                $momentos = [];
                foreach ($data['details'] as $item) {
                    $registro = [
                        'id' => $item['eid'] ?? uniqid(),
                        'hora' => $item['time'] ?? date('H:i:s'),
                        'fuente' => strtoupper($item['name'] ?? $item['title'] ?? 'MERCADO'),
                        'titulo' => $item['title'] ?? '',
                        'compra' => null,
                        'venta' => null
                    ];

                    // Lógica de mapeo de campos igual a script_tx.php
                    $camposCompra = ['buy', 'compra', 'purchase', 'price_buy'];
                    $camposVenta = ['sell', 'venta', 'sale', 'price_sell'];

                    foreach ($camposCompra as $f) {
                        if (isset($item[$f]) && is_numeric($item[$f])) {
                            $registro['compra'] = floatval($item[$f]);
                            break;
                        }
                    }
                    foreach ($camposVenta as $f) {
                        if (isset($item[$f]) && is_numeric($item[$f])) {
                            $registro['venta'] = floatval($item[$f]);
                            break;
                        }
                    }

                    // Búsqueda recursiva si falló lo anterior (igual que script_tx.php)
                    if ($registro['compra'] === null || $registro['venta'] === null) {
                        $deep = $this->deepSearchPrices($item);
                        $registro['compra'] = $registro['compra'] ?? $deep['compra'];
                        $registro['venta'] = $registro['venta'] ?? $deep['venta'];
                    }

                    if ($registro['compra'] !== null && $registro['venta'] !== null) {
                        $registro['spread'] = round($registro['venta'] - $registro['compra'], 3);
                        $momentos[] = $registro;
                    }
                }

                return [
                    'fecha_scraping' => date('Y-m-d H:i:s'),
                    'momentos' => $momentos
                ];
            } catch (\Exception $e) {
                return ['momentos' => []];
            }
        });
    }

    private function deepSearchPrices($data, $depth = 0)
    {
        $res = ['compra' => null, 'venta' => null];
        if (!is_array($data) || $depth > 3) return $res;

        foreach ($data as $key => $val) {
            $k = strtolower($key);
            if ($res['compra'] === null && is_numeric($val) && preg_match('/buy|compra|purchase/i', $k)) {
                $res['compra'] = floatval($val);
            }
            if ($res['venta'] === null && is_numeric($val) && preg_match('/sell|venta|sale/i', $k)) {
                $res['venta'] = floatval($val);
            }
            if (is_array($val) && ($res['compra'] === null || $res['venta'] === null)) {
                $sub = $this->deepSearchPrices($val, $depth + 1);
                $res['compra'] = $res['compra'] ?? $sub['compra'];
                $res['venta'] = $res['venta'] ?? $sub['venta'];
            }
        }
        return $res;
    }

    private function renderLanding($url, $view)
    {
        $landing = TransactionalLanding::where('url', $url)->where('status', true)->first();
        
        if (!$landing) {
            abort(404);
        }

        $marketRates = $this->getMarketRates();
        $liveRates = $this->getLiveRates();
        $apps = App::where('status', true)->get();
        $indicators = Indicator::where('status', true)->get();
        $pasos = Specialty::where('status', true)->get();
        $faqs = Faq::where('status', true)->get();
        $posts = Post::where('status', true)->latest()->take(3)->get();
        $socials = Social::where('visible', true)->get();

        $generals = General::all();
        $getGeneral = function($correlative, $default = '') use ($generals) {
            return $generals->where('correlative', $correlative)->first()?->description ?? $default;
        };

        $viewData = [
            'seoTitle' => $landing->meta_title ?? $landing->h1,
            'seoDescription' => $landing->meta_description ?? $getGeneral('seo_description'),
            'seoKeywords' => $landing->meta_keywords ?? $getGeneral('seo_keywords'),
            'faqs' => $landing->schema_faq,
            'financialService' => [
                'name' => $landing->schema_service_name ?? $getGeneral('company_name', 'Cambia FX'),
                'description' => $landing->schema_service_description ?? $getGeneral('company_description'),
                'phone' => $landing->schema_service_phone ?? $getGeneral('company_phone') ?? $getGeneral('whatsapp_phone'),
                'address' => [
                    'locality' => $landing->schema_service_address_locality ?? $getGeneral('company_locality', 'Lima'),
                    'region' => $landing->schema_service_address_region ?? $getGeneral('company_region', 'Lima'),
                    'country' => $landing->schema_service_address_country ?? $getGeneral('company_country', 'PE'),
                ],
                'openingHours' => $landing->schema_service_opening_hours ?? $getGeneral('opening_hours', 'Mo-Fr 09:00-18:00, Sa 09:00-13:00'),
                'paymentsAccepted' => $landing->schema_service_payments_accepted ?? 'Cash, Bank Transfer, Debit Card'
            ],
            'schemaType' => 'FinancialService'
        ];

        return Inertia::render($view, [
            'landing' => $landing,
            'marketRates' => $marketRates,
            'liveRates' => $liveRates,
            'apps' => $apps,
            'indicators' => $indicators,
            'pasos' => (isset($landing->steps) && count($landing->steps) > 0) ? $landing->steps : $pasos,
            'faqs' => (isset($landing->schema_faq) && count($landing->schema_faq) > 0) ? $landing->schema_faq : $faqs,
            'posts' => $posts,
            'socials' => $socials,
            'financialServiceData' => $viewData['financialService'],
            'globalKeywords' => $viewData['seoKeywords']
        ])->rootView($this->reactRootView)->withViewData($viewData);
    }
}
