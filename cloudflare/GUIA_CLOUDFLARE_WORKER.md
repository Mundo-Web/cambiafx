# 📘 Guía Paso a Paso: Despliegue del Cloudflare Worker (100% Gratuito - Sin Prerender.io)

Esta guía explica detalladamente cómo configurar el Worker en Cloudflare para resolver:
1. **Tarea A2 (Prioritaria):** Redirección automática permanente 301 de `www.cambiafx.pe` hacia `cambiafx.pe` (Canónica SEO).
2. **Tarea A1 (SEO & IA):** Optimización y entrega directa de metadatos, OpenGraph y JSON-LD desde Laravel con cabeceras Edge.

> **💡 NOTA IMPORTANTE SOBRE PRERENDER:**
> **No es necesario pagar ni configurar Prerender.io ni ningún servicio externo.**
> - Laravel ya genera en el HTML inicial (`public.blade.php`) todas las etiquetas `<title>`, `<meta>`, OpenGraph (para WhatsApp/Facebook) y esquemas estructurados Schema.org JSON-LD (`Organization`, `FinancialService`, `FAQPage`, `BreadcrumbList`).
> - Los bots modernos (Googlebot, Bingbot, LLMs) ejecutan JavaScript o leen los archivos de IA dedicados (`https://cambiafx.pe/llms.txt`).
> - **Costo:** **$0.00** (Usa el plan gratuito nativo de Cloudflare).

---

## 🛠️ Paso 1: Crear el Worker en Cloudflare

1. Inicia sesión en [dash.cloudflare.com](https://dash.cloudflare.com/).
2. En el menú lateral izquierdo principal, haz clic en **Compute (Workers & Pages)** o **Workers y Pages**.
3. Haz clic en el botón azul **"Create application"** (o *"Crear aplicación"*).
4. Selecciona la pestaña **"Workers"** y haz clic en **"Create Worker"**.
5. Asígnale un nombre descriptivo, por ejemplo:
   `cambiafx-redirect-worker`
6. Haz clic en **"Deploy"** (Desplegar).

---

## 💻 Paso 2: Pegar el Código del Worker

1. Una vez desplegado el worker básico, haz clic en el botón **"Edit code"** (Editar código).
2. Verás un editor de código en el navegador (`worker.js`).
3. Borra todo el código que viene por defecto.
4. Abre el archivo local **[`cloudflare/worker.js`](./worker.js)**, copia todo su contenido y pégalo en el editor de Cloudflare.
5. Haz clic en el botón superior derecho **"Deploy"** (o *"Save and Deploy"*).

---

## 🔑 Paso 3: Variables de Entorno (¡NO SE REQUIEREN!)

✨ **¡Paso omitido por completo!**
El código actual de [`worker.js`](./worker.js) ya no requiere `PRERENDER_TOKEN` ni ninguna configuración externa de pago. Puedes saltar directamente al **Paso 4**.

---

## 🌐 Paso 4: Enlazar el Worker al Dominio (`cambiafx.pe`)

Ahora debemos hacer que el Worker intercepte el tráfico de la web:

1. En el menú de Cloudflare, ve a la sección **Websites** (Sitios web) y selecciona el dominio **`cambiafx.pe`**.
2. En el menú lateral del dominio, ve a **Workers Routes** (Rutas de Workers).
3. Haz clic en **"Add route"** (Añadir ruta).
4. Agrega las siguientes 2 rutas:

   * **Ruta 1 (Versión www para redirección 301):**
     * **Route:** `www.cambiafx.pe/*`
     * **Worker:** Selecciona `cambiafx-redirect-worker`
     * Haz clic en **Save**.

   * **Ruta 2 (Dominio principal para cabeceras optimizadas):**
     * **Route:** `cambiafx.pe/*`
     * **Worker:** Selecciona `cambiafx-redirect-worker`
     * Haz clic en **Save**.

---

## 🧪 Paso 5: Verificación y Pruebas

Para comprobar que todo está funcionando perfectamente, ejecuta estos comandos en tu terminal:

### 1. Probar la Redirección 301 de www:
```bash
curl -I https://www.cambiafx.pe/
```
* **Resultado esperado:**
  `HTTP/1.1 301 Moved Permanently`  
  `Location: https://cambiafx.pe/`

### 2. Probar como Usuario Normal:
```bash
curl -I https://cambiafx.pe/
```
* **Resultado esperado:** Cabeceras normales del servidor con `X-Edge-Server: Cloudflare-CambiaFX`.

---

## 🚀 Alternativa sin Worker (En 30 segundos vía Redirect Rules)

Si prefieres no usar un Worker para la redirección 301:
1. En Cloudflare, ve a **cambiafx.pe** ➔ **Rules** (Reglas) ➔ **Redirect Rules**.
2. Haz clic en **Create rule**.
3. **Nombre:** Redirección www a non-www
4. **Condición:** Si `Hostname equals www.cambiafx.pe`
5. **Tipo de redirección:** Dynamic o Static:
   * **URL:** `concat("https://cambiafx.pe", http.request.uri.path)`
   * **Status code:** 301 (Permanent Redirect)
   * **Preserve query string:** Activado.
6. Haz clic en **Deploy**.
