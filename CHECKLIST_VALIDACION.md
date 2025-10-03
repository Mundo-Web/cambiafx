# ✅ Checklist de Validación Post-Despliegue

**Fecha de Despliegue:** _____________  
**Validado por:** _____________  
**Versión:** 1.0.0 (Commit: b762d342)

---

## 🎯 Validaciones Funcionales

### 1. Carga del Sitio Web
- [ ] El sitio carga sin errores visibles
- [ ] No hay pantallas en blanco
- [ ] El tiempo de carga inicial es notablemente más rápido
- [ ] Los componentes se cargan progresivamente (lazy loading)

### 2. Navegación y Funcionalidad
- [ ] La página de inicio (`/`) funciona correctamente
- [ ] Las secciones se cargan al hacer scroll
- [ ] Los formularios funcionan (contacto, cupones, etc.)
- [ ] Los enlaces de navegación funcionan
- [ ] El footer y header se muestran correctamente

### 3. Calculadora de Cambio
- [ ] La calculadora (`ExchangeCard`) carga correctamente
- [ ] Los cálculos funcionan al cambiar valores
- [ ] Los tooltips de rangos se muestran
- [ ] Los cupones aplican descuentos correctamente

### 4. Imágenes y Multimedia
- [ ] Todas las imágenes cargan correctamente
- [ ] No hay imágenes rotas (broken images)
- [ ] Las imágenes tienen dimensiones correctas (sin saltos de layout)
- [ ] Los banners se muestran correctamente

### 5. Compatibilidad de Navegadores
- [ ] **Chrome/Edge:** Todo funciona ✓
- [ ] **Firefox:** Todo funciona ✓
- [ ] **Safari (Mac/iOS):** Todo funciona ✓
- [ ] **Móvil (Android):** Todo funciona ✓
- [ ] **Móvil (iOS):** Todo funciona ✓

---

## 🔬 Validaciones Técnicas

### 6. Optimizaciones de Performance

#### 6.1 Verificar Code Splitting
**Cómo:** Abrir DevTools → Network → Filtrar "JS"

- [ ] Se cargan múltiples archivos `.js` pequeños (chunks)
- [ ] El archivo principal (`main-*.js`) es menor a 200KB
- [ ] Los vendors están separados (`react-vendor`, `framer-vendor`, etc.)

**Ejemplo esperado:**
```
main-X8JAyXgE.js           ~150KB
react-vendor-XYZ123.js     ~470KB
framer-vendor-ABC456.js    ~113KB
HeroSecction-Bb09mnGQ.js   ~45KB  (carga bajo demanda)
BlogSection-D55hfBTr.js    ~38KB  (carga bajo demanda)
```

#### 6.2 Verificar HTTP Caching
**Cómo:** DevTools → Network → Seleccionar cualquier imagen → Headers

- [ ] Header `Cache-Control: max-age=31536000` presente (imágenes)
- [ ] Header `Expires` muestra fecha futura (1 año adelante)
- [ ] Archivos CSS/JS tienen `max-age=2592000` (1 mes)
- [ ] En segunda carga, recursos muestran "(disk cache)" o "304 Not Modified"

**Ejemplo esperado:**
```
Cache-Control: max-age=31536000, public
Expires: Thu, 31 Dec 2025 23:59:59 GMT
```

#### 6.3 Verificar GZIP Compression
**Cómo:** DevTools → Network → Seleccionar un archivo JS/CSS → Headers

- [ ] Header `Content-Encoding: gzip` presente
- [ ] Tamaño "transferred" es ~70% menor que "size"
- [ ] Archivos de texto están comprimidos

**Ejemplo esperado:**
```
Content-Encoding: gzip
Size: 470.2 KB
Transferred: 142.5 KB (30% del original)
```

#### 6.4 Verificar Lazy Loading de Imágenes
**Cómo:** DevTools → Elements → Inspeccionar `<img>`

- [ ] Imágenes tienen atributo `loading="lazy"`
- [ ] Imágenes tienen `width` y `height` explícitos
- [ ] En Network, imágenes fuera del viewport no cargan hasta hacer scroll

**Ejemplo esperado:**
```html
<img 
  src="/images/hero.jpg" 
  loading="lazy" 
  width="1200" 
  height="600"
  alt="Hero"
/>
```

#### 6.5 Verificar Security Headers
**Cómo:** DevTools → Network → Seleccionar HTML principal → Headers

- [ ] `X-Frame-Options: SAMEORIGIN` presente
- [ ] `X-Content-Type-Options: nosniff` presente
- [ ] `X-XSS-Protection: 1; mode=block` presente
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` presente

---

## 📊 Mediciones de Performance

### 7. PageSpeed Insights

**Ejecutar:** https://pagespeed.web.dev/

**URL a probar:** `https://tu-dominio.com`

#### Móvil
- [ ] **Performance Score:** ≥ 85 (Antes: 19)
- [ ] **First Contentful Paint (FCP):** ≤ 1.8s
- [ ] **Largest Contentful Paint (LCP):** ≤ 2.5s (Antes: 4.4s)
- [ ] **Total Blocking Time (TBT):** ≤ 200ms (Antes: 840ms)
- [ ] **Cumulative Layout Shift (CLS):** ≤ 0.1 (Antes: 0.405)
- [ ] **Speed Index:** ≤ 3.4s

