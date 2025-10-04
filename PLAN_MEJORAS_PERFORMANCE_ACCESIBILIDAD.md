# Plan de Mejoras: Performance y Accesibilidad - CambiaFX.pe

## 📊 Estado Actual
- **Performance Desktop**: <40
- **Accesibilidad**: 84
- **Objetivo**: Performance >90, Accesibilidad 100
- **Core Web Vitals**: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms

---

## 🎯 FASE 1: Backend y Red (TTFB, FCP)

### 1.1 Configuración de Headers HTTP
**Archivo**: `.htaccess` o middleware Laravel

```apache
# Habilitar compresión Brotli/Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json application/xml
</IfModule>

# Cache-Control para assets versionados
<FilesMatch "\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2|ttf|eot|css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# HTML dinámico
<FilesMatch "\.(html|htm|php)$">
    Header set Cache-Control "no-cache, must-revalidate"
</FilesMatch>
```

**Acción**: ✅ Crear middleware Laravel para headers optimizados

### 1.2 CDN y Preconnect
- **CDN**: Configurar CloudFlare/KeyCDN con HTTP/3
- **Preconnect**: Ya implementados en `public.blade.php`
  - ✅ Google Fonts
  - ✅ flagcdn.com
  - ✅ Luna API
  - ✅ Google Translate

### 1.3 Optimización de Consultas
**Archivo**: Rutas y Controllers

- ✅ Implementar cache de fragmentos para Home
- ✅ Eager loading en consultas de landing/indicators/posts
- ✅ Cache Redis para datos estáticos (24h)

---

## 🚀 FASE 2: Render Inicial y LCP

### 2.1 Identificar y Optimizar LCP
**Elemento LCP**: Hero image en `HeroSecction.jsx`

**Implementación en `public.blade.php`**:
```blade
@if ($component === 'Home.jsx')
    <!-- Preload LCP image -->
    <link rel="preload" 
          fetchpriority="high" 
          as="image" 
          href="/api/landing_home/media/{{ $landingInicio->image ?? '' }}" 
          type="image/webp">
@endif
```

**✅ YA IMPLEMENTADO** - Verificar que la imagen esté en formato WebP/AVIF

### 2.2 Critical CSS
**Estrategia**:
1. Extraer CSS critical para hero section
2. Inline en `<head>` de `public.blade.php`
3. Cargar CSS completo de forma asíncrona

**Script de extracción**:
```bash
npm install --save-dev critical
```

**Archivo**: `extract-critical-css.js`
```javascript
import { generate } from 'critical';

generate({
  base: 'public/',
  src: 'index.html',
  target: 'critical.css',
  inline: true,
  width: 1920,
  height: 1080
});
```

### 2.3 Optimización de JS
**Ya implementado en `vite.config.js`**:
- ✅ Code splitting (vendor-react, vendor-motion, vendor-ui)
- ✅ Minificación Terser
- ✅ Drop console/debugger en producción

**Mejora adicional**: Lazy loading de secciones
```jsx
// YA IMPLEMENTADO en Home.jsx
const PrimeraOperacionSection = lazy(() => import("./components/..."));
const FuncionSection = lazy(() => import("./components/..."));
```

---

## 📐 FASE 3: Estabilidad Visual (CLS)

### 3.1 Dimensiones de Imágenes
**Acción**: Agregar width/height en todos los componentes

**Ejemplo para `HeroSecction.jsx`**:
```jsx
<img 
  src={imageSrc}
  alt={imageAlt}
  width="1920"
  height="1080"
  style={{ aspectRatio: '16/9' }}
  className="w-full h-auto"
/>
```

### 3.2 Slots para Banners
**Componente**: `AppStoreBanner.jsx`, `CintilloSection.jsx`

```jsx
// Reservar altura mínima
<div className="min-h-[60px] transition-all duration-300">
  {content}
</div>
```

### 3.3 Optimización de Fuentes
**Ya en `public.blade.php`**:
```blade
<link rel="preload" as="font" type="font/woff2" 
      href="/build/GeneralSans-Semibold.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" 
      href="/build/GeneralSans-Regular.woff2" crossorigin>
```

**CSS adicional**:
```css
@font-face {
  font-family: 'GeneralSans';
  font-display: swap; /* Importante para evitar FOIT */
  src: url('/build/GeneralSans-Regular.woff2') format('woff2');
}
```

---

## ⚡ FASE 4: Interactividad (INP)

### 4.1 Optimización de Event Listeners
**Home.jsx** - ✅ Ya implementado con `requestIdleCallback`

```jsx
// Popup Manager carga diferida
useEffect(() => {
  const schedule = () => setShouldRenderPopupManager(true);
  
  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(schedule, { timeout: 4000 });
    return () => window.cancelIdleCallback?.(idleId);
  }
  
  const timeoutId = window.setTimeout(schedule, 3000);
  return () => window.clearTimeout(timeoutId);
}, []);
```

