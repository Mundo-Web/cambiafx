# 🚀 Plan de Ejecución Técnica SEO & WPO · CambiaFX.pe
> **Camino Seleccionado:** Camino 1 — Capa de Prerender / Cloudflare Worker + Optimización Core Web Vitals + Accesibilidad  
> **Stack Técnico:** Laravel + Inertia.js + React + Vite + Cloudflare  
> **Objetivo:** Resolver las 15 observaciones técnicas del ticket SEO, habilitar la indexabilidad al 100% para bots e IAs, y llevar el rendimiento móvil de 48 a 80+ en PageSpeed.

---

## 📑 Índice de Ejecución por Partes

1. [Requisitos Previos y Accesos](#-requisitos-previos-y-accesos)
2. [Parte 1 · Bloque A: Renderizado y Rastreo (Crítico)](#-parte-1--bloque-a-renderizado-y-rastreo-crítico)
3. [Parte 2 · Bloque B: Performance y Core Web Vitals (Alta)](#-parte-2--bloque-b-performance-y-core-web-vitals-alta)
4. [Parte 3 · Bloque C: Accesibilidad y Navegación Agéntica (Media)](#-parte-3--bloque-c-accesibilidad-y-navegación-agéntica-media)
5. [Parte 4 · Verificación, Pruebas y Despliegue](#-parte-4--verificación-pruebas-y-despliegue)
6. [Matriz de Seguimiento y Checklist](#-matriz-de-seguimiento-y-checklist)

---

## 🔑 Requisitos Previos y Accesos

Antes de iniciar la codificación, asegurar tener listos:
- [ ] **Cloudflare:** Acceso con permisos para crear y desplegar Cloudflare Workers, configurar Page Rules / Redirect Rules y purga de caché.
- [ ] **Git Repository:** Repositorio en GitHub/GitLab/Bitbucket. Crear rama de trabajo: `feature/seo-performance-camino1`.
- [ ] **Google Search Console (GSC):** Permiso de lectura/administrador para verificar propiedades con y sin `www` y monitorear la indexación.
- [ ] **Google Tag Manager (GTM):** Acceso al contenedor activo para auditar y diferir scripts pesados de terceros (Pixel, Clarity, heatmaps, chat).
- [ ] **Entorno Local / Staging:** Proyecto funcional en local (`composer install`, `npm install`, base de datos y `.env` configurados).

---

## 🧱 PARTE 1 · Bloque A: Renderizado y Rastreo (Crítico)
*Meta: Que las 6 landings y los 40 posts sean 100% legibles e indexables para Googlebot, Bingbot, GPTBot, ClaudeBot y Perplexity.*

### 📍 A1. Capa de Prerender para Bots (Cloudflare Worker)
* **Diagnóstico:** La web es una SPA en Inertia.js. `curl https://cambiafx.pe/` solo retorna un `<div id="app" data-page="..."></div>` vacío; los bots de IA y rastreadores ven una página en blanco.
* **Archivos involucrados:**
  - `cloudflare-worker/prerender-worker.js` (a crear en la raíz o repo)
  - `routes/web.php` / Middleware de Laravel (opcional si se usa prerender middleware)
* **Paso a paso de implementación:**
  1. Identificar User-Agents rastreadores:
     `Googlebot`, `bingbot`, `Baiduspider`, `yandex`, `facebookexternalhit`, `Twitterbot`, `rogerbot`, `LinkedInBot`, `embedly`, `quora link preview`, `showyoubot`, `outbrain`, `pinterest`, `slackbot`, `vkShare`, `W3C_Validator`, `GPTBot`, `ClaudeBot`, `PerplexityBot`.
  2. Implementar Worker en Cloudflare:
     - Si la petición proviene de un bot en la lista: redirigir internamente al servicio de renderizado (ej. Prerender.io o servicio headless Chromium) con caché edge de 24 horas (`cf-cache-ttl: 86400`).
     - Si la petición proviene de un usuario regular: pasar la petición intacta hacia el origen Laravel (`mi.cambiafx.pe` / servidor actual).
  3. Validar que la respuesta para bots contenga:
     - Etiquetas `<h1>` semánticas, textos y FAQs completas.
     - En `/tipo-de-cambio-hoy`, la cifra de compra/venta actualizada con fecha/hora.
* **Comando de prueba:**
  ```bash
  curl -A "Googlebot" -s -L https://cambiafx.pe/ | grep -i "<h1"
  curl -A "GPTBot" -s -L https://cambiafx.pe/tipo-de-cambio-hoy | grep -i "compra"
  ```

---

### 📍 A2. Consolidación de Dominio (www a sin-www) y Canonicals
* **Diagnóstico:** La home declara canonical con `www`, pero las landings, blog y `og:url` usan sin `www`. Divide autoridad y duplica URLs.
* **Archivos involucrados:**
  - Cloudflare Dashboard: *Redirect Rules* o Page Rules.
  - `resources/views/public.blade.php`
  - `resources/views/components/seo-meta-tags.blade.php`
* **Paso a paso de implementación:**
  1. En Cloudflare, crear una **Redirect Rule (301 permanente)**:
     - Condición: `Hostname eq "www.cambiafx.pe"`
     - Acción: Redirigir dinámicamente a `https://cambiafx.pe/` manteniendo URI y Query String.
  2. En `resources/views/public.blade.php` y componentes SEO:
     - Asegurar que la función que genera el canonical (`$seoUrl`) siempre use `https://cambiafx.pe`.
     - Homologar `og:url`, `twitter:url` y las URLs de `sitemap.xml`.
  3. Verificar en Google Search Console que ambas propiedades existan y la versión sin-www sea la principal.

---

### 📍 A3. Publicación de `/llms.txt` y `/llms-full.txt`
* **Diagnóstico:** Los bots de IA modernos buscan el estándar `/llms.txt` para entender el modelo de negocio y servicios regulados de la entidad.
* **Archivos a crear en `public/`:**
  - `public/llms.txt`
  - `public/llms-full.txt`
  - `routes/web.php` (para asegurar cabecera `Content-Type: text/plain; charset=utf-8`)
* **Contenido a incluir:**
  - Razón social: CambiaFX SAC (RUC, Registro SBS vigente).
  - Objeto del negocio: Casa de cambio online y transferencias bancarias interbancarias en Perú.
  - Horarios de atención, bancos compatibles (BCP, Interbank, BBVA, Scotiabank, etc.).
  - Enlaces a las 6 landings principales y guías del blog.

---

### 📍 A4. Datos Estructurados JSON-LD
* **Diagnóstico:** Falta marcado de esquemas para entidades financieras reguladas, preguntas frecuentes y artículos.
* **Archivos involucrados:**
  - `resources/views/components/seo-meta-tags.blade.php`
* **Paso a paso de implementación:**
  1. **Global (todas las páginas):**
     - Esquema `@type: ["Organization", "FinancialService"]` con nombre legal, RUC, logo, dirección en Lima, teléfonos y `sameAs` (redes sociales oficiales).
  2. **En Home (`/`):**
     - Esquema `WebSite` con `potentialAction` (`SearchAction`).
  3. **En Landings (`/tipo-de-cambio-hoy`, etc.):**
     - Esquema `FAQPage` extrayendo las preguntas y respuestas reales del componente.
     - Esquema `BreadcrumbList`.
  4. **En Artículos de Blog:**
     - Esquema `Article` / `BlogPosting` con `author`, `datePublished`, `dateModified`, `headline`, `image`.
  5. **Validación:** Probar con la herramienta oficial de [Google Rich Results Test](https://search.google.com/test/rich-results).

---

### 📍 A5. Depuración de Errores en Consola y Panel Issues
* **Diagnóstico:** Recursos bloqueados, advertencias de cookies sin `SameSite` o errores JS en carga inicial que penalizan la puntuación de Prácticas Recomendadas.
* **Paso a paso de implementación:**
  1. Abrir DevTools en modo incógnito con caché vacía en la Home, una landing y un post.
  2. Corregir cualquier script con error 404/CORS o cookies de terceros sin flags `Secure` y `SameSite=Lax/None`.
  3. Revisar políticas de CSP (Content Security Policy) si existen bloqueos en consola.

---

## ⚡ PARTE 2 · Bloque B: Performance y Core Web Vitals (Alta)
*Meta: Llevar el puntaje móvil de 48 a 80+ en PageSpeed. LCP < 2.5s, CLS < 0.1, TBT < 200ms.*

### 📍 B1. Recursos que Bloquean el Renderizado (FCP y LCP)
* **Diagnóstico:** 740 ms en móvil de CSS y JS bloqueante antes del primer pintado; fuentes sin `font-display`.
* **Archivos involucrados:**
  - `resources/views/public.blade.php`
  - `vite.config.js`
* **Acciones:**
  1. Identificar el CSS crítico superior (Above-The-Fold) de la Home e insertarlo inline en `<style>` en el `<head>`.
  2. Para el resto de estilos no críticos: cargarlos de forma asíncrona mediante:
     ```html
     <link rel="preload" href="/build/assets/app.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
     ```
  3. En `@font-face` (fuente General Sans): asegurar `font-display: swap;`. Mantener los preloads existentes de `woff2`.
  4. Agregar atributo `defer` a todos los scripts secundarios.

---

### 📍 B2. Reducción de JS No Usado y Code Splitting
* **Diagnóstico:** 544 KiB de JS no ejecutado en la Home y carga de la lógica pesada transaccional en el sitio público.
* **Archivos involucrados:**
  - `resources/js/app.jsx` / `resources/js/Pages/*`
  - `vite.config.js`
* **Acciones:**
  1. **Lazy Loading de Rutas en React:** Separar la app transaccional (`mi.cambiafx.pe`) y componentes pesados (calculadora avanzada, modales, gráficos históricos) usando `React.lazy()` y `Suspense`.
  2. **Configuración de Rollup en `vite.config.js`:**
     Configurar `manualChunks` para aislar librerías de terceros (`vendor`) por separado:
     ```javascript
     build: {
       rollupOptions: {
         output: {
           manualChunks(id) {
             if (id.includes('node_modules')) {
               return 'vendor';
             }
           }
         }
       }
     }
     ```
  3. **Auditoría de GTM:** En Google Tag Manager, diferir etiquetas pesadas (Meta Pixel, Clarity/Hotjar, chat flotante) para que disparen en el evento `Window Loaded` o tras 3 segundos de inactividad, nunca en el arranque inicial.

---

### 📍 B3. Optimización del Hilo Principal y Librerías
* **Diagnóstico:** 5.0 s de trabajo en el hilo principal en móvil por ejecución pesada de scripts.
* **Acciones:**
  1. Identificar librerías duplicadas (ej. jQuery conviviendo con React o paquetes de iconos duplicados) y eliminarlas.
  2. Envolver tareas analíticas secundarias en `window.requestIdleCallback()` o `setTimeout(..., 1000)`.

---

### 📍 B4. Optimización de Imágenes y Estabilidad Visual (CLS)
* **Diagnóstico:** CLS alto en escritorio (0.513 cuando debe ser < 0.1). Imágenes sin dimensiones (`width`/`height`) y en formatos pesados.
* **Archivos involucrados:**
  - Componentes del Hero, Logos de Bancos, Ilustraciones y Banners.
* **Acciones:**
  1. Convertir todas las imágenes PNG/JPG a **WebP** o **AVIF** con compresión 80-85%.
  2. Declarar siempre atributos explícitos `width="..."` y `height="..."` o relación de aspecto CSS `aspect-ratio` en cada etiqueta `<img>`.
  3. En la imagen principal del Hero (candidata a LCP):
     - Agregar `fetchpriority="high"`.
     - **No** colocarle `loading="lazy"`.
  4. En imágenes debajo del scroll: colocar `loading="lazy"` y `decoding="async"`.
  5. Reservar contenedores con tamaño fijo (`min-height`) para el widget de cotización y banners dinámicos para evitar saltos de pantalla (CLS).

---

### 📍 B5. Políticas de Caché (`Cache-Control`) y Conexiones
* **Diagnóstico:** Assets con hash que se re-descargan por falta de cabeceras adecuadas.
* **Archivos involucrados:**
  - Servidor web (Nginx/.htaccess) y reglas de Cloudflare.
* **Configuración recomendada:**
  - Para assets de Vite con hash (`/build/assets/*`):
    `Cache-Control: public, max-age=31536000, immutable`
  - Para HTML dinámico (`/`, `/tipo-de-cambio-hoy`):
    `Cache-Control: public, max-age=0, must-revalidate`
  - Reducir `preconnect` únicamente a `fonts.gstatic.com` y al endpoint de la API de cotización en tiempo real.

---

### 📍 B6. Purga de CSS No Usado y Reflow Forzado
* **Acciones:**
  1. Revisar `tailwind.config.js` para asegurar que la propiedad `content` incluya exactamente todas las rutas de vistas Blade y componentes JSX/TSX.
  2. Auditar lecturas en JS como `offsetHeight`, `getBoundingClientRect()` o `scrollTop` al cargar la página para que no fuercen reflow sincrónico en bucles.

---

### 📍 B7. Source Maps Seguros
* **Acciones:**
  1. Generar source maps ocultos (`sourcemap: 'hidden'` en `vite.config.js`) para diagnóstico interno sin exponer el código fuente original a usuarios públicos.

---

## ♿ PARTE 3 · Bloque C: Accesibilidad y Navegación Agéntica (Media)
*Meta: Subir Accesibilidad de 84 a 95+ y habilitar navegación agéntica 2/2.*

### 📍 C1. Botones y Enlaces con Nombres Accesibles
* **Diagnóstico:** Botones con solo iconos (menú hamburguesa, cambiar moneda, WhatsApp) son anónimos para lectores de pantalla y agentes de IA. Falta punto de referencia `<main>`.
* **Archivos involucrados:**
  - Componentes de Navbar, Footer, Widget de cambio y botones flotantes.
* **Acciones:**
  1. Agregar `aria-label` descriptivo a cada botón o enlace sin texto visible:
     - Botón invertir divisas: `aria-label="Invertir compra y venta de dólares"`
     - Botón menú: `aria-label="Abrir menú de navegación"`
     - Enlace WhatsApp: `aria-label="Contactar a CambiaFX por WhatsApp"`
  2. En los íconos SVG decorativos: agregar `aria-hidden="true"`.
  3. Vincular los inputs de monto con sus `<label for="...">` correspondientes.
  4. Envolver la estructura de las plantillas en etiquetas semánticas HTML5:
     `<header>`, `<main id="main-content">`, `<footer>`.

---

### 📍 C2. Contraste de Color y Legibilidad (WCAG AA)
* **Diagnóstico:** Textos sobre fondos lima y morado presentan contraste menor a 4.5:1.
* **Acciones:**
  1. Inspeccionar combinaciones de color en DevTools.
  2. Oscurecer el texto sobre fondo lima hasta lograr ratio > 4.5:1 (ej. `#2f4a00` o `#1a3000`).
  3. Aclarar el texto o ajustar el fondo en los bloques morados para cumplir mínimo 4.5:1 en texto regular y 3:1 en texto grande.

---

## 🧪 PARTE 4 · Verificación, Pruebas y Despliegue

### 1. Entorno de Desarrollo y Staging
- Ejecutar builds y pruebas en entorno local:
  ```bash
  npm run build
  php artisan optimize:clear
  ```
- Subir a rama `staging` y validar con PageSpeed Insights en URL de pruebas.

### 2. Comprobación de Rastreabilidad
- Verificar respuesta simulada de bots con `curl`:
  ```bash
  # Verificar que el HTML venga lleno con textos y H1
  curl -A "Googlebot" -s -L https://cambiafx.pe/ | grep -i "CambiaFX"
  ```

### 3. Métricas Objetivo de Aceptación
| Métrica | Estado Anterior | Objetivo a Verificar |
| :--- | :--- | :--- |
| **PageSpeed Móvil** | 48 / 100 | **75 – 85+** |
| **PageSpeed Escritorio** | 50 / 100 | **90+** |
| **Accesibilidad** | 84 / 100 | **95+** |
| **Contenido visible sin JS** | 0% (HTML en blanco) | **100% en landings y blog** |
| **LCP (Largest Contentful Paint)** | 6.5s móvil | **< 2.5s** |
| **CLS (Cumulative Layout Shift)** | 0.513 escritorio | **< 0.1** |
| **TBT (Total Blocking Time)** | 650ms móvil | **< 200ms** |

---

## 📋 Matriz de Seguimiento y Checklist

| Tarea | Bloque | Estado | Encargado |
| :--- | :---: | :---: | :---: |
| Cloudflare Worker para detección de bots y caché (`cloudflare/worker.js`) | A1 | 🚀 Listo para Despliegue | Dev |
| Redirección 301 www a sin-www y canonicals | A2 | 🚀 Integrado en Worker | Dev |
| Crear y publicar `/llms.txt` y `/llms-full.txt` (con Tab editable en Admin) | A3 | ✅ Completado | Dev |
| Estructurar JSON-LD (FinancialService, FAQ, Article) | A4 | ✅ Completado | Dev |
| Limpiar errores de consola y DevTools Issues | A5 | ✅ Completado | Dev |
| CSS crítico inline, font-display y optimización de recursos bloqueantes | B1 | ✅ Completado | Dev |
| Code splitting por ruta, optimización de Framer Motion en Hero y vendor chunks | B2 | ✅ Completado | Dev |
| Optimizar hilo principal, llamadas API en paralelo y eliminar librerías redundantes | B3 | ✅ Completado | Dev |
| Conversión WebP, dimensiones explícitas y fijar CLS | B4 | ⏳ Pendiente | Dev |
| Políticas Cache-Control y depurar preconnects | B5 | ⏳ Pendiente | Dev |
| Purgar CSS no usado en Tailwind y evitar layout reflow | B6 | ⏳ Pendiente | Dev |
| Source maps seguros para depuración interna | B7 | ⏳ Pendiente | Dev |
| Semántica HTML5 (`<main>`, `<label>`) y `aria-label` | C1 | ⏳ Pendiente | Dev |
| Ajuste de contraste de colores según WCAG | C2 | ⏳ Pendiente | Dev |
| Auditoría final en PageSpeed y Search Console | QA | ⏳ Pendiente | Dev |
