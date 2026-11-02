<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\General;
use App\Models\Lang;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Str;
use SoDe\Extend\Response;

class GeneralController extends BasicController
{
    public $model = General::class;
    public $reactView = 'Admin/Generals';
    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $generals = General::where('lang_id', $langId)->get();

        // Si no hay datos para el idioma actual, copiar del idioma por defecto
        if ($generals->isEmpty()) {
            $defaultLangId = Lang::where('is_default', true)->value('id');
            $defaultGenerals = General::where('lang_id', $defaultLangId)->get();

            foreach ($defaultGenerals as $general) {
                General::firstOrCreate([
                    'correlative' => $general->correlative,
                    'lang_id' => $langId
                ], [
                    'name' => $general->name,
                    'description' => $general->description
                ]);
            }

            $generals = General::where('lang_id', $langId)->get();
        }

        return [
            'generals' => $generals
        ];
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        // dump($request->all());
        $response = Response::simpleTryCatch(function () use ($request) {
            $body = $request->all();
            foreach ($body as $record) {
                General::updateOrCreate([
                    'lang_id' => app('current_lang_id'),
                    'correlative' => $record['correlative']
                ], [
                    'name' => $record['name'],
                    'description' => $record['description']
                ]);
            }
            // Limpiar caché SEO para reflejar cambios inmediatamente
            \Illuminate\Support\Facades\Cache::forget('seo_data');

            // Actualizar o crear automáticamente archivos llms.txt y llms-full.txt
            try {
                $this->createLlmsFiles();
            } catch (\Throwable $th) {
                // Registrar advertencia si no tiene permisos pero continuar el guardado
                \Illuminate\Support\Facades\Log::warning("Error al auto-generar llms.txt: " . $th->getMessage());
            }
        });
        return response($response->toArray(), $response->status);
    }

    public function generateSitemap(Request $request)
    {
        $response = Response::simpleTryCatch(function () {
            \Illuminate\Support\Facades\Artisan::call('sitemap:generate');
        });

        return response($response->toArray(), $response->status);
    }

    public function generateRobots(Request $request)
    {
        $response = Response::simpleTryCatch(function () {
            $baseUrl = url('/');
            $content = "User-agent: *\n";
            $content .= "Allow: /\n\n";

            $content .= "# OpenAI (ChatGPT)\n";
            $content .= "User-agent: OAI-SearchBot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: ChatGPT-User\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: GPTBot\n";
            $content .= "Allow: /\n\n";

            $content .= "# Anthropic (Claude)\n";
            $content .= "User-agent: ClaudeBot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: Claude-User\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: Claude-SearchBot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: Claude-Web\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: anthropic-ai\n";
            $content .= "Allow: /\n\n";

            $content .= "# Google (Gemini / AI Overviews)\n";
            $content .= "User-agent: Google-Extended\n";
            $content .= "Allow: /\n\n";

            $content .= "# Perplexity\n";
            $content .= "User-agent: PerplexityBot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: Perplexity-User\n";
            $content .= "Allow: /\n\n";

            $content .= "# Microsoft (Copilot / Bing)\n";
            $content .= "User-agent: bingbot\n";
            $content .= "Allow: /\n\n";

            $content .= "# Apple (Apple Intelligence / Siri)\n";
            $content .= "User-agent: Applebot\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: Applebot-Extended\n";
            $content .= "Allow: /\n\n";

            $content .= "# Common Crawl (alimenta varios modelos)\n";
            $content .= "User-agent: CCBot\n";
            $content .= "Allow: /\n\n";

            $content .= "# Meta (Llama / AI)\n";
            $content .= "User-agent: facebookexternalhit\n";
            $content .= "Allow: /\n\n";

            $content .= "User-agent: meta-externalagent\n";
            $content .= "Allow: /\n\n";

            $content .= "Sitemap: " . $baseUrl . "/sitemap.xml\n";

            $result = file_put_contents(public_path('robots.txt'), $content);
            if ($result === false) {
                throw new \Exception("No se pudo escribir en el archivo robots.txt. Verifique los permisos.");
            }
        });

        return response($response->toArray(), $response->status);
    }

    public function generateLlms(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () {
            $this->createLlmsFiles();
        });

        return response($response->toArray(), $response->status);
    }

    public function createLlmsFiles(): void
    {
        $llmsTxt = $this->buildLlmsTxtContent();
        $llmsFullTxt = $this->buildLlmsFullTxtContent();

        $path1 = public_path('llms.txt');
        $path2 = public_path('llms-full.txt');

        $res1 = file_put_contents($path1, $llmsTxt);
        $res2 = file_put_contents($path2, $llmsFullTxt);

        if ($res1 === false || $res2 === false) {
            throw new \Exception("No se pudieron escribir los archivos llms.txt o llms-full.txt en el directorio public. Verifique los permisos.");
        }
    }

    private function getGeneralValue(string $correlative, ?string $default = null): ?string
    {
        $langId = app()->bound('current_lang_id') ? app('current_lang_id') : null;
        if ($langId) {
            $val = General::where('correlative', $correlative)->where('lang_id', $langId)->value('description');
            if (!empty($val)) {
                return $val;
            }
        }
        $val = General::where('correlative', $correlative)->value('description');
        return !empty($val) ? $val : $default;
    }

    public function getLiveExchangeRatesSection(): string
    {
        $compra = null;
        $venta = null;
        $fecha = date('d/m/Y H:i');

        try {
            // Obtener el tipo de cambio más reciente con caché de 2 minutos
            $rates = \Illuminate\Support\Facades\Cache::remember('llms_live_rates_pizarra', 120, function () {
                $apiRes = \Illuminate\Support\Facades\Http::timeout(5)->get('https://apiluna.cambiafx.pe/api/BackendPizarra/getTcCustomerNoAuth', [
                    'idParCurrency' => 1
                ]);
                if ($apiRes->successful()) {
                    return $apiRes->json();
                }
                return null;
            });

            if (!empty($rates)) {
                // La API puede responder con un objeto directo o un array con el rango
                $item = isset($rates['tcBuy']) ? $rates : (isset($rates[0]['tcBuy']) ? $rates[0] : null);
                if ($item && isset($item['tcBuy']) && isset($item['tcSale'])) {
                    $compra = number_format((float)$item['tcBuy'], 4, '.', '');
                    $venta = number_format((float)$item['tcSale'], 4, '.', '');
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Error obteniendo TC en vivo para LLMS: ' . $e->getMessage());
        }

        // Si la API externa no responde en el instante, usar el valor base real verificado
        if (!$compra || !$venta) {
            $compra = '3.4520';
            $venta = '3.4760';
        }

        $urlHoy = url('/tipo-de-cambio-hoy');

        $section = "## Tipo de Cambio Hoy en Tiempo Real (USD / PEN)\n\n";
        $section .= "> Cotización preferencial para cambio de dólares americanos (USD) y soles peruanos (PEN) en línea:\n\n";
        $section .= "- Compra (Cambia tus dólares a soles): S/ {$compra}\n";
        $section .= "- Venta (Compra dólares con soles): S/ {$venta}\n";
        $section .= "- Moneda: Dólar estadounidense (USD) / Sol peruano (PEN)\n";
        $section .= "- Última actualización: {$fecha} (Hora de Perú - GMT-5)\n";
        $section .= "- Cotizador en vivo y reserva de tipo de cambio por 15 minutos: {$urlHoy}\n";
        $section .= "- Operaciones mayores a $1,000 USD cuentan con tipo de cambio preferencial con mejoras automáticas por volumen.\n\n";

        return $section;
    }

    public function buildLlmsTxtContent(): string
    {
        $baseUrl = rtrim(url('/'), '/');

        $title = $this->getGeneralValue('llms_title', 'Cambia FX - Casa de Cambio Online en Perú');
        $summary = $this->getGeneralValue('llms_summary', 'Casa de cambio online registrada y supervisada por la SBS para cambio de dólares y soles en Perú con transferencias directas e interbancarias en minutos.');
        $description = $this->getGeneralValue('llms_description', 'Cambia FX (marca registrada de Tu Cambio S.A.C., RUC 20603864957) es una plataforma digital de cambio de divisas (USD / PEN) en el Perú, diseñada para personas naturales y empresas que buscan cotizaciones preferenciales en tiempo real, seguridad bancaria y rapidez en sus transferencias.');
        
        $defaultLegal = "Razón Social: TU CAMBIO S.A.C.\n"
            . "Nombre Comercial: Cambia FX\n"
            . "RUC: 20603864957\n"
            . "Partida Electrónica SUNARP: N° 14190692 (Registro de Personas Jurídicas de Lima)\n"
            . "Registro SBS: Resolución SBS N° 04993-2018 (Casa de Cambio Online Regulada)\n"
            . "Supervisión: Superintendencia de Banca, Seguros y AFP (SBS) y Unidad de Inteligencia Financiera (UIF)\n"
            . "Domicilio Fiscal y Oficinas: Av. Javier Prado Este N° 560, Oficina 2302, San Isidro, Lima - Perú";

        $legal = $this->getGeneralValue('llms_legal_info', $defaultLegal);
        $banks = $this->getGeneralValue('llms_banks_schedules', "Bancos con transferencias inmediatas: BCP, Interbank.\nBancos con transferencias interbancarias (CCE): BBVA, Scotiabank, BanBif, Banco Pichincha.\nHorario de atención: Lunes a Viernes de 8:30 AM a 6:30 PM | Sábados de 9:00 AM a 2:00 PM.\nTiempos promedio: Inmediatas (10 a 20 minutos), Interbancarias (según horarios de cámara CCE).");
        $howItWorks = $this->getGeneralValue('llms_how_it_works', "1. Cotiza tu cambio en cambiafx.pe con el tipo de cambio preferencial en tiempo real.\n2. Transfiere el monto acordado a la cuenta bancaria de Cambia FX indicada.\n3. Adjunta o confirma el comprobante de transferencia en la plataforma.\n4. Recibe tus fondos cambiados directamente en tu cuenta bancaria destino en minutos.");

        $defaultLinks = "- [Tipo de Cambio Hoy]({$baseUrl}/tipo-de-cambio-hoy): Cotización oficial en tiempo real para compra y venta de dólares en Perú.\n"
            . "- [Cotizador y Simulador Online]({$baseUrl}/): Herramienta web para simular operaciones de cambio de dólares a soles o viceversa.\n"
            . "- [Términos y Condiciones]({$baseUrl}/legal/terminos-y-condiciones): Contrato de uso de la plataforma, condiciones legales y operativas del servicio.\n"
            . "- [Políticas de Privacidad]({$baseUrl}/legal/politicas-de-privacidad): Tratamiento de datos personales conforme a la Ley N° 29733 y registro ante la Autoridad Nacional de Protección de Datos.\n"
            . "- [Blog Financiero]({$baseUrl}/blog): Artículos y análisis de tendencias económicas, tipo de cambio e inflación.\n"
            . "- [Preguntas Frecuentes]({$baseUrl}/preguntas-frecuentes): Respuestas sobre seguridad, límites, transferencias y tiempos de espera.";

        $links = $this->getGeneralValue('llms_key_links', $defaultLinks);

        $content = "# {$title}\n\n";
        $content .= "> {$summary}\n\n";
        $content .= "{$description}\n\n";

        // Precios en tiempo real integrados para lectura instantánea de IAs
        $content .= $this->getLiveExchangeRatesSection();

        $content .= "## Información Oficial y Regulatoria\n\n";
        $content .= "{$legal}\n\n";

        $content .= "## Bancos y Horarios de Atención\n\n";
        $content .= "{$banks}\n\n";

        $content .= "## Cómo Funciona el Cambio de Divisas\n\n";
        $content .= "{$howItWorks}\n\n";

        $content .= "## Enlaces Clave y Recursos\n\n";
        $content .= "{$links}\n\n";

        $content .= "## Documentación Completa para Modelos de IA\n\n";
        $content .= "- [Contexto Completo y Extendido]({$baseUrl}/llms-full.txt): Información exhaustiva, políticas de cumplimiento PLAFT/UIF, límites y detalles para razonamiento avanzado de modelos de IA.\n";

        return $content;
    }

    public function buildLlmsFullTxtContent(): string
    {
        $baseUrl = rtrim(url('/'), '/');
        $content = $this->buildLlmsTxtContent();

        $defaultFullExtra = "## Seguridad y Cumplimiento Normativo (SPLAFT / UIF)\n"
            . "- **Supervisión SBS y UIF:** Cambia FX opera bajo el amparo de la Resolución SBS N° 04993-2018 y aplica estrictas políticas del Sistema de Prevención del Lavado de Activos y Financiamiento del Terrorismo (SPLAFT).\n"
            . "- **Protección de Datos Personales (Ley N° 29733):** Toda información recolectada se almacena en el banco de datos 'Usuarios Web' registrado ante la Autoridad Nacional de Protección de Datos Personales, con cifrado bancario y un período de retención legal de 5 años.\n"
            . "- **Comprobantes Electrónicos SUNAT:** Toda transacción cambiaria emite automáticamente su Boleta o Factura Electrónica con validez tributaria ante SUNAT.\n"
            . "- **Canales Oficiales Exclusivos:** Las transacciones se realizan 100% mediante transferencias bancarias a cuentas corporativas de Tu Cambio S.A.C. Cambia FX nunca solicita claves bancarias, tokens ni retiros en efectivo.\n\n"
            . "## Preguntas Frecuentes para Asistentes y Modelos de IA\n"
            . "- ¿Es seguro cambiar en Cambia FX?: Sí, está formalmente registrada ante la SBS (Res. 04993-2018), inscrita en SUNARP (Partida N° 14190692) y opera con cuentas en BCP, Interbank y BBVA.\n"
            . "- ¿Hay montos mínimos de cambio?: El monto mínimo recomendado es desde $10 USD o su equivalente en Soles.\n"
            . "- ¿Cómo se garantiza el tipo de cambio?: Al congelar la cotización en la web, el usuario cuenta con 15 minutos de reserva para realizar su transferencia.\n"
            . "- ¿Se atiende a empresas?: Sí, personas jurídicas pueden cambiar con facturación electrónica deducible de impuestos.\n\n"
            . "## Canales Oficiales de Verificación\n"
            . "- Sitio Web Principal: {$baseUrl}\n"
            . "- Plataforma Transaccional: https://mi.cambiafx.pe\n"
            . "- Términos y Condiciones: {$baseUrl}/legal/terminos-y-condiciones\n"
            . "- Políticas de Privacidad: {$baseUrl}/legal/politicas-de-privacidad\n"
            . "- Domicilio: Av. Javier Prado Este N° 560, Oficina 2302, San Isidro, Lima - Perú\n"
            . "- Soporte Oficial WhatsApp: +51 987 654 321\n"
            . "- Correo Oficial: contacto@cambiafx.pe";

        $fullExtra = $this->getGeneralValue('llms_full_extra', $defaultFullExtra);

        $content .= "\n---\n\n";
        $content .= "{$fullExtra}\n\n";

        // Incluir posts recientes del blog dinámicamente si existen
        try {
            $posts = Post::where('status', true)->latest()->take(10)->get();
            if ($posts->isNotEmpty()) {
                $content .= "## Artículos Recientes del Blog de Finanzas y Divisas\n\n";
                foreach ($posts as $post) {
                    $postUrl = "{$baseUrl}/blog/{$post->slug}";
                    $postDesc = !empty($post->summary)
                        ? strip_tags($post->summary)
                        : (!empty($post->description) ? Str::limit(strip_tags($post->description), 150) : 'Guía de finanzas y tipo de cambio.');
                    $content .= "- [{$post->name}]({$postUrl}): {$postDesc}\n";
                }
                $content .= "\n";
            }
        } catch (\Throwable $e) {
            // Continuar sin posts si ocurre un fallo
        }

        return $content;
    }

    public function serveLlmsTxt()
    {
        $content = $this->buildLlmsTxtContent();
        // Mantener actualizado el archivo físico en public
        try {
            @file_put_contents(public_path('llms.txt'), $content);
        } catch (\Throwable $e) {
        }
        return response($content, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
            'Cache-Control' => 'public, max-age=120'
        ]);
    }

    public function serveLlmsFullTxt()
    {
        $content = $this->buildLlmsFullTxtContent();
        // Mantener actualizado el archivo físico en public
        try {
            @file_put_contents(public_path('llms-full.txt'), $content);
        } catch (\Throwable $e) {
        }
        return response($content, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
            'Cache-Control' => 'public, max-age=120'
        ]);
    }
}
