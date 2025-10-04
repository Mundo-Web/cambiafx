# Checklist de Validación de Performance y Accesibilidad

## 📊 Performance Metrics

### Core Web Vitals
- [ ] **LCP (Largest Contentful Paint)** ≤ 2.5s
  - [ ] Desktop: _____ s
  - [ ] Mobile: _____ s
  - [ ] Elemento LCP identificado: _____
  - [ ] Imagen optimizada (WebP/AVIF): Sí/No
  - [ ] Preload aplicado: Sí/No

- [ ] **CLS (Cumulative Layout Shift)** ≤ 0.1
  - [ ] Desktop: _____ 
  - [ ] Mobile: _____
  - [ ] Imágenes con width/height: Sí/No
  - [ ] Fuentes con font-display: swap: Sí/No
  - [ ] Espacios reservados para ads/banners: Sí/No

- [ ] **INP (Interaction to Next Paint)** ≤ 200ms
  - [ ] Desktop: _____ ms
  - [ ] Mobile: _____ ms
  - [ ] Event listeners optimizados: Sí/No
  - [ ] Tareas largas divididas: Sí/No

### Otros Indicadores
- [ ] **FCP (First Contentful Paint)** ≤ 1.8s
  - [ ] Desktop: _____ s
  - [ ] Mobile: _____ s

- [ ] **TTFB (Time to First Byte)** ≤ 0.8s
  - [ ] Desktop: _____ s
  - [ ] Mobile: _____ s

- [ ] **Speed Index** ≤ 3.0s
  - [ ] Desktop: _____ s
  - [ ] Mobile: _____ s

### PageSpeed Scores
- [ ] **Desktop Performance** ≥ 90
  - [ ] Score actual: _____
  - [ ] Objetivo alcanzado: Sí/No

- [ ] **Mobile Performance** ≥ 80
  - [ ] Score actual: _____
  - [ ] Objetivo alcanzado: Sí/No

---

## ♿ Accessibility

### WCAG 2.1 Level AA
- [ ] **Contraste de Colores**
  - [ ] Texto normal: ratio ≥ 4.5:1
  - [ ] Texto grande: ratio ≥ 3:1
  - [ ] Elementos UI: ratio ≥ 3:1
  - [ ] Herramienta usada: _____

- [ ] **Navegación por Teclado**
  - [ ] Todos los elementos interactivos accesibles
  - [ ] Focus visible en todos los elementos
  - [ ] Sin keyboard traps
  - [ ] Orden de tabulación lógico

- [ ] **Formularios**
  - [ ] Todos los inputs tienen labels asociados
  - [ ] Mensajes de error descriptivos
  - [ ] aria-required en campos obligatorios
  - [ ] aria-invalid en campos con error
  - [ ] aria-describedby para ayuda contextual

- [ ] **Estructura Semántica**
  - [ ] HTML5 landmarks (<main>, <nav>, <header>, <footer>)
  - [ ] Headings jerárquicos (h1-h6)
  - [ ] Listas para contenido listado
  - [ ] Tables solo para datos tabulares

- [ ] **Imágenes**
  - [ ] Alt text descriptivo en imágenes informativas
  - [ ] alt="" en imágenes decorativas
  - [ ] Textos complejos no en imágenes
  - [ ] SVG con title/desc cuando es necesario

- [ ] **ARIA**
  - [ ] Roles apropiados (dialog, navigation, etc.)
  - [ ] aria-label en elementos sin texto visible
  - [ ] aria-live para contenido dinámico
  - [ ] aria-expanded en elementos expandibles
  - [ ] aria-current en navegación activa

- [ ] **Skip Links**
  - [ ] "Saltar al contenido principal" implementado
  - [ ] Visible al recibir foco
  - [ ] Funcional con teclado

### Lighthouse Accessibility
- [ ] **Score** = 100
  - [ ] Score actual: _____
  - [ ] Issues pendientes: _____

### Screen Readers
- [ ] **Testeo con NVDA/JAWS (Windows)**
  - [ ] Navegación fluida
  - [ ] Contenido comprensible
  - [ ] Anuncios de cambios

- [ ] **Testeo con VoiceOver (Mac/iOS)**
  - [ ] Navegación fluida
  - [ ] Gestos funcionan correctamente

---

## 🚀 Optimizaciones Implementadas

### Backend
- [ ] Middleware de Performance Headers instalado
- [ ] Cache Redis configurado
- [ ] Consultas DB optimizadas (eager loading)
- [ ] Compresión Gzip/Brotli habilitada
- [ ] Cache-Control headers correctos
- [ ] ETags implementados

### CDN
- [ ] CDN configurado y activo
- [ ] HTTP/2 o HTTP/3 habilitado
- [ ] Preconnect a dominios críticos
- [ ] DNS prefetch a terceros

### CSS
- [ ] Critical CSS extraído e inline
- [ ] CSS no usado eliminado
- [ ] Minificación habilitada
- [ ] Font-display: swap en fuentes
- [ ] PostCSS optimizaciones

### JavaScript
- [ ] Code splitting implementado
- [ ] Lazy loading de componentes
- [ ] Tree shaking activo
- [ ] Minificación Terser
- [ ] Console/debugger removidos en prod
- [ ] Source maps solo en dev

### Imágenes
- [ ] Formato WebP/AVIF
- [ ] Dimensiones especificadas (width/height)
- [ ] Lazy loading (loading="lazy")
- [ ] Srcset y sizes implementados
- [ ] Compresión optimizada
- [ ] Componente OptimizedImage usado

### Fuentes
- [ ] Preload de fuentes críticas
- [ ] WOFF2 formato usado
- [ ] font-display: swap
- [ ] Subset de caracteres si aplica
- [ ] Self-hosted vs CDN evaluado

### Third-Party Scripts
- [ ] Carga diferida (defer/async)
- [ ] requestIdleCallback usado
- [ ] Scripts no críticos pospuestos
- [ ] Impacto medido y minimizado

---

## 🧪 Testing

### Herramientas Usadas
- [ ] PageSpeed Insights
- [ ] Lighthouse (Chrome DevTools)
- [ ] WebPageTest
- [ ] GTmetrix
- [ ] Chrome DevTools Performance
- [ ] Wave (Accesibilidad)
- [ ] axe DevTools

### Dispositivos Reales
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Desktop (Chrome)
- [ ] Desktop (Firefox)
- [ ] Desktop (Safari)
- [ ] Tablet

### Conexiones
- [ ] 4G
- [ ] 3G
- [ ] Slow 3G
- [ ] WiFi rápido

---

## 📝 Documentación

- [ ] README actualizado con optimizaciones
- [ ] Guía de mantenimiento creada
- [ ] Feature flags documentados
- [ ] Métricas baseline registradas
- [ ] Plan de rollback definido

---

## 🎯 Objetivos Finales

### Mínimos Aceptables (Must Have)
- ✅ LCP < 2.5s
- ✅ CLS < 0.1
- ✅ INP < 200ms
- ✅ Accessibility Score = 100
- ✅ Desktop Performance > 90

### Objetivos Stretch (Nice to Have)
- 🎯 LCP < 2.0s
- 🎯 CLS < 0.05
- 🎯 INP < 100ms
- 🎯 Mobile Performance > 85
- 🎯 PWA Score = 100

---

## ✅ Sign-Off

- [ ] **Desarrollador**: _____________________ Fecha: _____
- [ ] **QA**: _____________________ Fecha: _____
- [ ] **PM**: _____________________ Fecha: _____
- [ ] **Cliente**: _____________________ Fecha: _____

---

**Notas adicionales:**
_________________________________________
_________________________________________
_________________________________________
