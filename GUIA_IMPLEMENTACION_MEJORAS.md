# Guía de Implementación - Mejoras de Performance y Accesibilidad

Esta guía te ayudará a implementar las mejoras de performance y accesibilidad para alcanzar los objetivos de Core Web Vitals y WCAG 2.1 AA.

## 📦 Instalación de Dependencias

```bash
# Instalar dependencias de desarrollo
npm install --save-dev critical lighthouse pa11y-ci web-vitals vite-bundle-visualizer purgecss

# O con yarn
yarn add --dev critical lighthouse pa11y-ci web-vitals vite-bundle-visualizer purgecss
```

## 🚀 Paso 1: Configurar Backend (Laravel)

### 1.1 Registrar Middleware de Performance

Editar `app/Http/Kernel.php`:

```php
protected $middleware = [
    // ... otros middlewares
    \App\Http\Middleware\PerformanceHeaders::class,
];
```

### 1.2 Configurar Cache Redis (Opcional pero recomendado)

En `.env`:

```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 1.3 Optimizar Consultas en Controllers

Ejemplo en `app/Http/Controllers/HomeController.php`:

```php
use Illuminate\Support\Facades\Cache;

public function index()
{
    $landing = Cache::remember('landing_home', 3600, function () {
        return Landing::where('status', true)
            ->select('id', 'title', 'description', 'image', 'correlative')
            ->get();
    });

    $posts = Cache::remember('posts_recent', 1800, function () {
        return Post::with('category:id,name')
            ->where('status', true)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();
    });

    // ... resto del código
}
```

### 1.4 Copiar configuración de Apache

```bash
# Copiar el archivo de configuración
copy .htaccess.performance .htaccess

# O agregar el contenido al .htaccess existente
```

## 🎨 Paso 2: Optimizar Frontend (React)

### 2.1 Actualizar Home.jsx con Web Vitals

Agregar al final del archivo `resources/js/Home.jsx`:

```jsx
import { reportWebVitals } from './Utils/webVitals';

// Dentro del componente Home, agregar:
useEffect(() => {
    // Reportar Web Vitals solo en producción
    if (process.env.NODE_ENV === 'production') {
        reportWebVitals();
    }
}, []);
```

### 2.2 Implementar OptimizedImage

Reemplazar imágenes en componentes con `OptimizedImage`:

**Antes:**
```jsx
<img src={data.image} alt={data.title} className="w-full h-auto" />
```

**Después:**
```jsx
import OptimizedImage from '../OptimizedImage';

<OptimizedImage
    src={data.image}
    alt={data.title}
    width={1920}
    height={1080}
    priority={false}
    className="w-full h-auto"
/>
```

Para la imagen hero (LCP), usar `priority={true}`:

```jsx
<OptimizedImage
    src={landingInicio?.image}
    alt={landingInicio?.title}
    width={1920}
    height={1080}
    priority={true}
    className="w-full h-auto object-cover"
/>
```

### 2.3 Agregar Skip Link en public.blade.php

Después de `<body>`:

```blade
<body class="font-poppins">
    <a href="#main-content" class="skip-to-main">
        Saltar al contenido principal
    </a>
    
    @inertia
    <!-- resto del contenido -->
</body>
```

Y en `Header.jsx` o layout principal:

```jsx
<main id="main-content" role="main" tabIndex="-1">
    {children}
</main>
```

## 🖼️ Paso 3: Optimizar Imágenes

### 3.1 Convertir Imágenes a WebP/AVIF

```bash
# Instalar herramientas
npm install --save-dev @squoosh/lib sharp

# Script de conversión (crear en scripts/convert-images.js)
node scripts/convert-images.js
```

Script básico:

```javascript
const sharp = require('sharp');
const glob = require('glob');
const path = require('path');

glob('public/assets/**/*.{jpg,jpeg,png}', async (err, files) => {
    for (const file of files) {
        const outputWebP = file.replace(/\.(jpg|jpeg|png)$/, '.webp');
        const outputAVIF = file.replace(/\.(jpg|jpeg|png)$/, '.avif');
        
        await sharp(file)
            .webp({ quality: 85 })
            .toFile(outputWebP);
            
        await sharp(file)
            .avif({ quality: 80 })
            .toFile(outputAVIF);
            
        console.log(`✅ Converted: ${file}`);
    }
});
```

### 3.2 Actualizar Referencias

Usar `<picture>` para múltiples formatos:

```jsx
<picture>
    <source srcSet="/assets/hero.avif" type="image/avif" />
    <source srcSet="/assets/hero.webp" type="image/webp" />
    <img src="/assets/hero.jpg" alt="Hero" width="1920" height="1080" />
</picture>
```

## 📝 Paso 4: Critical CSS

### 4.1 Extraer Critical CSS

```bash
# Ejecutar el servidor local
php artisan serve

# En otra terminal, extraer CSS crítico
node extract-critical-css.js
```

### 4.2 Incluir Critical CSS en Blade

Editar `resources/views/public.blade.php`:

```blade
<head>
    <!-- ... otros meta tags ... -->
    
    @if ($component === 'Home.jsx' && file_exists(resource_path('views/critical/home-critical.css')))
        <style>
            {!! file_get_contents(resource_path('views/critical/home-critical.css')) !!}
        </style>
    @endif
    
    <!-- Cargar CSS completo de forma asíncrona -->
    @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
