/**
 * ============================================================================
 * Cloudflare Worker: Prerender para Bots (SEO & IA) + Redirección 301 www
 * Proyecto: cambiafx.pe
 * Objetivo: Servir HTML renderizado a bots/IAs con caché de 24h y SPA a usuarios.
 * ============================================================================
 */

// Lista de User-Agents de bots y rastreadores de búsqueda e IA
const BOT_AGENTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'slackbot',
  'vkshare',
  'w3c_validator',
  // Bots de Inteligencia Artificial (LLMs)
  'gptbot',
  'oai-searchbot',
  'chatgpt-user',
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'perplexitybot',
  'perplexity-user',
  'applebot',
  'applebot-extended',
  'ccbot',
  'meta-externalagent',
  'google-extended'
];

// Extensiones de archivos estáticos que NUNCA deben pasar por prerender
const STATIC_EXTENSIONS = [
  '.js', '.css', '.xml', '.less', '.png', '.jpg', '.jpeg', '.gif',
  '.pdf', '.doc', '.txt', '.ico', '.rss', '.zip', '.mp3', '.rar',
  '.exe', '.wmv', '.doc', '.avi', '.ppt', '.mpg', '.mpeg', '.tif',
  '.wav', '.mov', '.psd', '.ai', '.xls', '.mp4', '.m4a', '.swf',
  '.dat', '.dmg', '.iso', '.flv', '.m4v', '.torrent', '.woff',
  '.woff2', '.ttf', '.eot', '.svg', '.webp', '.avif', '.json'
];

// Rutas excluidas (Panel de administración, APIs internas y webhooks)
const EXCLUDED_PATHS = [
  '/admin',
  '/api',
  '/login',
  '/register',
  '/password',
  '/sanctum',
  '/broadcasting'
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ========================================================================
    // 1. TAREA A2: Redirección permanente 301 de "www" a "sin-www"
    // ========================================================================
    if (url.hostname === 'www.cambiafx.pe') {
      const redirectUrl = `https://cambiafx.pe${url.pathname}${url.search}`;
      return Response.redirect(redirectUrl, 301);
    }

    // Solo procesar peticiones GET y HEAD
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return fetch(request);
    }

    // Verificar si es un archivo estático
    const pathnameLower = url.pathname.toLowerCase();
    const isStaticFile = STATIC_EXTENSIONS.some(ext => pathnameLower.endsWith(ext));
    if (isStaticFile) {
      return fetch(request);
    }

    // Verificar si es una ruta excluida (admin, api, etc.)
    const isExcludedPath = EXCLUDED_PATHS.some(path => pathnameLower.startsWith(path));
    if (isExcludedPath) {
      return fetch(request);
    }

    // ========================================================================
    // 2. TAREA A1: Detección de Bots y Rastreabilidad
    // ========================================================================
    const userAgent = (request.headers.get('User-Agent') || '').toLowerCase();
    const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot)) || url.searchParams.has('_escaped_fragment_');

    // Si NO es un bot, entregar la SPA normal al usuario de inmediato
    if (!isBot) {
      return fetch(request);
    }

    // ========================================================================
    // 3. Manejo de Caché Edge de 24 horas para Bots
    // ========================================================================
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), {
      headers: { 'X-Bot-Prerender-Cache': '1' }
    });

    // Buscar si ya tenemos el HTML renderizado en la caché de Cloudflare
    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      const newHeaders = new Headers(cachedResponse.headers);
      newHeaders.set('X-Prerender-Cache', 'HIT');
      newHeaders.set('X-Served-By', 'Cloudflare-Worker-Prerender');
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: newHeaders
      });
    }

    // ========================================================================
    // 4. Obtener HTML Renderizado desde el servicio de Prerender
    // ========================================================================
    // NOTA: Configura la variable de entorno PRERENDER_TOKEN en el dashboard de Cloudflare.
    // Si usas Prerender.io, el token va en la cabecera X-Prerender-Token.
    // Si tienes un servicio propio (Rendertron/Puppeteer), ajusta PRERENDER_SERVICE_URL.
    const PRERENDER_SERVICE_URL = env.PRERENDER_SERVICE_URL || 'https://service.prerender.io/';
    const PRERENDER_TOKEN = env.PRERENDER_TOKEN || '';

    const targetPrerenderUrl = `${PRERENDER_SERVICE_URL}${url.toString()}`;

    const prerenderHeaders = new Headers(request.headers);
    if (PRERENDER_TOKEN) {
      prerenderHeaders.set('X-Prerender-Token', PRERENDER_TOKEN);
    }
    prerenderHeaders.set('User-Agent', request.headers.get('User-Agent') || 'Googlebot');

    try {
      const prerenderResponse = await fetch(targetPrerenderUrl, {
        method: 'GET',
        headers: prerenderHeaders,
        redirect: 'follow'
      });

      // Si el servicio de prerender responde exitosamente (200)
      if (prerenderResponse.status === 200) {
        const responseHeaders = new Headers(prerenderResponse.headers);
        responseHeaders.set('Content-Type', 'text/html; charset=UTF-8');
        // Caché de 24 horas (86400 segundos) en el Edge de Cloudflare
        responseHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        responseHeaders.set('X-Prerender-Cache', 'MISS');
        responseHeaders.set('X-Served-By', 'Cloudflare-Worker-Prerender');

        const finalResponse = new Response(prerenderResponse.body, {
          status: 200,
          headers: responseHeaders
        });

        // Guardar en la caché de Cloudflare en segundo plano
        ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));

        return finalResponse;
      }
    } catch (err) {
      // Si el servicio de prerender falla, fallback al origen para no romper la petición
    }

    // Fallback: Entregar respuesta del origen Laravel
    return fetch(request);
  }
};
