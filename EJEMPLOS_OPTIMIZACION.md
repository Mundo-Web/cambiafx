# 📖 Ejemplos Prácticos de Optimización

## 🎯 Índice
1. [Uso del Comando de Optimización](#comando-optimizacion)
2. [Implementar Lazy Loading en Componentes](#lazy-loading)
3. [Configurar Web Vitals Monitoring](#web-vitals)
4. [Optimizar Imágenes para LCP](#imagenes-lcp)
5. [Aplicar Middleware de Caché](#middleware-cache)
6. [Preload de Recursos Críticos](#preload)

---

## 1. Comando de Optimización {#comando-optimizacion}

### Uso Básico

```bash
# Optimizar la aplicación completa
php artisan app:optimize-all

# Limpiar cachés antiguos y re-optimizar
php artisan app:optimize-all --clear
```

### Salida Esperada

```
🚀 Starting CambiaFX optimization...

🧹 Clearing existing caches...
  → Clearing Routes cache...
  → Clearing Config cache...
  → Clearing View cache...
  → Clearing Application cache...
  → Clearing Event cache...

⚡ Optimizing application...
  → Caching configuration...
  → Caching routes...
  → Caching views...
  → Caching events...
  → Optimizing Composer autoloader...
    ✓ Composer autoloader optimized

✅ Optimization completed successfully!

┌─────────────┬──────────────┐
│ Cache Type  │ Status       │
├─────────────┼──────────────┤
│ Routes      │ ✓ Cached     │
│ Config      │ ✓ Cached     │
│ Views       │ ✓ Cached     │
│ Events      │ ✓ Cached     │
└─────────────┴──────────────┘
```

### Integrar en Deploy

```bash
# En tu script de deploy
git pull origin main
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan app:optimize-all --clear
php artisan migrate --force
```

---

## 2. Implementar Lazy Loading en Componentes {#lazy-loading}

### Ejemplo 1: Componente Pesado (Chart)

**Antes:**
```jsx
// Home.jsx
import { Chart } from 'chart.js';
import HeavyChartComponent from './components/HeavyChartComponent';

export default function Home() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChartComponent data={chartData} />
    </div>
  );
}
```

**Después:**
```jsx
// Home.jsx
import { LazyComponent } from '@/components/LazyComponent';

const HeavyChartComponent = LazyComponent(
  () => import('./components/HeavyChartComponent'),
  {
    fallback: (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChartComponent data={chartData} />
    </div>
  );
}
```

### Ejemplo 2: Modal con Contenido Pesado

```jsx
import { LazyComponent } from '@/components/LazyComponent';
import { useState } from 'react';

const VideoPlayerModal = LazyComponent(
  () => import('./components/VideoPlayerModal')
);

export default function VideoGallery() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Ver Video
      </button>
      
      {showModal && (
        <VideoPlayerModal 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}
```

### Ejemplo 3: Lazy Load on Scroll (Infinite Scroll)

```jsx
import { useLazyLoad } from '@/components/LazyComponent';
import { useState } from 'react';

const BlogPostCard = LazyComponent(
  () => import('./components/BlogPostCard')
);

export default function BlogList({ posts }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useLazyLoad(() => setLoaded(true), {
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <div ref={ref}>
      {loaded ? (
        posts.map(post => <BlogPostCard key={post.id} post={post} />)
      ) : (
        <div className="h-64 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}
```

### Ejemplo 4: Preload on Hover

```jsx
import { LazyComponent, preloadComponent } from '@/components/LazyComponent';

const importProfileModal = () => import('./components/ProfileModal');
const ProfileModal = LazyComponent(importProfileModal);

export default function UserCard({ user }) {
  return (
    <div>
      <button
        onMouseEnter={() => preloadComponent(importProfileModal)}
        onClick={() => setShowProfile(true)}
      >
        Ver Perfil
      </button>
      
      {showProfile && <ProfileModal user={user} />}
    </div>
  );
}
```

---

## 3. Configurar Web Vitals Monitoring {#web-vitals}

### Integración Básica

```jsx
// resources/js/app.jsx
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import WebVitalsMonitor from './components/WebVitalsMonitor';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    return pages[`./Pages/${name}.jsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <>
        <WebVitalsMonitor />
        <App {...props} />
      </>
    );
  },
});
```

### Reportar a Google Analytics

```jsx
// resources/js/hooks/useWebVitals.js - Ya incluido
export const reportWebVitalsToGA = (metric) => {
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      metric_rating: metric.rating,
    });
  }
};
```

### Dashboard Personalizado

```jsx
import { useState, useEffect } from 'react';
import { onLCP, onFCP, onCLS, onINP, onTTFB } from 'web-vitals';

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const updateMetric = (metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name]: {
          value: metric.value,
          rating: metric.rating,
        }
      }));
    };

    onLCP(updateMetric);
    onFCP(updateMetric);
    onCLS(updateMetric);
    onINP(updateMetric);
    onTTFB(updateMetric);
  }, []);

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {Object.entries(metrics).map(([name, data]) => (
        <div 
          key={name}
          className={`p-4 rounded-lg ${
            data.rating === 'good' ? 'bg-green-100' :
            data.rating === 'needs-improvement' ? 'bg-yellow-100' :
            'bg-red-100'
          }`}
        >
          <h3 className="font-bold">{name}</h3>
          <p className="text-2xl">
            {name === 'CLS' 
              ? data.value.toFixed(3) 
              : `${Math.round(data.value)} ms`
            }
          </p>
          <p className="text-sm">{data.rating}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Optimizar Imágenes para LCP {#imagenes-lcp}

### Imagen Hero (Above the Fold)

```blade
{{-- resources/views/public_with_seo.blade.php --}}

@if(Route::currentRouteName() === 'Home.jsx')
  <!-- Preload de imagen LCP -->
  <link 
    rel="preload" 
    as="image" 
    href="/assets/img/hero-banner.webp"
    fetchpriority="high"
  >
@endif
```

```jsx
// Home.jsx
export default function Home() {
  return (
    <div>
      <img
        src="/assets/img/hero-banner.webp"
        srcSet="
          /assets/img/hero-banner-320.webp 320w,
          /assets/img/hero-banner-768.webp 768w,
          /assets/img/hero-banner-1920.webp 1920w
        "
        sizes="100vw"
        width="1920"
        height="1080"
        alt="Cambio de divisas seguro en Perú"
        loading="eager"
        fetchpriority="high"
        className="w-full h-auto"
      />
    </div>
  );
}
```

### Imágenes Below the Fold

```jsx
export default function ProductGallery({ products }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product, index) => (
        <img
          key={product.id}
          src={product.image_webp}
          width="400"
          height="400"
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-auto aspect-square object-cover"
        />
      ))}
    </div>
  );
}
```

### Componente de Imagen Optimizada

```jsx
export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className = ''
}) {
  const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
```

---

## 5. Aplicar Middleware de Caché {#middleware-cache}

### Registrar Middleware

```php
// app/Http/Kernel.php
protected $middlewareAliases = [
    // ... otros middlewares
    'cache.response' => \App\Http\Middleware\CacheResponse::class,
];
```

### Usar en Rutas

```php
// routes/web.php

// Cache por 1 hora (3600 segundos)
Route::get('/blog', [BlogController::class, 'index'])
    ->middleware('cache.response:3600');

// Cache por 24 horas
Route::get('/about', [PageController::class, 'about'])
    ->middleware('cache.response:86400');

// Grupo de rutas con cache
Route::middleware(['cache.response:7200'])->group(function () {
    Route::get('/productos', [ProductController::class, 'index']);
    Route::get('/servicios', [ServiceController::class, 'index']);
    Route::get('/casos-exito', [CaseStudyController::class, 'index']);
});
```

### Invalidar Caché Cuando Cambia Contenido

```php
// app/Observers/BlogPostObserver.php
namespace App\Observers;

use App\Models\BlogPost;
use Illuminate\Support\Facades\Cache;

class BlogPostObserver
{
    public function saved(BlogPost $post)
    {
        // Invalidar cache de la página de blog
        Cache::tags(['blog'])->flush();
    }
}
```

---

## 6. Preload de Recursos Críticos {#preload}

### Fuentes Críticas

```blade
{{-- Solo preload fuentes usadas above the fold --}}
<link 
  rel="preload" 
  href="/fonts/Poppins-Regular.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
>
<link 
  rel="preload" 
  href="/fonts/Poppins-Bold.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
>
```

### CSS Crítico

```blade
<head>
  <!-- Inline critical CSS -->
  <style>
    /* Critical above-the-fold styles */
    body { 
      font-family: 'Poppins', sans-serif; 
      margin: 0;
      padding: 0;
    }
    
    .hero { 
      min-height: 100vh; 
      background: linear-gradient(to right, #667eea, #764ba2);
    }
    
    .container { 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 0 1rem;
    }
  </style>
  
  <!-- Defer non-critical CSS -->
  <link 
    rel="stylesheet" 
    href="/css/app.css" 
    media="print" 
    onload="this.media='all'"
  >
</head>
```

### JavaScript Non-Blocking

```blade
{{-- Critical JS inline --}}
<script>
  // Minimal critical JS
  window.APP_CONFIG = {!! json_encode($config) !!};
</script>

{{-- Defer non-critical JS --}}
<script defer src="/js/analytics.js"></script>
<script defer src="/js/tracking.js"></script>

{{-- Async para scripts independientes --}}
<script async src="https://www.googletagmanager.com/gtag/js"></script>
```

---

## 🎯 Checklist de Implementación

Marca cada elemento al implementarlo:

### Backend
- [ ] Comando `app:optimize-all` registrado
- [ ] Middleware `CacheResponse` aplicado a rutas estáticas
- [ ] Redis configurado en `.env`
- [ ] OPcache habilitado en PHP
- [ ] Composer autoloader optimizado

### Frontend
- [ ] `LazyComponent` implementado en componentes pesados
- [ ] `WebVitalsMonitor` integrado en app principal
- [ ] Imágenes LCP con `preload` y `fetchpriority="high"`
- [ ] Fuentes con `font-display: swap`
- [ ] CSS crítico inline

### Build
- [ ] `vite.config.js` con code-splitting granular
- [ ] Bundle size < 300KB (gzipped)
- [ ] Sourcemaps deshabilitados en producción
- [ ] CSS minificado

### Infrastructure
- [ ] `.htaccess` con Gzip/Brotli
- [ ] Cache-Control headers configurados
- [ ] Security headers activos
- [ ] ETags habilitados

---

## 📊 Testing

### Verificar Optimizaciones

```bash
# 1. Build
npm run build

# 2. Verificar tamaño de bundles
ls -lh public/build/assets/*.js

# 3. Test de caché
curl -I https://cambiafx.pe/assets/img/hero.webp | grep Cache-Control

# 4. Test de compresión
curl -H "Accept-Encoding: gzip,deflate" -I https://cambiafx.pe | grep Content-Encoding

# 5. Lighthouse
npm run audit:lighthouse
```

### Métricas Objetivo

| Archivo | Tamaño Máximo (gzipped) |
|---------|-------------------------|
| vendor-react.js | 120 KB |
| vendor-motion.js | 80 KB |
| vendor-ui.js | 50 KB |
| app.css | 30 KB |
| **Total** | **< 300 KB** |

---

**Última actualización:** 2025-10-04  
**Versión:** 1.0
