# 🚀 Plan de Optimización de Performance - CambiaFX

## 📊 Estado Actual (PageSpeed Insights)

### Métricas Actuales
| Métrica | Móvil | Desktop | Estado | Objetivo |
|---------|-------|---------|--------|----------|
| **LCP** | 4.9s | 4.0s | ❌ Crítico | ≤ 2.5s |
| **FCP** | 3.8s | 3.2s | ⚠️ Regular | ≤ 1.8s |
| **INP** | 233ms | 180ms | ⚠️ Aceptable | ≤ 200ms |
| **CLS** | 0.03 | 0.36 | ❌ Desktop | ≤ 0.1 |
| **TTFB** | 1.3s | 1.1s | ⚠️ Lento | ≤ 0.8s |

**Estado:** ❌ Core Web Vitals — Failed

---

## 🎯 Estrategia de Implementación

### Fase 1: Backend Optimization (Laravel) - TTFB & Server Response
**Impacto esperado:** -40% TTFB (1.1s → 0.6s)

#### 1.1 Configuración de Caché
- [x] Redis configurado para cache y sessions
- [x] Comando artisan para optimización automática
- [x] Middleware de caché HTTP para rutas estáticas
- [x] Cache de queries Eloquent frecuentes

#### 1.2 Optimización de Eloquent
- [ ] Auditoría de N+1 queries con Laravel Telescope
- [ ] Implementar eager loading en controladores principales
- [ ] Usar DB raw queries para operaciones pesadas
- [ ] Índices optimizados en tablas críticas

#### 1.3 Configuración PHP (Producción)
```ini
; OPcache Configuration
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.fast_shutdown=1

; PHP-FPM
pm.max_children=50
pm.start_servers=10
pm.min_spare_servers=5
pm.max_spare_servers=20
pm.max_requests=500
```

---

### Fase 2: Frontend Optimization (React + Inertia) - LCP & FCP
**Impacto esperado:** -50% LCP (4.0s → 2.0s)

#### 2.1 Resource Hints & Preloading
- [x] Preload de imagen hero/LCP principal
- [x] Preconnect a dominios externos críticos
- [x] DNS-prefetch para recursos terciarios
- [x] Font-display: swap en todas las fuentes

#### 2.2 Code Splitting Agresivo
- [x] Vendor chunks separados (react, motion, ui)
- [x] Route-based code splitting con React.lazy()
- [x] Dynamic imports para componentes pesados
- [x] Tree-shaking optimizado

#### 2.3 Bundle Optimization
- [x] Minificación con Terser
- [x] CSS extraction y purging
- [x] Eliminar console.log en producción
- [x] Compression (Gzip + Brotli)

---

### Fase 3: Assets & Media - Image Optimization
**Impacto esperado:** -30% tamaño de imágenes

#### 3.1 Formato de Imágenes
- [ ] Convertir JPG/PNG → WebP (fallback)
- [ ] AVIF para navegadores modernos
- [ ] SVG para iconos y logos
- [ ] Lazy loading en imágenes below-the-fold

#### 3.2 Responsive Images
```html
<img 
  src="hero.webp"
  srcset="hero-320.webp 320w, hero-768.webp 768w, hero-1920.webp 1920w"
  sizes="(max-width: 768px) 100vw, 50vw"
  width="1920"
  height="1080"
  alt="Cambio de divisas en Perú"
  loading="eager"
/>
```

---

### Fase 4: Infrastructure - Server & CDN
**Impacto esperado:** -25% TTFB global

#### 4.1 Apache/Nginx Configuration
- [x] Brotli compression (br level 6)
- [x] Gzip fallback (level 6)
- [x] HTTP/2 habilitado
- [x] Cache-Control headers optimizados
- [x] ETag y Last-Modified headers

#### 4.2 CDN Strategy
- [ ] Configurar CloudFlare/Bunny CDN
- [ ] Cache rules para assets estáticos
- [ ] Minificación automática HTML/CSS/JS
- [ ] Image optimization automática
- [ ] Geographic distribution (edge servers)

---

### Fase 5: Monitoring & Analytics - RUM
**Impacto:** Visibilidad de métricas reales

#### 5.1 Web Vitals Integration
- [x] Library web-vitals integrada
- [x] Custom hook useWebVitals
- [x] Reporte a analytics (Google/Auditzy)
- [x] Dashboard de monitoreo

#### 5.2 Performance Budget
```json
{
  "budget": [
    {
      "resourceType": "script",
      "budget": 300
    },
    {
      "resourceType": "image",
      "budget": 500
    },
    {
      "resourceType": "total",
      "budget": 1000
    }
  ]
}
```

---

## 📁 Archivos Creados/Modificados

### Backend (Laravel)
- `config/cache.php` - Configuración Redis optimizada
- `app/Console/Commands/OptimizeApp.php` - Comando de optimización
- `app/Http/Middleware/CacheResponse.php` - Middleware de caché HTTP
- `bootstrap/cache/` - Cache precompilada

### Frontend (React)
- `resources/js/hooks/useWebVitals.js` - Hook de monitoreo
- `resources/js/components/LazyComponent.jsx` - HOC lazy loading
- `resources/js/utils/reportWebVitals.js` - Reporte a analytics
- `resources/views/public_with_seo.blade.php` - Resource hints

### Build & Config
- `vite.config.js` - Code splitting optimizado
- `public/.htaccess` - Compression & cache headers
- `optimize-production.ps1` - Script de deploy
- `performance-budget.json` - Budget tracking

---

## 🔧 Comandos de Optimización

### Development
```bash
# Instalar dependencias
composer install --optimize-autoloader --no-dev
npm install

# Build optimizado
npm run build

# Cache Laravel
php artisan optimize
php artisan view:cache
php artisan route:cache
php artisan config:cache
```

