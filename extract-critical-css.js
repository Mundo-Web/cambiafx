const { generate } = require('critical');
const path = require('path');

/**
 * Script para extraer Critical CSS
 * Genera CSS inline para mejorar FCP y LCP
 * 
 * Uso:
 * node extract-critical-css.js
 */

const pages = [
    {
        name: 'home',
        url: 'http://localhost:8000',
        outputPath: 'resources/views/critical/home-critical.css'
    },
    // Agregar más páginas según necesidad
];

async function extractCriticalCSS() {
    console.log('🚀 Extrayendo Critical CSS...\n');

    for (const page of pages) {
        console.log(`📄 Procesando: ${page.name}`);
        
        try {
            const { css, html } = await generate({
                base: 'public/',
                src: page.url,
                target: {
                    css: page.outputPath,
                },
                inline: false, // Generamos archivo separado
                width: 1920,
                height: 1080,
                dimensions: [
                    {
                        width: 375,
                        height: 667,
                    },
                    {
                        width: 1920,
                        height: 1080,
                    }
                ],
                penthouse: {
                    blockJSRequests: true,
                    timeout: 60000,
                },
                extract: true,
                ignore: {
                    atrule: ['@font-face'],
                    rule: [/\.hidden/, /\.sr-only/],
                },
            });

            console.log(`✅ ${page.name}: ${css.length} bytes generados\n`);
        } catch (error) {
            console.error(`❌ Error en ${page.name}:`, error.message);
        }
    }

    console.log('✨ Proceso completado');
}

extractCriticalCSS();
