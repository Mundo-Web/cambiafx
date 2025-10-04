# 🔧 Solución: Tawk.to desaparece en Producción

## 🐛 Problema

**Síntoma**: 
- Tawk.to aparece por 1-2 segundos y luego desaparece
- En local funciona perfectamente
- En producción se desconecta

**Causa Raíz**:
El middleware `PerformanceHeaders` implementado tiene un **Content Security Policy (CSP)** que bloquea dominios necesarios para Tawk.to, Facebook Pixel y Google Analytics.

---

## ✅ Solución Implementada

### 1. **CSP Actualizado** (`app/Http/Middleware/PerformanceHeaders.php`)

**Dominios agregados al CSP:**

**script-src:**
- ✅ `https://www.facebook.com` - Facebook Pixel
- ✅ `https://www.google-analytics.com` - Google Analytics
- ✅ `https://analytics.tiktok.com` - TikTok Pixel
- ✅ `https://googleads.g.doubleclick.net` - Google Ads
- ✅ `https://www.google.com` - Google services

**connect-src:**
- ✅ `https://www.facebook.com` - Facebook privacy sandbox

**font-src:**
- ✅ `https://embed.tawk.to` - Fuentes de Tawk.to

---

### 2. **Service Worker Corregido** (`public/serviceworker.js`)

**Problema anterior:**
```javascript
var filesToCache = [
    '/offline',
    '/css/app.css',  // ❌ No existe
    '/js/app.js',    // ❌ No existe
    '/api/landing_home/media/'  // ❌ URL incompleta
];
```

**Solución:**
```javascript
var filesToCache = []; // Vacío para evitar errores
event.waitUntil(Promise.resolve()); // No cachear en install
```

---

## 🚀 Pasos de Deploy

### En Local (DESARROLLO):

```bash
# 1. Commit
git add .
git commit -m "fix: CSP completo para Tawk.to, FB Pixel, GA + Service Worker"
git push
```

### En Producción:

```bash
# 1. Pull los cambios
git pull

# 2. Limpiar TODOS los caches
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear

# 3. Optimizar (opcional)
php artisan config:cache
php artisan route:cache
```

### En el Navegador del Usuario:

1. **Hard Refresh**: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)

2. **Limpiar Service Worker:**
   - Abrir DevTools (`F12`)
   - Application > Service Workers
   - Click en **"Unregister"**
   - Application > Storage > **"Clear site data"**

3. **Recargar la página** (`F5`)

---

## ✅ Verificación

### Antes (con errores):

```
❌ Refused to connect to 'https://www.facebook.com/privacy_sandbox...'
❌ Refused to load font 'https://embed.tawk.to/.../fonts/...'
❌ Refused to connect to 'https://va.tawk.to/...'
❌ Uncaught TypeError: Failed to execute 'addAll' on 'Cache'
```

### Después (sin errores):

```
✅ Tawk.to carga correctamente
✅ Facebook Pixel funciona
✅ Google Analytics funciona
✅ TikTok Pixel funciona
✅ Sin errores de CSP en consola
✅ Service Worker registra sin errores
```

---

## 🔍 Cómo Verificar que Funciona

### 1. **Abrir DevTools** (`F12`)

### 2. **Console Tab:**

Busca estos mensajes:
```
✅ PWA: Service Worker registered successfully
✅ [Tawk] Widget loaded successfully
```

**NO deberías ver:**
```
❌ Refused to connect to...
❌ Refused to load...
❌ Failed to execute 'addAll'...
```

### 3. **Network Tab:**

Filtra por `tawk.to`:
- ✅ Status: 200 OK
- ✅ Sin errores de CSP

### 4. **Application Tab:**

- Service Workers: ✅ **Activated and running**
- Cache Storage: ✅ Sin errores

### 5. **Widget de Tawk.to:**

- ✅ Aparece en la esquina inferior derecha
- ✅ **NO desaparece después de cargar**
- ✅ Se puede abrir y chatear

---

## 📋 CSP Final Implementado

```php
"default-src 'self'",
"script-src 'self' 'unsafe-inline' 'unsafe-eval' 
    https://checkout.culqi.com 
    https://translate.google.com 
    https://translate.googleapis.com 
    https://translate-pa.googleapis.com 
    https://connect.facebook.net 
    https://www.facebook.com 
    https://embed.tawk.to 
    https://va.tawk.to 
    https://cdn.jsdelivr.net 
    https://www.gstatic.com 
    https://www.google-analytics.com 
    https://analytics.tiktok.com 
    https://googleads.g.doubleclick.net 
    https://www.google.com",
    
"style-src 'self' 'unsafe-inline' 
    https://fonts.googleapis.com 
    https://cdnjs.cloudflare.com 
    https://unpkg.com 
    https://www.gstatic.com 
    https://embed.tawk.to",
    
"font-src 'self' data: 
    https://fonts.gstatic.com 
    https://cdnjs.cloudflare.com 
    https://embed.tawk.to",
    
"connect-src 'self' 
    https://apiluna.cambiafx.pe 
    https://translate.googleapis.com 
    https://translate-pa.googleapis.com 
    https://va.tawk.to 
    wss://embed.tawk.to 
    https://embed.tawk.to 
    https://www.google-analytics.com 
    https://analytics.tiktok.com 
    https://googleads.g.doubleclick.net 
    https://www.google.com 
    https://www.facebook.com",
```

---

## 🔐 Seguridad

**CSP solo se aplica en PRODUCCIÓN:**

```php
if (config('app.env') !== 'production') {
    return; // No CSP en desarrollo
}
```

En **local/desarrollo**: Sin CSP → Vite dev server funciona

En **producción**: CSP activo → Seguridad mejorada

---

## 🐛 Troubleshooting

### Problema: Tawk.to sigue desapareciendo

**Solución:**
1. Verifica que estés en producción: `echo config('app.env')`
2. Limpia cache: `php artisan config:clear`
3. Verifica headers en DevTools > Network > Response Headers
4. Debe aparecer: `Content-Security-Policy: default-src 'self'...`

### Problema: Service Worker sigue dando error

**Solución:**
1. DevTools > Application > Service Workers > **Unregister**
2. DevTools > Application > Storage > **Clear site data**
3. Hard refresh: `Ctrl + Shift + R`
4. Verifica que `serviceworker.js` tenga `filesToCache = []`

### Problema: Facebook Pixel no funciona

**Solución:**
1. Verifica CSP en Network > Headers
2. Debe incluir `https://www.facebook.com` en `connect-src`
3. Debe incluir `https://connect.facebook.net` en `script-src`

---

## 📝 Notas

- **CSP deshabilitado en desarrollo** para permitir Vite dev server
- **Service Worker vacío** para evitar errores de cache
- **Tawk.to carga con delay de 2500ms** (definido en `public.blade.php`)
- **Facebook Pixel carga con delay de 1500ms**

---

## 🎯 Resultado Final

✅ **Tawk.to funciona** en producción (no desaparece)  
✅ **Facebook Pixel funciona**  
✅ **Google Analytics funciona**  
✅ **TikTok Pixel funciona**  
✅ **Sin errores de CSP**  
✅ **Sin errores de Service Worker**  
✅ **Performance Headers activos** en producción

---

**Última actualización**: 2025-10-04  
**Estado**: ✅ RESUELTO