### Production Deploy
```powershell
# Script automático
.\optimize-production.ps1

# O manual:
php artisan down
git pull
composer install --no-dev --optimize-autoloader
npm ci --production
npm run build
php artisan migrate --force
php artisan optimize
php artisan storage:link
php artisan up
```

### Testing Performance
```bash
# Lighthouse CI
npm run audit:lighthouse
npm run audit:lighthouse-mobile

# Bundle analysis
npx vite-bundle-visualizer

# Analyze source maps
npx source-map-explorer 'public/build/assets/*.js'
```

---

## 📈 KPIs y Seguimiento

### Métricas Objetivo (3 meses)
| Métrica | Actual | Objetivo | Estrategia |
|---------|--------|----------|------------|
| LCP | 4.0s | ≤ 2.5s | Preload + code-splitting + CDN |
| FCP | 3.2s | ≤ 1.8s | Inline critical CSS + defer JS |
| TTFB | 1.1s | ≤ 0.8s | Redis + opcache + CDN |
| CLS | 0.36 | ≤ 0.1 | Aspect-ratio + reserved space |
| INP | 180ms | ≤ 150ms | Debounce + lazy hydration |
| Bundle | ~800KB | ≤ 300KB | Tree-shaking + compression |

### Herramientas de Monitoreo
1. **Google PageSpeed Insights** - Weekly audits
2. **Google Search Console** - Core Web Vitals tracking
3. **Auditzy.com** - RUM monitoring
4. **Lighthouse CI** - Automated checks on deploy
5. **Web Vitals Dashboard** - Real user metrics

---

## 🚨 Problemas Identificados y Soluciones

### 1. LCP Alto (4.9s móvil)
**Causa:** Imagen hero cargada por JS, fonts blocking render
**Solución:**
- ✅ Preload imagen LCP
- ✅ Font-display: swap
- ✅ Inline critical CSS
- ⏳ CDN para imagen hero

### 2. TTFB Elevado (1.3s)
**Causa:** Sin OPcache, queries N+1, sin Redis
**Solución:**
- ✅ Redis para cache y sessions
- ✅ Comando optimize automático
- ⏳ Habilitar OPcache en producción
- ⏳ Auditoría de N+1 queries

### 3. CLS Desktop (0.36)
**Causa:** Imágenes sin dimensiones, lazy load incorrecto
**Solución:**
- ✅ aspect-ratio en CSS
- ⏳ Width/height explícitos
- ⏳ Skeleton screens

### 4. Bundle Size Grande (~800KB)
**Causa:** Todo en un solo chunk, dependencias pesadas
**Solución:**
- ✅ Code-splitting por vendor
- ✅ React.lazy() en rutas
- ✅ Terser minification
- ✅ Brotli compression

---

## 🔄 Cronograma de Implementación

### Semana 1: Quick Wins (Backend)
- [x] Configurar Redis
- [x] Comandos de caché
- [x] OPcache en PHP.ini
- [x] Middleware de caché

### Semana 2: Frontend Critical Path
- [x] Resource hints (preload/preconnect)
- [x] Code-splitting en Vite
- [x] Lazy loading componentes
- [ ] Critical CSS inline

### Semana 3: Assets & Media
- [ ] Conversión a WebP/AVIF
- [ ] Responsive images
- [ ] Lazy loading imágenes
- [ ] Font optimization

### Semana 4: Infrastructure
- [x] .htaccess optimization
- [ ] CDN setup
- [ ] HTTP/2 push
- [ ] SSL optimization

### Semana 5: Monitoring & Testing
- [x] Web Vitals integration
- [ ] Lighthouse CI
- [ ] Performance dashboard
- [ ] Load testing

---

## 📚 Referencias Técnicas

### Laravel Performance
- [Laravel Performance](https://laravel.com/docs/10.x/deployment#optimization)
- [OPcache Best Practices](https://www.php.net/manual/en/opcache.installation.php)
- [Redis Laravel](https://laravel.com/docs/10.x/redis)

### React & Vite
- [React Code-Splitting](https://react.dev/reference/react/lazy)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Bundle Analysis](https://github.com/btd/rollup-plugin-visualizer)

### Web Performance
- [Web Vitals](https://web.dev/articles/vitals)
- [Optimize LCP](https://web.dev/articles/optimize-lcp)
- [Optimize TTFB](https://web.dev/articles/optimize-ttfb)
- [Image Optimization](https://web.dev/articles/fast#optimize_your_images)

### Monitoring
- [Auditzy RUM](https://auditzy.com)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)

---

## ✅ Checklist de Verificación Pre-Deploy

### Backend
- [ ] `php -i | grep opcache` → enabled
- [ ] `redis-cli ping` → PONG
- [ ] `php artisan optimize` ejecutado
- [ ] `.env` con `CACHE_DRIVER=redis`
- [ ] Queries N+1 resueltas

### Frontend
- [ ] `npm run build` sin errores
- [ ] Bundle < 300KB (gzipped)
- [ ] LCP resource en HTML inicial
- [ ] Fonts con font-display: swap
- [ ] Imágenes con width/height

### Infrastructure
- [ ] Compression habilitado (Brotli/Gzip)
- [ ] Cache-Control headers correctos
- [ ] HTTP/2 activo
- [ ] CDN configurado
- [ ] SSL certificate válido

### Monitoring
- [ ] Web Vitals reportando
- [ ] Google Analytics tracking
- [ ] Error monitoring activo
- [ ] Performance budget configurado

---

**Última actualización:** 2025-10-04  
**Responsable:** DevOps Team  
**Revisión:** Quincenal