</head>
```

## ♿ Paso 5: Mejorar Accesibilidad

### 5.1 Actualizar Formularios

**Ejemplo - Contacto:**

```jsx
import { generateId } from './Utils/accessibility';

const emailId = generateId('email');
const emailErrorId = generateId('email-error');

<div className="form-group">
    <label htmlFor={emailId} className="block mb-2 font-semibold">
        Correo electrónico
        <span className="text-red-500" aria-label="obligatorio">*</span>
    </label>
    <input
        id={emailId}
        type="email"
        required
        aria-required="true"
        aria-invalid={errors.email ? 'true' : 'false'}
        aria-describedby={errors.email ? emailErrorId : undefined}
        className="w-full px-4 py-2 border rounded"
    />
    {errors.email && (
        <span 
            id={emailErrorId} 
            role="alert" 
            className="text-red-500 text-sm mt-1"
        >
            {errors.email}
        </span>
    )}
</div>
```

### 5.2 Actualizar Modales

```jsx
import { trapFocus, announce } from './Utils/accessibility';

const ModalAppointment = ({ isOpen, onClose }) => {
    const modalRef = useRef();
    
    useEffect(() => {
        if (isOpen && modalRef.current) {
            // Trapear foco
            const cleanup = trapFocus(modalRef.current);
            
            // Anunciar apertura
            announce('Modal de cita abierto');
            
            // Focus en primer elemento
            const firstInput = modalRef.current.querySelector('input');
            firstInput?.focus();
            
            return cleanup;
        }
    }, [isOpen]);
    
    return (
        <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="..."
        >
            <h2 id="modal-title" className="...">
                Agendar Cita
            </h2>
            
            <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="..."
            >
                <span aria-hidden="true">×</span>
            </button>
            
            {/* contenido */}
        </div>
    );
};
```

### 5.3 Verificar Contraste

```javascript
import { checkContrast } from './Utils/accessibility';

// En desarrollo, verificar contrastes
if (process.env.NODE_ENV === 'development') {
    const result = checkContrast('#1A1A1A', '#FFFFFF');
    console.log('Contrast ratio:', result);
    // { ratio: "20.68", AA: true, AALarge: true, AAA: true, AAALarge: true }
}
```

## 🧪 Paso 6: Testing y Validación

### 6.1 Build de Producción

```bash
npm run build
```

### 6.2 Auditorías

```bash
# Lighthouse Desktop
npm run audit:lighthouse

# Lighthouse Mobile
npm run audit:lighthouse-mobile

# Accesibilidad
npm run audit:accessibility

# Todo junto
npm run audit:full
```

Los reportes se guardan en `./reports/`

### 6.3 Verificar en PageSpeed Insights

```bash
# Abrir navegador en:
https://pagespeed.web.dev/analysis?url=https://cambiafx.pe
```

### 6.4 Análisis de Bundle

```bash
npm run build

# Ver visualizador
npm run analyze
```

## 📊 Paso 7: Monitoreo Continuo

### 7.1 Configurar Google Analytics 4

En `public.blade.php`, agregar:

```blade
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 7.2 Endpoint Personalizado (Opcional)

Crear ruta en `routes/api.php`:

```php
Route::post('/vitals', function (Request $request) {
    \Log::channel('vitals')->info('Web Vital', $request->all());
    return response()->json(['status' => 'ok']);
});
```

En `resources/js/Home.jsx`:

```jsx
import { setVitalsEndpoint } from './Utils/webVitals';

useEffect(() => {
    setVitalsEndpoint('/api/vitals');
}, []);
```

## 🎯 Verificación Final

Usar el checklist: `CHECKLIST_PERFORMANCE_ACCESSIBILITY.md`

### Objetivos Mínimos:
- ✅ LCP < 2.5s
- ✅ CLS < 0.1
- ✅ INP < 200ms
- ✅ Performance Desktop > 90
- ✅ Accessibility Score = 100

## 🐛 Troubleshooting

### Problema: LCP alto

**Soluciones:**
1. Verificar que imagen hero tiene `priority={true}`
2. Confirmar preload en `<head>`
3. Optimizar tamaño de imagen (< 200KB)
4. Verificar CDN está activo

### Problema: CLS alto

**Soluciones:**
1. Agregar `width` y `height` a todas las imágenes
2. Reservar espacio para banners/ads
3. Verificar `font-display: swap` en fuentes
4. Usar `aspect-ratio` en CSS

### Problema: INP alto

**Soluciones:**
1. Reducir tareas largas (> 50ms)
2. Usar `throttle/debounce` en listeners
3. Implementar `requestIdleCallback`
4. Dividir procesamiento en chunks

### Problema: Accesibilidad < 100

**Soluciones:**
1. Verificar contraste de colores
2. Agregar labels a todos los inputs
3. Implementar ARIA attributes
4. Testear con screen reader

## 📚 Recursos

- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Laravel Optimization](https://laravel.com/docs/optimization)

## 🆘 Soporte

Si encuentras problemas durante la implementación:

1. Revisa los logs de Laravel: `storage/logs/laravel.log`
2. Revisa errores de build: `npm run build`
3. Verifica la consola del navegador
4. Consulta el documento completo: `PLAN_MEJORAS_PERFORMANCE_ACCESIBILIDAD.md`

---

**¡Éxito con la implementación! 🚀**
