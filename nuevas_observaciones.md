# 🔍 Correcciones SEO - `cambiafx.pe`

> 📄 **Documento interno para el equipo de TI / Desarrollo Frontend**  
> 📅 **Fecha de auditoría:** 24 de abril de 2026  
> 🚨 **Prioridad:** ALTA (Correcciones críticas requeridas esta semana)  
> 🌐 **Dominio auditado:** `cambiafx.pe`

---

## 📋 Índice

1. [Resumen Ejecutivo](#-resumen-ejecutivo)
2. [🔴 Problemas Críticos (Resolver esta semana)](#-problemas-críticos-resolver-esta-semana)
3. [🟠 Problemas Importantes (Implementar este mes)](#-problemas-importantes-implementar-este-mes)
4. [🟢 Mejoras (Próximo Sprint: 2–4 semanas)](#-mejoras-próximo-sprint-2-4-semanas)
5. [✅ Checklist de Verificación Post-Deploy](#-checklist-de-verificación-post-deploy)
6. [🛠️ Herramientas de Referencia](#-herramientas-de-referencia)
7. [📝 Notas Finales](#-notas-finales)

---

## 📊 Resumen Ejecutivo

La auditoría identificó **5 problemas críticos**, **4 importantes** y **3 mejoras**. Los críticos bloquean la indexación y el posicionamiento correcto en Google. Se estima que las correcciones críticas requieren **~1.5 horas de desarrollo frontend**. El impacto en Google Search Console será visible en **2–4 semanas** tras el deploy.

| #    | Problema                          | Severidad     | Archivo/Template    | Tiempo Est. |
| ---- | --------------------------------- | ------------- | ------------------- | ----------- |
| C-01 | H1 usado por banner promocional   | ✅ COMPLETADO | Todos los templates | 30 min      |
| C-02 | OG Image con URL relativa         | ✅ COMPLETADO | `head` template     | 15 min      |
| C-03 | Schema Organization con errores   | ✅ COMPLETADO | `head` / JSON-LD    | 20 min      |
| C-04 | Viewport bloquea zoom             | ✅ COMPLETADO | `head` template     | 5 min       |
| C-05 | Title y meta del blog genéricos   | ✅ COMPLETADO | CMS / Blog template | 10 min      |
| I-01 | Sin Schema NewsArticle            | ✅ COMPLETADO | Artículo template   | 2–3 h       |
| I-02 | Sin autor/fecha visible           | ✅ COMPLETADO | Artículo template   | 2 h         |
| I-03 | Typo en slug de artículo          | ✅ COMPLETADO | CMS / Servidor      | 30 min      |
| I-04 | Sin landing pages transaccionales | 🟠 IMPORTANTE | Nuevas páginas      | 1 semana    |
| M-01 | Sin Schema FAQPage                | 🟢 MEJORA     | Home / Artículos    | 1 h         |
| M-02 | Sin breadcrumbs                   | 🟢 MEJORA     | Artículo template   | 1 h         |
| M-03 | Interlinking débil                | 🟢 MEJORA     | Contenido / CMS     | 1 h         |

---

## 🔴 Problemas Críticos (Resolver esta semana)

### ✅ C-01 · H1 usado por el banner promocional en todos los templates

**Problema:** El `<h1>` está asignado al ticker animado del banner. Se repite 3 veces en el DOM. El H1 real del contenido queda en 4ta posición. Google interpreta que el sitio trata sobre un sorteo.
**Solución:** Cambiar el banner a `<p>` o `<span>` y asignar un `<h1>` único y semántico por template.

```html
<!-- ELIMINAR en el banner: -->
<h1>CAMBIAFX | Cambia dolares y entra al sorteo...</h1>

<!-- REEMPLAZAR por: -->
<p aria-label="Promocion activa" role="marquee">CAMBIAFX | Cambia dolares...</p>

<!-- H1 en HOME template: -->
<h1>Cambia dolares y soles online en Peru</h1>

<!-- H1 en BLOG listado template: -->
<h1>Blog sobre tipo de cambio y finanzas en Peru</h1>

<!-- H1 en ARTICULO template (dinámico): -->
<h1>{{ post.title }}</h1>
```

### ✅ C-02 · OG Image con URL relativa

**Problema:** `og:image` usa rutas relativas. Facebook, WhatsApp, LinkedIn y Twitter no renderizan la previsualización.
**Solución:** Convertir a URLs absolutas en los templates de HOME y BLOG.

```html
<!-- HOME template — ANTES (roto): -->
<meta property="og:image" content="/assets/img/og-home.jpg" />

<!-- HOME template — DESPUÉS (correcto): -->
<meta
    property="og:image"
    content="https://cambiafx.pe/assets/img/og-home.jpg"
/>

<!-- BLOG template — ANTES (roto): -->
<meta property="og:image" content="/assets/img/og-blog.jpg" />

<!-- BLOG template — DESPUÉS (correcto): -->
<meta
    property="og:image"
    content="https://cambiafx.pe/assets/img/og-blog.jpg"
/>
```

### ✅ C-03 · Schema Organization con URL del logo incorrecta y `sameAs` vacío

**Problema:** Logo apunta a `.com` sin `.pe`, `sameAs` está vacío, y `url` usa `www.` (inconsistente con canonical). Debilita el Knowledge Panel.
**Solución:** Reemplazar el JSON-LD global y completar perfiles sociales.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Cambia FX",
  "url": "https://cambiafx.pe/",
  "logo": "https://cambiafx.pe/assets/img/icon-192x192.png",
  "telephone": "+51 922 985 423",
  "email": "hola@cambiafx.pe",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Javier Prado Este N.560 Of. 2302",
    "addressLocality": "San Isidro",
    "addressRegion": "Lima",
    "addressCountry": "PE"
  },
  "sameAs": [
    "https://www.facebook.com/CambiaFX",
    "https://www.instagram.com/cambiafx",
    "https://pe.linkedin.com/company/cambia-fx"
  ]
}
</script>
```

### ✅ C-04 · Viewport bloquea zoom (`user-scalable=no`)

**Problema:** Penaliza Page Experience (Core Web Vitals), baja score de accesibilidad y reduce ranking mobile.
**Solución:** Eliminar `maximum-scale` y `user-scalable`. Corregir roturas visuales con CSS si es necesario.

```html
<!-- ANTES (problemático): -->
<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>

<!-- DESPUÉS (correcto): -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### ✅ C-05 · Title tag y meta description del blog son genéricos

**Problema:** Title de solo 15 caracteres. Meta description de 86 caracteres sin keywords relevantes. Reduce CTR drásticamente.
**Solución:** Actualizar title, description y OG tags en CMS/template.

```html
<!-- TITLE TAG (56 caracteres): -->
<title>Blog sobre tipo de cambio y economia en Peru | Cambia FX</title>

<!-- META DESCRIPTION (151 caracteres): -->
<meta
    name="description"
    content="Noticias del dolar en Peru, analisis del tipo de cambio y consejos financieros actualizados. Por Cambia FX, casa de cambio digital registrada en la SBS."
/>

<!-- OG TAGS del blog (actualizar también): -->
<meta
    property="og:title"
    content="Blog sobre tipo de cambio en Peru | Cambia FX"
/>
<meta
    property="og:description"
    content="Noticias del dolar, analisis del tipo de cambio y consejos financieros. Cambia FX, SBS."
/>
```

---

## 🟠 Problemas Importantes (Implementar este mes)

### ✅ I-01 · Sin Schema NewsArticle en posts del blog

**Problema:** Solo existe Organization global. Sin `NewsArticle`/`Article`, Google no muestra fecha, autor, imagen destacada ni rich results.
**Solución:** Agregar JSON-LD dinámico en el `<head>` del template de artículo. Validar cada URL.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "{{ post.title }}",
  "description": "{{ post.excerpt }}",
  "url": "https://cambiafx.pe/blog/{{ post.slug }}",
  "datePublished": "{{ post.date_published }}",
  "dateModified": "{{ post.date_modified }}",
  "inLanguage": "es-PE",
  "image": {
    "@type": "ImageObject",
    "url": "{{ post.featured_image_url }}",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Person",
    "name": "{{ post.author.name }}",
    "url": "https://cambiafx.pe/autor/{{ post.author.slug }}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Cambia FX",
    "logo": {
      "@type": "ImageObject",
      "url": "https://cambiafx.pe/assets/img/icon-192x192.png"
    }
  }
}
</script>
```

### ✅ I-02 · Sin autor visible ni fecha de publicación (E-E-A-T)

**Problema:** Contenido YMYL financiero sin autor ni fecha visibles. Penaliza la percepción de calidad.
**Solución:** Insertar bloque HTML al inicio del artículo y usar `<time datetime>`. Crear página `/autor/nombre`.

```html
<!-- Bloque autor — pegar al inicio del artículo: -->
<div class="article-author">
    <span class="article-category">{{ post.category }}</span>
    <div class="author-row">
        <div class="author-avatar">{{ post.author.initials }}</div>
        <div class="author-info">
            <a href="/autor/{{ post.author.slug }}" class="author-name">
                {{ post.author.name }}
            </a>
            <p class="author-role">{{ post.author.job_title }}</p>
            <p class="author-dates">
                Publicado el
                <time datetime="{{ post.date_published }}">
                    {{ post.date_published_formatted }}
                </time>
            </p>
        </div>
    </div>
</div>
```

### ✅ I-03 · Typo en slug de artículo (`sgnifica` → `significa`)

**Problema:** Slug indexado con error ortográfico. Afecta credibilidad de marca.
**Solución:** Crear nuevo slug, aplicar redirect 301, actualizar canonical. **NO eliminar sin redirect**.

```nginx
# En nginx (agregar en bloque server):
rewrite ^/blog/la-caida-del-dolar-en-peru-y-el-mundo-que-sgnifica /blog/la-caida-del-dolar-en-peru-y-el-mundo-que-significa permanent;
```

```apache
# En .htaccess (si usa Apache):
Redirect 301 /blog/la-caida-del-dolar-en-peru-y-el-mundo-que-sgnifica https://cambiafx.pe/blog/la-caida-del-dolar-en-peru-y-el-mundo-que-significa
```

### I-04 · Sin landing pages para keywords transaccionales

**Problema:** No hay URLs dedicadas para keywords de alta intención de compra. Competidores las capturan.
**Solución:** Crear 5 páginas nuevas. Cada una debe tener: H1 exacto, +400 palabras, cotizador embebido, Schema FAQPage.
| URL Sugerida | H1 Exacto |
|---|---|
| `/casa-de-cambio-digital` | `<h1>Casa de cambio digital en Peru</h1>` |
| `/comprar-dolares-online` | `<h1>Comprar dolares online en Peru</h1>` |
| `/vender-dolares-online` | `<h1>Vender dolares online en Peru</h1>` |
| `/cambio-dolares-empresas` | `<h1>Cambio de dolares para empresas en Peru</h1>` |
| `/tipo-de-cambio-hoy-peru` | `<h1>Tipo de cambio hoy en Peru</h1>` |

---

## 🟢 Mejoras (Próximo Sprint: 2–4 semanas)

### M-01 · Sin Schema FAQPage

**Problema:** Sin `FAQPage`. Pierde oportunidades de rich snippets (+20-30% CTR).
**Solución:** Agregar sección FAQ visible en Home/Artículos + JSON-LD.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Es seguro cambiar dolares online en Peru?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Si. Cambia FX esta registrado en la SBS y opera bajo normativa vigente..."
      }
    }
  ]
}
</script>
```

### M-02 · Sin breadcrumbs

**Problema:** Sin navegación jerárquica ni `BreadcrumbList`. Afecta UX y distribución de PageRank.
**Solución:** Agregar HTML + JSON-LD en template de artículo.

```html
<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li><a href="/">Inicio</a></li>
        <li><a href="/blog">Blog</a></li>
        <li>
            <a href="/blog/categoria/{{ post.category_slug }}"
                >{{ post.category }}</a
            >
        </li>
        <li>{{ post.title }}</li>
    </ol>
</nav>
```

### M-03 · Interlinking débil

**Problema:** Solo hay "posts relacionados" al final. Sin enlaces contextuales en el cuerpo.
**Solución:** Incluir 2–3 enlaces internos contextuales por artículo con anchor text descriptivo.

```html
<!-- Ejemplo correcto en el texto: -->
...el tipo de cambio se ve afectado por factores macroeconómicos como
<a href="/blog/como-funciona-el-tipo-de-cambio-en-peru"
    >como funciona el tipo de cambio en Peru</a
>.
```

> 🎯 **Meta:** Cada artículo debe tener al menos 2 enlaces internos dentro del cuerpo.

---

## ✅ Checklist de Verificación Post-Deploy

| Tarea                      | Herramienta / Comando de Verificación                                              | Cuándo      |
| -------------------------- | ---------------------------------------------------------------------------------- | ----------- |
| `C-01` H1 corregido        | Chrome DevTools > Elements > buscar `<h1` → debe haber exactamente 1 por página    | Inmediato   |
| `C-02` OG Image            | `developers.facebook.com/tools/debug/` → pegar URL home/blog → debe mostrar imagen | Inmediato   |
| `C-03` Schema Organization | `search.google.com/test/rich-results` → URL home → Organization sin errores        | Inmediato   |
| `C-04` Viewport            | Chrome DevTools > Lighthouse > Mobile → sin advertencia `user-scalable`            | Inmediato   |
| `C-05` Title blog          | Ver source del blog → title tag con nuevo texto                                    | Inmediato   |
| `I-01` NewsArticle         | `search.google.com/test/rich-results` → URL artículo → NewsArticle válido          | 3–7 días    |
| `I-02` Autor/Fecha         | Ver artículo en sitio → bloque autor visible debajo del título                     | Inmediato   |
| `I-03` Redirect 301        | `curl -I https://cambiafx.pe/blog/...sgnifica...` → HTTP 301 al slug correcto      | Inmediato   |
| `I-04` Landings            | Buscar en Google: `"cambiafx.pe casa de cambio digital"` → nueva página indexada   | 2–4 semanas |
| Todas                      | Google Search Console > Cobertura → sin errores nuevos de indexación               | 2–4 semanas |

---

## 🛠️ Herramientas de Referencia

- 🧪 Validación Schema: [search.google.com/test/rich-results](https://search.google.com/test/rich-results) | [validator.schema.org](https://validator.schema.org)
- 🔍 Depuración OG/Redes: [developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/)
- 📊 Rendimiento & UX: [pagespeed.web.dev](https://pagespeed.web.dev/)
- 🌐 Indexación & Cobertura: [Google Search Console](https://search.google.com/search-console)

---

## 📝 Notas Finales

- ✅ Este documento es **confidencial** y de uso interno para el área de TI / Desarrollo Frontend.
- 📩 Para dudas técnicas o alineación de prioridades, contactar al **Área de Marketing / SEO**.
- 🔄 Tras cada deploy, ejecutar el checklist y solicitar reindexación en Search Console si aplica.
- 📅 Impacto estimado en métricas de Google: **visible en 2–4 semanas** tras implementación de críticos.

---

_Generado a partir del Diagnóstico SEO Oficial de `cambiafx.pe` · Abril 2026_
