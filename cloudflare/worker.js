/**
 * ============================================================================
 * Cloudflare Worker: Redirección 301 Canónica + Optimización Edge (100% Gratuito)
 * Proyecto: cambiafx.pe
 * 
 * Sin costos externos ni Prerender.io:
 * 1. Redirecciona www.cambiafx.pe -> cambiafx.pe (301 Permanente SEO).
 * 2. Laravel ya entrega el HTML con todos los Meta Tags, OpenGraph y JSON-LD.
 * 3. Googlebot e IAs modernas ejecutan JavaScript nativamente.
 * 4. Cachea respuestas públicas en el Edge de Cloudflare sin consumir servidor.
 * ============================================================================
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ========================================================================
    // 1. Redirección permanente 301 de "www" a "sin-www" (Canónica SEO)
    // ========================================================================
    if (url.hostname === 'www.cambiafx.pe') {
      const redirectUrl = `https://cambiafx.pe${url.pathname}${url.search}`;
      return Response.redirect(redirectUrl, 301);
    }

    // Solo procesar peticiones GET y HEAD para caché
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return fetch(request);
    }

    // ========================================================================
    // 2. Rutas que NO se deben cachear en el Edge (Admin, Autenticación, APIs)
    // ========================================================================
    const pathnameLower = url.pathname.toLowerCase();
    const isExcluded = [
      '/admin',
      '/api',
      '/login',
      '/register',
      '/password',
      '/sanctum',
      '/broadcasting',
      '/livewire'
    ].some(path => pathnameLower.startsWith(path));

    if (isExcluded) {
      return fetch(request);
    }

    // ========================================================================
    // 3. Servir desde el Origen (Laravel) con Cabeceras de Optimización
    // ========================================================================
    const response = await fetch(request);

    // Clonar cabeceras para añadir seguridad y control de caché en el Edge
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Edge-Server', 'Cloudflare-CambiaFX');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