### 4.2 Passive Listeners
**Componentes con scroll**: Agregar `{ passive: true }`

```jsx
useEffect(() => {
  const handleScroll = () => { /* ... */ };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 4.3 Throttle/Debounce
**Utility**: `resources/js/Utils/performance.js`

```javascript
export const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
```

---

## 🎨 FASE 5: Optimización de Recursos

### 5.1 Lazy Loading de Imágenes
**Componente genérico**: `OptimizedImage.jsx`

```jsx
import React from 'react';

export const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className = '' 
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={priority ? 'high' : 'auto'}
      className={className}
    />
  );
};
```

### 5.2 Eliminación de CSS No Usado
**PurgeCSS ya configurado en Tailwind**

Verificar con:
```bash
npm run build
```

### 5.3 Optimización de Third-Party Scripts
**`public.blade.php`** - ✅ Ya implementado:
- Tawk.to: Carga diferida (2.5s)
- Facebook Pixel: Carga diferida (1.5s)
- Google Translate: requestIdleCallback

---

## ♿ FASE 6: Accesibilidad

### 6.1 Contraste de Colores
**Verificar en `tailwind.config.js`**:

```javascript
colors: {
  // Verificar contraste mínimo 4.5:1
  accent: "#1A1A1A",      // ✅ Alto contraste sobre blanco
  secondary: "#BBFF52",   // ⚠️ Revisar sobre fondos claros
  primary: "#F9F3E0",     // ⚠️ Bajo contraste - usar solo fondos
  contrast: "#7E5AFB",    // ✅ Verificar sobre fondos oscuros
}
```

**Herramienta**: https://webaim.org/resources/contrastchecker/

### 6.2 Etiquetas y Formularios
**Componente**: Todos los forms

```jsx
<label htmlFor="email" className="block mb-2">
  Correo electrónico
  <span className="text-red-500" aria-label="obligatorio">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-error"
  className="..."
/>
<span id="email-error" role="alert" className="sr-only">
  {errors.email}
</span>
```

### 6.3 Semántica HTML
**Estructura base**:

```jsx
<header role="banner">
  <nav role="navigation" aria-label="Navegación principal">
</header>

<main role="main" id="main-content">
  <section aria-labelledby="hero-title">
    <h1 id="hero-title">...</h1>
  </section>
</main>

<footer role="contentinfo">
</footer>
```

### 6.4 Navegación por Teclado
**Estilos focus**:

```css
/* resources/css/app.css */
*:focus-visible {
  outline: 2px solid #7E5AFB;
  outline-offset: 2px;
  border-radius: 4px;
}

.skip-to-main {
  position: absolute;
  top: -40px;
  left: 0;
  background: #1A1A1A;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-to-main:focus {
  top: 0;
}
```

**HTML**:
```blade
<a href="#main-content" class="skip-to-main">
  Saltar al contenido principal
</a>
```

### 6.5 Atributos ARIA
**Modal**: `ModalAppointment.jsx`

```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Agendar cita</h2>
  <div id="modal-description">...</div>
  
  <button
    aria-label="Cerrar modal"
    onClick={onClose}
  >
    <span aria-hidden="true">×</span>
  </button>
</div>
```

### 6.6 Imágenes
**Decorativas vs Informativas**:

```jsx
// Informativa
<img src="..." alt="Cambio de dólares a soles con tasa preferencial" />

// Decorativa
<img src="..." alt="" role="presentation" />

// Iconos con contexto
<button aria-label="Cerrar menú">
  <svg aria-hidden="true">...</svg>
</button>
```

### 6.7 Lang Attribute
**Ya en `public.blade.php`**:
```blade
<html lang="es">
```

---

## 📋 FASE 7: Validación y Monitoring

### 7.1 Métricas Objetivo

| Métrica | Actual | Objetivo | Herramienta |
|---------|--------|----------|-------------|
| Performance | <40 | >90 | PageSpeed Insights |
| Accesibilidad | 84 | 100 | Lighthouse |
| LCP | ? | <2.5s | Core Web Vitals |
| CLS | ? | <0.1 | Core Web Vitals |
| INP | ? | <200ms | Core Web Vitals |
| FCP | ? | <1.8s | PageSpeed |
| TTFB | ? | <0.8s | PageSpeed |

### 7.2 Scripts de Validación

**package.json**:
```json
{
  "scripts": {
    "audit:performance": "lighthouse https://cambiafx.pe --output=html --output-path=./reports/lighthouse.html --preset=desktop",
    "audit:mobile": "lighthouse https://cambiafx.pe --output=html --output-path=./reports/lighthouse-mobile.html --preset=mobile",
    "audit:accessibility": "pa11y-ci https://cambiafx.pe",
    "build:production": "vite build --mode production && npm run audit:performance"
  }
}
```

**Instalar herramientas**:
```bash
npm install --save-dev lighthouse pa11y-ci
```

### 7.3 Monitoring Continuo
**Web Vitals en producción**: `resources/js/Utils/webVitals.js`

```javascript
export function reportWebVitals() {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onCLS, onFCP, onLCP, onINP, onTTFB }) => {
    const sendToAnalytics = (metric) => {
      // Google Analytics 4
      if (window.gtag) {
        gtag('event', metric.name, {
          value: Math.round(metric.value),
          event_category: 'Web Vitals',
          non_interaction: true,
        });
      }
      
      // Console en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log(metric);
      }
    };

    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  });
}
```

**Activar en `Home.jsx`**:
```jsx
import { reportWebVitals } from './Utils/webVitals';

