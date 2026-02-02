<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PerformanceHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Solo aplicar a respuestas HTML
        if ($this->isHtmlResponse($response)) {
            $this->applySecurityHeaders($response);
            $this->applyCacheHeaders($response);
            $this->applyCompressionHints($response);
            $this->applyResourceHints($response);
        }

        return $response;
    }

    /**
     * Check if response is HTML
     */
    private function isHtmlResponse(Response $response): bool
    {
        $contentType = $response->headers->get('Content-Type', '');
        return str_contains($contentType, 'text/html');
    }

    /**
     * Apply security headers
     */
    private function applySecurityHeaders(Response $response): void
    {
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // En desarrollo, NO aplicar CSP restrictivo (permite Vite dev server)
        if (config('app.env') !== 'production') {
            return;
        }
        
        // Content Security Policy - SOLO EN PRODUCCIÓN
        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.culqi.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://connect.facebook.net https://www.facebook.com https://embed.tawk.to https://va.tawk.to https://cdn.jsdelivr.net https://www.gstatic.com https://www.google-analytics.com https://analytics.tiktok.com https://googleads.g.doubleclick.net https://www.google.com https://cdn.tiny.cloud",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com https://www.gstatic.com https://embed.tawk.to https://cdn.tiny.cloud",
            "img-src 'self' data: https: http: blob:",
            "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com https://embed.tawk.to",
            "connect-src 'self' https://apiluna.cambiafx.pe https://translate.googleapis.com https://translate-pa.googleapis.com https://va.tawk.to wss://embed.tawk.to wss://*.tawk.to https://embed.tawk.to https://www.google-analytics.com https://analytics.google.com https://analytics.tiktok.com https://googleads.g.doubleclick.net https://www.google.com https://www.facebook.com https://cdn.jsdelivr.net https://cdn.tiny.cloud",
            "frame-src 'self' https://checkout.culqi.com https://translate.google.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ]);
        
        $response->headers->set('Content-Security-Policy', $csp);
    }

    /**
     * Apply cache control headers
     */
    private function applyCacheHeaders(Response $response): void
    {
        // Para HTML dinámico - no cache pero permite revalidación
        $response->headers->set('Cache-Control', 'no-cache, must-revalidate');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');
        
        // ETag para validación condicional
        if (config('app.env') === 'production') {
            $etag = md5($response->getContent());
            $response->headers->set('ETag', '"' . $etag . '"');
        }
    }

    /**
     * Apply compression hints
     */
    private function applyCompressionHints(Response $response): void
    {
        // Indicar que el servidor acepta compresión
        $response->headers->set('Vary', 'Accept-Encoding');
    }

    /**
     * Apply resource hints headers
     */
    private function applyResourceHints(Response $response): void
    {
        // Preconnect a dominios críticos
        $preconnectDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://flagcdn.com',
            'https://apiluna.cambiafx.pe',
        ];

        $linkHeaders = [];
        foreach ($preconnectDomains as $domain) {
            $linkHeaders[] = "<{$domain}>; rel=preconnect; crossorigin";
        }

        // DNS Prefetch para dominios de terceros
        $dnsPrefetchDomains = [
            'https://translate.googleapis.com',
            'https://connect.facebook.net',
            'https://embed.tawk.to',
            'https://cdn.jsdelivr.net',
            'https://cdnjs.cloudflare.com',
            'https://unpkg.com',
        ];

        foreach ($dnsPrefetchDomains as $domain) {
            $linkHeaders[] = "<{$domain}>; rel=dns-prefetch";
        }

        if (!empty($linkHeaders)) {
            $response->headers->set('Link', implode(', ', $linkHeaders));
        }
    }
}
