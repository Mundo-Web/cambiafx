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
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://connect.facebook.net https://www.facebook.com https://embed.tawk.to https://va.tawk.to https://cdn.jsdelivr.net https://www.gstatic.com https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://sgtm.cambiafx.pe https://*.a.run.app https://analytics.tiktok.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://www.google.com https://cdn.tiny.cloud https://*.amazonaws.com https://*.conversionsapigateway.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com https://www.gstatic.com https://embed.tawk.to https://cdn.tiny.cloud",
            "img-src 'self' data: https: http: blob:",
            "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com https://embed.tawk.to",
            "connect-src 'self' https://cloudflareinsights.com https://apiluna.cambiafx.pe https://sgtm.cambiafx.pe https://translate.googleapis.com https://translate-pa.googleapis.com https://va.tawk.to wss://embed.tawk.to wss://*.tawk.to https://embed.tawk.to https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://analytics-ipv6.tiktokw.us https://analytics.tiktok.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://www.google.com https://www.facebook.com https://cdn.jsdelivr.net https://cdn.tiny.cloud https://*.a.run.app https://*.on.aws https://*.amazonaws.com https://*.conversionsapigateway.com",
            "frame-src 'self' https://translate.google.com https://www.googletagmanager.com https://sgtm.cambiafx.pe https://*.a.run.app https://*.conversionsapigateway.com https://*.doubleclick.net",
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
        // Si la petición proviene de un bot de auditoría SEO o crawler (Googlebot, etc.)
        if (\App\Helpers\BotDetector::isBot()) {
            $response->headers->set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
            $response->headers->remove('Pragma');
            $response->headers->remove('Expires');
            return;
        }

        $request = request();
        $isPublicGet = $request->isMethod('GET') && !$request->is('admin*', 'api*', 'login*', 'register*', 'dashboard*', 'my-account*');

        if ($isPublicGet) {
            // Páginas públicas para usuarios humanos y herramientas de auditoría (Home, Blog, etc.):
            // s-maxage=120 permite a Cloudflare Edge responder en < 30ms (TTFB óptimo).
            // max-age=0 + must-revalidate indica al navegador revalidar con el Edge para recibir actualizaciones rápidas.
            $response->headers->set('Cache-Control', 'public, max-age=0, s-maxage=120, stale-while-revalidate=60, must-revalidate');
            $response->headers->set('Cloudflare-CDN-Cache-Control', 'max-age=120, stale-while-revalidate=60');
            $response->headers->set('CDN-Cache-Control', 'max-age=120');
            $response->headers->remove('Pragma');
            $response->headers->remove('Expires');
        } else {
            // Rutas privadas, transaccionales, formularios y panel de administración:
            $response->headers->set('Cache-Control', 'no-cache, must-revalidate, max-age=0');
            $response->headers->set('Cloudflare-CDN-Cache-Control', 'no-store');
            $response->headers->set('CDN-Cache-Control', 'no-store');
            $response->headers->set('X-LiteSpeed-Cache-Control', 'no-cache');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
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
        $linkHeaders = [
            '<https://www.googletagmanager.com>; rel=preconnect',
            '<https://www.googletagmanager.com>; rel=dns-prefetch',
            '<https://apiluna.cambiafx.pe>; rel=dns-prefetch',
            '<https://flagcdn.com>; rel=dns-prefetch',
        ];

        $response->headers->set('Link', implode(', ', $linkHeaders));
    }
}