useEffect(() => {
  reportWebVitals();
}, []);
```

---

## 🔧 ARCHIVOS A CREAR/MODIFICAR

### Nuevos Archivos
1. ✅ `app/Http/Middleware/PerformanceHeaders.php`
2. ✅ `resources/js/components/OptimizedImage.jsx`
3. ✅ `resources/js/Utils/performance.js`
4. ✅ `resources/js/Utils/webVitals.js`
5. ✅ `extract-critical-css.js`
6. ✅ `.htaccess` (optimización)

### Archivos a Modificar
1. ✅ `resources/views/public.blade.php` (critical CSS, skip link)
2. ✅ `resources/css/app.css` (focus styles, font-display)
3. ✅ `resources/js/Home.jsx` (web vitals, optimizaciones)
4. ⚠️ Componentes de secciones (dimensiones imágenes, ARIA)
5. ⚠️ Componentes de formularios (labels, ARIA)

---

## 📅 Timeline de Implementación

### Semana 1: Backend y Recursos
- [ ] Configurar headers HTTP (middleware)
- [ ] Implementar cache Redis
- [ ] Optimizar consultas DB
- [ ] Configurar CDN

### Semana 2: LCP y FCP
- [ ] Implementar Critical CSS
- [ ] Optimizar imagen hero
- [ ] Preload fonts optimization
- [ ] Verificar code splitting

### Semana 3: CLS e INP
- [ ] Agregar dimensiones a todas las imágenes
- [ ] Implementar slots para banners
- [ ] Optimizar event listeners
- [ ] Throttle/debounce en scroll

### Semana 4: Accesibilidad
- [ ] Auditoría de contraste
- [ ] Implementar skip links
- [ ] Agregar ARIA labels
- [ ] Revisar navegación por teclado
- [ ] Validar formularios

### Semana 5: Testing y Validación
- [ ] Tests en PageSpeed Insights
- [ ] Auditoría Lighthouse
- [ ] Tests en dispositivos reales
- [ ] Implementar monitoring
- [ ] Documentación final

---

## 🎯 Feature Flags (Rollout Gradual)

**Archivo**: `config/features.php`

```php
return [
    'performance' => [
        'critical_css' => env('FEATURE_CRITICAL_CSS', false),
        'webp_images' => env('FEATURE_WEBP_IMAGES', true),
        'lazy_loading' => env('FEATURE_LAZY_LOADING', true),
        'code_splitting' => env('FEATURE_CODE_SPLITTING', true),
    ],
    'accessibility' => [
        'skip_links' => env('FEATURE_SKIP_LINKS', true),
        'aria_labels' => env('FEATURE_ARIA_LABELS', true),
        'high_contrast' => env('FEATURE_HIGH_CONTRAST', false),
    ],
];
```

**Uso en Blade**:
```blade
@if(config('features.performance.critical_css'))
    <style>{!! $criticalCss !!}</style>
@endif
```

---

## 📊 Checklist de Validación Final

### Performance
- [ ] LCP < 2.5s en desktop y mobile
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] FCP < 1.8s
- [ ] TTFB < 0.8s
- [ ] Score PageSpeed Desktop > 90
- [ ] Score PageSpeed Mobile > 80

### Accesibilidad
- [ ] Score Lighthouse = 100
- [ ] Navegación completa por teclado
- [ ] Lectores de pantalla funcionales
- [ ] Contraste mínimo 4.5:1
- [ ] Sin errores de validación HTML
- [ ] ARIA implementado correctamente
- [ ] Formularios totalmente accesibles

### SEO
- [ ] Meta tags completos
- [ ] Estructura semántica correcta
- [ ] Schema.org implementado
- [ ] Sitemap actualizado
- [ ] Robots.txt optimizado

---

## 📚 Recursos Adicionales

- **Web Vitals**: https://web.dev/vitals/
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **React Performance**: https://react.dev/learn/render-and-commit
- **Laravel Performance**: https://laravel.com/docs/optimization

---

**Última actualización**: 2025-10-04
**Responsable**: Equipo de Desarrollo CambiaFX
**Próxima revisión**: Cada sprint (2 semanas)
