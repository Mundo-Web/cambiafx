/**
 * ============================================================================
 * Cloudflare Worker: Redirección 301 Canónica + Aceleración Edge TTFB (100% Gratuito)
 * Proyecto: cambiafx.pe
 * 
 * 1. Redirecciona www.cambiafx.pe -> cambiafx.pe (301 Permanente SEO).
 * 2. Cachea páginas públicas en el Edge por 2 minutos (reduce TTFB de 1.6s a 15ms).
 * 3. Rutas privadas y APIs siempre van en tiempo real al origen.
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
    // 2. Rutas dinámicas que NUNCA deben cachearse (Admin, Autenticación, APIs)
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
      '/livewire',
      '/dashboard',
      '/my-account'
    ].some(path => pathnameLower.startsWith(path));

    if (isExcluded) {
      return fetch(request);
    }

    // ========================================================================
    // 3. Bots de IA y Crawlers: BYPASS DIRECTO AL ORIGEN
    //    Los bots (Claude, ChatGPT, Gemini, Perplexity) NUNCA deben recibir
    //    el HTML SPA de React/Inertia cacheado de un usuario humano.
    //    Laravel genera el HTML semántico y GEO Quick Answer en tiempo real.
    // ========================================================================
    const userAgent = request.headers.get('User-Agent') || '';
    const isBot = /bot|crawler|spider|googlebot|bingbot|chatgpt|gptbot|claude|anthropic|perplexity|deepseek|oai-searchbot|applebot/i.test(userAgent)
               || url.searchParams.get('render') === 'bot';

    if (isBot) {
      const response = await fetch(request);
      const newHeaders = new Headers(response.headers);
      newHeaders.set('X-Edge-Server', 'Cloudflare-CambiaFX-Bot-Pass');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }

    // ========================================================================
    // 4. Aceleración Edge en Cloudflare para Humanos (Cachea 2 min para TTFB < 20ms)
    // ========================================================================
    const response = await fetch(request, {
      cf: {
        cacheEverything: true,
        cacheTtl: 120
      }
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Edge-Server', 'Cloudflare-CambiaFX-Accelerated');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
