<?php

namespace App\Helpers;

class BotDetector
{
    /**
     * Determina si la petición actual proviene de un bot, crawler,
     * rastreador de IA (ChatGPT, Claude, Perplexity), buscador, auditor SEO o curl.
     */
    public static function isBot(): bool
    {
        // Permitir forzar el render de bot para pruebas técnicas agregando ?render=bot a la URL
        if (request()->has('render') && request()->get('render') === 'bot') {
            return true;
        }

        // Header explícito enviado por Cloudflare Worker o proxies reversos
        if (request()->header('X-Is-Bot') === 'true' || request()->header('X-Edge-Server') === 'Cloudflare-CambiaFX-Bot-Pass') {
            return true;
        }

        $userAgent = request()->header('User-Agent', '');

        if (empty($userAgent)) {
            return true;
        }

        $botPatterns = [
            // Patrones genéricos de crawlers/herramientas (no presentes en navegadores estándar)
            'bot',
            'crawler',
            'spider',
            'scraper',
            'checker',
            'audit',
            'lighthouse',
            'headless',
            'inspection',
            'slurp',
            'archiver',

            // OpenAI & ChatGPT
            'chatgpt-user',
            'chatgpt',
            'gptbot',
            'oai-searchbot',
            'openai',

            // Anthropic & Claude
            'claude',
            'claudebot',
            'claude-user',
            'claude-searchbot',
            'claude-web',
            'anthropic-ai',
            'anthropic',

            // Perplexity AI
            'perplexitybot',
            'perplexity-user',
            'perplexity',

            // DeepSeek, Meta, ByteDance, Cohere, Otros
            'deepseek',
            'meta-externalagent',
            'bytespider',
            'cohere-ai',
            'cohere',
            'omgili',
            'diffbot',

            // Buscadores principales e inspectores de búsqueda
            'googlebot',
            'google-extended',
            'google-inspectiontool',
            'mediapartners-google',
            'feedfetcher-google',
            'chrome-lighthouse',
            'pagespeed',
            'bingbot',
            'msnbot',
            'bingpreview',
            'yandex',
            'baiduspider',
            'duckduckbot',
            'sogou',
            'exabot',
            'applebot',

            // Herramientas de Auditoría SEO y Diagnóstico
            'ahrefs',
            'semrush',
            'screaming frog',
            'sitebulb',
            'sitechecker',
            'seobility',
            'serpstat',
            'dotbot',
            'megaindex',
            'zoominfobot',
            'petalbot',
            'gtmetrix',
            'pingdom',
            'uptimerobot',
            'webpagetest',
            'woorank',
            'sistrix',
            'seokicks',
            'proximic',

            // Redes Sociales y Previews de Enlaces
            'facebookexternalhit',
            'facebot',
            'twitterbot',
            'linkedinbot',
            'slackbot',
            'telegrambot',
            'whatsapp',
            'pinterest',
            'discordbot',

            // Clientes CLI y librerías de scraping
            'curl',
            'wget',
            'python-requests',
            'aiohttp',
            'httpx',
            'axios',
            'guzzle',
            'postmanruntime',
            'headlesschrome',
            'phantomjs',
            'w3c_validator',
        ];

        $pattern = '/' . implode('|', $botPatterns) . '/i';

        return (bool) preg_match($pattern, $userAgent);
    }
}
