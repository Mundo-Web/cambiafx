<?php

namespace Database\Seeders;

use App\Models\TransactionalLanding;
use Illuminate\Database\Seeder;

class TransactionalLandingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $landings = [
            [
                'url' => 'soles-a-dolares',
                'name' => 'Soles a Dólares',
                'h1' => 'Cambia *soles a dolares* online en Peru al mejor tipo de cambio',
                'meta_title' => 'Soles a Dolares Online en Peru | Cambia FX — Sin Comisiones',
                'meta_description' => 'Cambia tus soles a dolares online al mejor tipo de cambio en Peru. Sin comisiones, sin ir al banco, en 15 minutos. Registrado en la SBS. +60,000 clientes.',
                'hero_eyebrow' => 'Cambia ahora - Sin comisiones',
                'hero_title' => 'Ahorra más en cada *operación*',
                'hero_subtitle' => "Nuestra tecnología se conecta con los principales indicadores para ofrecerte el mejor precio.",
                'stats' => [
                    ['label' => 'clientes', 'value' => '60k+'],
                    ['label' => 'promedio', 'value' => '15min'],
                    ['label' => 'registrado', 'value' => 'SBS']
                ],
                'comparison_title' => 'A cuánto está el dólar hoy',
                'comparison_subtitle' => 'Compara nuestro tipo de cambio con las principales entidades financieras.',
                'comparison_cta' => 'Empezar a ahorrar',
                'steps_title' => 'Cambia en 4 simples pasos',
                'steps_subtitle' => 'Es más fácil que el banco y 100% seguro.',
                'cta_title' => '¡Qué bueno que *cambiaste*!',
                'cta_subtitle' => 'Únete a los más de 60,000 peruanos que ya ahorran con la casa de cambio digital líder en Perú.',
                'cta_button_text' => 'Cambiar ahora',
                'comparison_data' => [
                    ['entity' => 'Cambia FX', 'buy' => '3.510', 'sell' => '3.515', 'is_highlight' => true, 'category' => 'Nosotros'],
                    ['entity' => 'SUNAT', 'buy' => '3.490', 'sell' => '3.495', 'is_highlight' => false, 'category' => 'Oficial'],
                    ['entity' => 'BCP', 'buy' => '3.38', 'sell' => '3.45', 'is_highlight' => false, 'category' => 'Banco'],
                    ['entity' => 'BBVA', 'buy' => '3.40', 'sell' => '3.48', 'is_highlight' => false, 'category' => 'Banco'],
                    ['entity' => 'Interbank', 'buy' => '3.50', 'sell' => '3.51', 'is_highlight' => false, 'category' => 'Banco']
                ],
                'schema_faq' => [
                    ['question' => '¿Cómo cambiar soles a dólares online?', 'answer' => 'Es muy sencillo: regístrate, cotiza tu monto, transfiere desde tu banca móvil y recibe tus dólares en minutos.'],
                    ['question' => '¿Es seguro cambiar en Cambia FX?', 'answer' => 'Sí, estamos registrados en la SBS y contamos con tecnología de seguridad bancaria para proteger tus operaciones.'],
                    ['question' => '¿Cuánto tiempo demora el cambio?', 'answer' => 'Las operaciones suelen demorar entre 15 a 20 minutos dentro del horario bancario.']
                ]
            ],
            [
                'url' => 'tipo-de-cambio-hoy',
                'name' => 'Tipo de Cambio Hoy',
                'h1' => 'Tipo de cambio hoy en Peru: *dolar a sol*',
                'meta_title' => 'Tipo de Cambio Hoy en Peru: Dolar a Sol | Cambia FX',
                'meta_description' => 'Consulta el tipo de cambio del dolar hoy en Peru. Compra y vende dolares al mejor precio del mercado online. Actualizado en tiempo real.',
                'hero_eyebrow' => 'TIPO DE CAMBIO EN TIEMPO REAL',
                'hero_title' => 'Dólar a Sol *hoy en Perú*.',
                'hero_subtitle' => "Compara y *ahorra*. El mejor precio para tu cambio de divisas online.",
                'stats' => [
                    ['label' => 'ahorro', 'value' => 'S/ 100+'],
                    ['label' => 'operaciones', 'value' => '500k+'],
                    ['label' => 'seguridad', 'value' => 'SSL']
                ],
                'comparison_title' => 'Comparativa en Tiempo Real',
                'comparison_subtitle' => 'Obtén el mejor precio del mercado comparando con otras casas de cambio.',
                'steps_title' => 'Pasos para cambiar hoy',
                'cta_title' => 'Asegura tu *tasa* ahora',
                'comparison_data' => [
                    ['entity' => 'Cambia FX', 'buy' => '3.512', 'sell' => '3.518', 'is_highlight' => true],
                    ['entity' => 'Interbank', 'buy' => '3.42', 'sell' => '3.55', 'is_highlight' => false]
                ]
            ],
            [
                'url' => 'casa-de-cambio-digital',
                'name' => 'Casa de Cambio Digital',
                'h1' => 'Por que una *casa de cambio digital* y no el banco?',
                'meta_title' => 'Casa de Cambio Digital en Peru | Cambia FX vs Bancos',
                'meta_description' => 'Descubre las ventajas de usar una casa de cambio digital. Ahorra tiempo y dinero con el mejor tipo de cambio de Peru. Seguro y rapido.',
                'hero_eyebrow' => 'LA NUEVA FORMA DE CAMBIAR',
                'hero_title' => 'Digital es *mejor* que el banco.',
                'hero_subtitle' => "Evita colas y *comisiones ocultas*. Cambia desde donde estés con total seguridad.",
                'stats' => [
                    ['label' => 'comisión', 'value' => 'S/ 0'],
                    ['label' => 'tiempo', 'value' => '100% online'],
                    ['label' => 'respaldo', 'value' => 'SBS']
                ],
                'comparison_title' => 'Cambia FX vs El Banco',
                'cta_title' => 'Deja de pagar *de más*',
                'comparison_data' => [
                    ['entity' => 'Cambia FX', 'buy' => '3.510', 'sell' => '3.510', 'is_highlight' => true],
                    ['entity' => 'Scotiabank', 'buy' => '3.41', 'sell' => '3.52', 'is_highlight' => false]
                ]
            ],
            [
                'url' => 'compra-y-venta-de-dolares',
                'name' => 'Compra y Venta de Dólares (Empresas)',
                'h1' => '*Cambio de dolares* para empresas en Peru',
                'meta_title' => 'Compra y Venta de Dolares para Empresas | Cambia FX Business',
                'meta_description' => 'Soluciones de cambio de divisas para empresas. Tipos de cambio preferenciales y facturacion inmediata. Optimiza la tesoreria de tu negocio.',
                'hero_eyebrow' => 'SOLUCIONES CORPORATIVAS',
                'hero_title' => 'Dólares para *tu Empresa*.',
                'hero_subtitle' => "*Atención personalizada* y el mejor tipo de cambio interbancario para tu negocio.",
                'stats' => [
                    ['label' => 'empresas', 'value' => '15k+'],
                    ['label' => 'facturación', 'value' => 'Inmediata'],
                    ['label' => 'atención', 'value' => 'VIP']
                ],
                'comparison_title' => 'Tasas Corporativas',
                'cta_title' => 'Optimiza tu *empresa*',
                'comparison_data' => [
                    ['entity' => 'Cambia FX', 'buy' => '3.515', 'sell' => '3.515', 'is_highlight' => true],
                    ['entity' => 'Bancos', 'buy' => '3.45', 'sell' => '3.58', 'is_highlight' => false]
                ]
            ]
        ];

        foreach ($landings as $landing) {
            TransactionalLanding::updateOrCreate(['url' => $landing['url']], $landing);
        }
    }
}
