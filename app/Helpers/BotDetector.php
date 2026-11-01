<?php

namespace App\Helpers;

class BotDetector
{
    /**
     * Determina si la petición actual proviene de un bot, crawler,
     * rastreador de IA (ChatGPT, Claude, Perplexity), buscador o curl.
     */
    public static function isBot(): bool
    {
        // Permitir forzar el render de bot para pruebas técnicas agregando ?render=bot a la URL
        if (request()->has('render') && request()->get('render') === 'bot') {
            return true;
        }

        $userAgent = request()->header('User-Agent', '');

        if (empty($userAgent)) {
            return true;
        }

        $botPatterns = [
            // IAs y Rastreadores de LLM
            'chatgpt-user',
            'gptbot',
            'oai-searchbot',
            'claudebot',
            'claude-web',
            'anthropic-ai',
            'perplexitybot',
            'perplexity-user',
            'cohere-ai',
            'omgili',
            'bytespider',
            'diffbot',

            // Buscadores principales
            'googlebot',
            'google-extended',
            'mediapartners-google',
            'feedfetcher-google',
            'bingbot',
            'msnbot',
            'bingpreview',
            'yandex',
            'baiduspider',
            'duckduckbot',
            'sogou',
            'exabot',
            'applebot',

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
