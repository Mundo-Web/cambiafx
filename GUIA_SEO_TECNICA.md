# Guía Técnica de Implementación SEO - CambiaFX

Esta guía detalla el sistema de SEO y Schemas implementado en el proyecto CambiaFX para que pueda ser replicado o mantenido por otros desarrolladores.

## 1. Estructura de Datos (Base de Datos)

El sistema utiliza la tabla `generals` para almacenar configuraciones globales mediante correlativos.

### Correlativos Principales:
- **SEO Básico:** `seo_title`, `seo_description`, `seo_keywords`.
- **Empresa (Advanced SEO):** `company_name`, `company_description`, `company_logo`, `company_url`, `company_phone`, `company_email`, `company_address`.
- **Geográficos (Schema.org):** `company_locality`, `company_region`, `company_country`.
- **Redes Sociales:** `twitter_site`, `facebook_page`, `instagram_profile`, `linkedin_profile`.
- **Imágenes por Defecto:** `og_image_default`, `twitter_image_default`.
- **Verificación:** `google_site_verification`, `bing_site_verification`.

---

## 2. Panel de Administración (React)

Ubicación: `resources/js/Admin/Generals.jsx`

El panel permite gestionar todos estos campos de forma centralizada. Utiliza `GeneralsRest` para persistir los datos.

```javascript
// Ejemplo de campos en Generals.jsx
<InputFormGroup
    label="Titulo - SEO"
    value={formData.seoTitle}
    onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
/>

<InputFormGroup
    label="Nombre de la Empresa"
    value={formData.companyName}
    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
/>
```

---

## 3. Lógica del Backend (Helper)

Ubicación: `app/Helpers/SeoHelper.php`

Esta clase es el núcleo del sistema. Maneja la obtención de datos, cache y generación de estructuras.

### Métodos Clave:
- `getSeoData()`: Obtiene todos los correlativos SEO y los cachea por 1 hora.
- `getOpenGraphTags()`: Genera los metadatos para Facebook/LinkedIn.
- `getTwitterCardTags()`: Genera los metadatos para Twitter.
- `getJsonLD($type)`: Genera el esquema `Organization` por defecto.
- `getNewsArticleSchema($article)`: Genera el esquema para posts del blog.

```php
// app/Helpers/SeoHelper.php
public static function getJsonLD($type = 'Organization') {
    $seoData = self::getSeoData();
    if ($type === 'Organization') {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => $seoData['company_name'] ?? 'Cambia FX',
            'url' => $seoData['company_url'] ?? url('/'),
            // ... otros campos
        ];
    }
}
```

---

## 4. Integración en el Frontend

### Componente Blade
Ubicación: `resources/views/components/seo-meta-tags.blade.php`

Este componente se encarga de imprimir los tags en el HTML.

```blade
@php
    $seoData = App\Helpers\SeoHelper::getSeoData();
    $jsonLD = App\Helpers\SeoHelper::getJsonLD($schemaType ?? 'Organization');
@endphp

<title>{{ $title ?? $seoData['seo_title'] }}</title>
<meta name="description" content="{{ $description ?? $seoData['seo_description'] }}" />

<!-- JSON-LD -->
@if(!empty($jsonLD))
<script type="application/ld+json">
    {!! json_encode($jsonLD, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
@endif
```

### Layout Principal
Ubicación: `resources/views/public.blade.php`

Se incluye el componente en el `<head>`:

```blade
<head>
    @include('components.seo-meta-tags', [
        'title' => $seoTitle ?? null,
        'description' => $seoDescription ?? null,
        'schemaType' => $schemaType ?? 'Organization'
    ])
</head>
```

---

## 5. Implementación en Controladores

Para personalizar el SEO en cualquier ruta, simplemente pasa las variables correspondientes al renderizar la vista con Inertia o Blade.

```php
public function index()
{
    return Inertia::render('Home', [
        'seoTitle' => 'Inicio | Casa de Cambio Online',
        'seoDescription' => 'Cambia tus dólares al mejor precio con CambiaFX.',
        'schemaType' => 'Organization'
    ]);
}
```

---

## 6. Verificación y Herramientas

1.  **Sitemap:** Se genera en `/sitemap.xml`.
2.  **Robots:** Configurado en `/robots.txt`.
3.  **Validador de Schemas:** Utilizar [Schema Markup Validator](https://validator.schema.org/).
4.  **Facebook Debugger:** Utilizar [Sharing Debugger](https://developers.facebook.com/tools/debug/).
