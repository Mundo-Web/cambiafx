# ⚡ Quick Start - Mejoras de Performance y Accesibilidad

## 🎯 Implementación Rápida en 30 Minutos

Esta guía te permite implementar las mejoras críticas en media hora.

---

## ✅ PASO 1: Instalación (5 minutos)

```bash
# Instalar dependencias de desarrollo
npm install --save-dev web-vitals

# O si prefieres todas las herramientas de testing
npm install --save-dev critical lighthouse pa11y-ci web-vitals vite-bundle-visualizer
```

---

## ✅ PASO 2: Backend - Middleware (3 minutos)

### Registrar en `app/Http/Kernel.php`:

```php
protected $middleware = [
    // ... otros middlewares existentes
    \App\Http\Middleware\PerformanceHeaders::class,
];
```

**El archivo `PerformanceHeaders.php` ya está creado en `app/Http/Middleware/`**

---

## ✅ PASO 3: Optimizar CSS (2 minutos)

### El archivo `resources/css/app.css` ya está actualizado con:
- ✅ `font-display: swap` en fuentes
- ✅ Estilos de accesibilidad
- ✅ Focus visible mejorado
- ✅ Skip navigation link

**No requiere acción adicional** ✨

---

## ✅ PASO 4: Implementar Web Vitals en Home (5 minutos)

### Editar `resources/js/Home.jsx`:

Agregar al inicio del archivo (después de los imports):
```jsx
import { reportWebVitals } from './Utils/webVitals';
```

Agregar dentro del componente Home (antes del return):
```jsx
// Monitoreo de Web Vitals (solo en producción)
useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
        reportWebVitals();
    }
}, []);
```

---

## ✅ PASO 5: Optimizar Imagen Hero (10 minutos)

### En el componente donde está la imagen principal (probablemente HeroSecction.jsx):

**Buscar:**
```jsx
<img src={data?.image} alt={data?.title} />
```

**Reemplazar por:**
```jsx
import OptimizedImage from '../../OptimizedImage';

// Más abajo en el JSX:
<OptimizedImage
    src={data?.image}
    alt={data?.title || 'Cambio de divisas en línea'}
    width={1920}
    height={1080}
    priority={true}
    className="w-full h-auto object-cover"
/>
```

---

## ✅ PASO 6: Agregar Skip Link (2 minutos)

### En `resources/views/public.blade.php`:

Buscar la etiqueta `<body>` y agregar inmediatamente después:

```blade
<body class="font-poppins">
    <a href="#main-content" class="skip-to-main">
        Saltar al contenido principal
    </a>
    
    @inertia
    <!-- resto del código -->
</body>
```

---

## ✅ PASO 7: Build y Test (3 minutos)

```bash
# Build de producción
npm run build

# Test rápido local
npm run audit:lighthouse

# O visitar PageSpeed Insights
# https://pagespeed.web.dev/analysis?url=https://cambiafx.pe
```

---

## 📊 Verificación Rápida

Después de implementar, verifica:

- [ ] Build sin errores: `npm run build`
- [ ] Headers HTTP: Inspeccionar en Network tab
- [ ] Web Vitals: Console en producción
- [ ] Skip link: Tab en la página
- [ ] Focus visible: Tab por la página

---

## 🎯 Resultados Esperados Inmediatos

Con solo estos cambios deberías ver:

| Métrica | Mejora Esperada |
|---------|-----------------|
| Performance Score | +10-15 puntos |
| Accessibility Score | +5-10 puntos |
| LCP | -20-30% |
| CLS | Reducción notable |

---

## 🚀 Próximos Pasos (Implementación Completa)

Una vez que veas mejoras con el Quick Start:

### Semana 1-2: Performance
1. Implementar Critical CSS
2. Convertir todas las imágenes a WebP
3. Implementar lazy loading en todas las secciones
4. Optimizar JavaScript chunks

### Semana 3: Accesibilidad
1. Actualizar formularios con ARIA
2. Implementar modales accesibles
3. Validar contraste de colores
4. Testear con screen readers

### Referencias:
- 📖 Guía completa: `GUIA_IMPLEMENTACION_MEJORAS.md`
- 📋 Checklist: `CHECKLIST_PERFORMANCE_ACCESSIBILITY.md`
- 💻 Ejemplos: `EJEMPLOS_IMPLEMENTACION.md`

---

## 🐛 Troubleshooting Rápido

### Build falla
```bash
# Limpiar cache
npm run build -- --force
php artisan optimize:clear
```

### Middleware no funciona
- Verificar que esté registrado en `Kernel.php`
- Verificar que el namespace sea correcto
- Limpiar cache: `php artisan config:clear`

### Web Vitals no aparecen en console
- Verificar que estés en modo producción
- Abrir DevTools > Console
- Verificar que `web-vitals` esté instalado

---

## 💡 Tips Pro

1. **Empezar por lo fácil**: Backend primero, luego frontend
2. **Medir antes y después**: Usa PageSpeed Insights
3. **No optimizar todo de una vez**: Implementación gradual
4. **Usar feature flags**: Activar/desactivar sin deployar

---

## ✨ Checklist del Quick Start

- [ ] Dependencias instaladas
- [ ] Middleware registrado
- [ ] Web Vitals en Home.jsx
- [ ] OptimizedImage en hero
- [ ] Skip link agregado
- [ ] Build exitoso
- [ ] Primera auditoría ejecutada

---

**Tiempo total**: ~30 minutos  
**Impacto**: Alto  
**Dificultad**: Baja  

**¡Listo para implementar! 🚀**

---

## 📞 ¿Necesitas más?

- **Plan completo**: `PLAN_MEJORAS_PERFORMANCE_ACCESIBILIDAD.md`
- **Guía detallada**: `GUIA_IMPLEMENTACION_MEJORAS.md`  
- **Ejemplos de código**: `EJEMPLOS_IMPLEMENTACION.md`
- **Resumen ejecutivo**: `RESUMEN_EJECUTIVO.md`