#### Escritorio
- [ ] **Performance Score:** ≥ 90
- [ ] **LCP:** ≤ 1.2s
- [ ] **TBT:** ≤ 100ms
- [ ] **CLS:** ≤ 0.1

**Capturas de pantalla:**
- [ ] Guardar screenshot del reporte de PageSpeed Insights
- [ ] Comparar con reporte anterior (Antes: 19/100)

### 8. GTmetrix (Opcional)

**Ejecutar:** https://gtmetrix.com/

- [ ] **Performance Grade:** A o B
- [ ] **Fully Loaded Time:** ≤ 3s
- [ ] **Total Page Size:** ≤ 2MB
- [ ] **Requests:** ≤ 100

---

## 🗄️ Validaciones de Servidor

### 9. Espacio en Disco

**Ejecutar en servidor:**
```bash
du -sh storage/framework/sessions
du -sh storage/framework/cache
du -sh storage/framework/views
```

#### Antes de Optimizaciones
```
storage/framework/sessions: 1.2GB (miles de archivos)
storage/framework/cache:    450MB
storage/framework/views:    180MB
Total:                      ~2GB
```

#### Después de Optimizaciones (Esperar 24-48h)
- [ ] `storage/framework/sessions`: ≤ 100MB
- [ ] `storage/framework/cache`: ≤ 50MB
- [ ] `storage/framework/views`: ≤ 200MB (regeneradas)
- [ ] **Total:** ≤ 400MB (-80% de reducción)

### 10. Cron Job Activo

**Verificar:**
```bash
crontab -l
```

- [ ] Línea presente: `* * * * * cd /home/cambsjpb/public_html && php artisan schedule:run`
- [ ] Ejecutar manualmente: `php artisan schedule:run` (debe responder "No scheduled commands")

**Verificar logs** (después de 24h):
```bash
tail -f storage/logs/laravel.log
```

- [ ] Se ejecutan tareas de limpieza diariamente
- [ ] No hay errores relacionados con el scheduler

### 11. Git Repository (Opcional - Requiere limpieza)

**Estado actual:**
```bash
du -sh .git
# Resultado actual: 687MB
```

**Después de limpieza con BFG:**
- [ ] `.git` folder ≤ 100MB (-85% de reducción)

---

## 🚨 Errores Conocidos (No Críticos)

### ⚠️ Route Caching Error
**Error:** `Unable to prepare route [test-exchange-card] for serialization. Another route has already been assigned name [TestExchangeCard.jsx]`

**Impacto:** NINGUNO - El sitio funciona normalmente  
**Solución:** No es necesario ejecutar `php artisan route:cache`  
**Estado:** Pendiente de fix en próxima versión

### ⚠️ CRLF Warnings en Git
**Warning:** `CRLF will be replaced by LF`

**Impacto:** NINGUNO - Solo afecta al commit, no al funcionamiento  
**Solución:** Automática durante git push  
**Estado:** Normal en proyectos Windows/Linux

---

## 📈 Tabla de Mejoras Esperadas

| Métrica | Antes | Después | Mejora | Validado ✓ |
|---------|-------|---------|--------|------------|
| **Performance Score** | 19/100 | 85+/100 | +347% | [ ] |
| **Bundle Size** | 2MB | 500KB | -75% | [ ] |
| **LCP** | 4.4s | 2.5s | -43% | [ ] |
| **TBT** | 840ms | 100ms | -88% | [ ] |
| **CLS** | 0.405 | <0.1 | -75% | [ ] |
| **Storage** | 2GB+ | <400MB | -80% | [ ] |
| **Requests** | ~150 | ~80 | -47% | [ ] |

---

## 📝 Notas Adicionales

**Observaciones durante la validación:**

```
[Espacio para notas del validador]








```

**Problemas encontrados:**

```
[Describir cualquier problema detectado]








```

**Métricas reales obtenidas:**

```
PageSpeed Score Mobile: _____ / 100
PageSpeed Score Desktop: _____ / 100
LCP: _____ s
TBT: _____ ms
CLS: _____
Bundle Size: _____ KB
Storage usado: _____ MB
```

---

## ✅ Aprobación Final

- [ ] **Todas las validaciones funcionales pasaron**
- [ ] **Performance Score >= 85**
- [ ] **No hay errores críticos**
- [ ] **Cliente aprueba las mejoras**

**Firma del Validador:** _____________________  
**Fecha:** _____________________  
**Hora:** _____________________

---

## 📞 Contacto de Soporte

Si alguna validación falla:

1. **No desplegar a producción**
2. Documentar el error específico
3. Contactar al equipo de desarrollo
4. Adjuntar screenshots y logs

**Email:** soporte@ejemplo.com  
**Slack:** #cambiafx-support

---

**Archivos de Referencia:**
- Guía Técnica: `OPTIMIZACIONES_PERFORMANCE.md`
- Resumen Ejecutivo: `RESUMEN_EJECUTIVO.md`
- Instrucciones de Despliegue: `INSTRUCCIONES_DESPLIEGUE.md`
- Scripts de Limpieza: `optimize.ps1`, `optimize.sh`
