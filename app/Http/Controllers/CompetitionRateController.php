<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\Response;

class CompetitionRateController extends Controller
{
    private $sources = [
        'kambista' => 'https://api.kambista.com/v1/exchange/calculates?originCurrency=USD&destinationCurrency=PEN&active=S&amount=1',
        'rextie' => 'https://app.rextie.com/api/v1/fxrates/rate/',
        'sunat' => 'https://free.e-api.net.pe/tipo-cambio/'
    ];

    /**
     * Obtiene los tipos de cambio de la competencia
     */
    public function getRates(Request $request)
    {
        $url = $request->query('url');
        
        $response = Response::simpleTryCatch(function () use ($url) {
            return $this->fetchMixedRates($url);
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Mezcla datos de la DB con la tasa real de CambiaFX de Luna
     */
    private function fetchMixedRates($url)
    {
        Log::info('--- INICIANDO FETCH MIXTO (DB + API LUNA) ---');
        
        // 1. Obtener la landing y su data de comparación manual
        $landing = \App\Models\TransactionalLanding::where('url', $url)->first();
        $dbRates = $landing ? $landing->comparison_data : [];

        // 2. Obtener la tasa real de CambiaFX (API Luna)
        $cambiaFX = $this->getCurrentCambiaFXRate();
        $buyLive = $cambiaFX['compra'] ?? 3.720;
        $sellLive = $cambiaFX['venta'] ?? 3.745;

        Log::info('Tasa CambiaFX Live:', ['buy' => $buyLive, 'sell' => $sellLive]);

        if (empty($dbRates)) {
            Log::warning('No hay data en la DB para la comparativa, devolviendo lista vacía');
            return [];
        }

        // 3. Actualizar únicamente la fila de CambiaFX con la tasa real de Luna
        $updatedRates = array_map(function($rate) use ($buyLive, $sellLive) {
            $entity = $rate['entity'] ?? '';
            // Identificar si es nuestra entidad por nombre
            $isNosotros = stripos($entity, 'Cambia') !== false;

            if ($isNosotros) {
                $rate['buy'] = number_format($buyLive, 3, '.', '');
                $rate['sell'] = number_format($sellLive, 3, '.', '');
                $rate['diff'] = 'MEJOR OPCIÓN';
                $rate['is_highlight'] = true;
                $rate['category'] = 'Nosotros';
            }
            // Las demás entidades se devuelven tal cual están en la DB (respetando lo ingresado en el Admin)
            return $rate;
        }, $dbRates);

        Log::info('--- FINALIZADO FETCH MIXTO. Total entidades: ' . count($updatedRates) . ' ---');
        return $updatedRates;
    }

    /**
     * Retorna tasas realistas basadas en el mercado actual o en la data de la landing
     */
    private function getFallbackRates($url = null)
    {
        if ($url) {
            $landing = \App\Models\TransactionalLanding::where('url', $url)->first();
            if ($landing && !empty($landing->comparison_data)) {
                return $landing->comparison_data;
            }
        }

        // Si no hay landing o data, usar fallback dinámico basado en CambiaFX actual
        $cambiaFXRate = $this->getCurrentCambiaFXRate();
        
        $buyBase = $cambiaFXRate['compra'] ?? 3.750;
        $sellBase = $cambiaFXRate['venta'] ?? 3.785;

        return [];
    }

    /**
     * Obtiene la tasa actual de CambiaFX desde el ExchangeRateController
     */
    private function getCurrentCambiaFXRate()
    {
        try {
            $exchangeRateController = new ExchangeRateController();
            $response = $exchangeRateController->getExchangeRates();
            $data = json_decode($response->getContent(), true);
            
            if (isset($data['data']) && count($data['data']) > 0) {
                return [
                    'compra' => $data['data'][0]['tc_compra'],
                    'venta' => $data['data'][0]['tc_venta']
                ];
            }
        } catch (\Exception $e) {
            Log::error('Error obteniendo tasa CambiaFX para comparativa: ' . $e->getMessage());
        }

        return ['compra' => 3.750, 'venta' => 3.785];
    }
}
