# 📘 Guía Paso a Paso: Despliegue del Cloudflare Worker (Prerender + 301)

Esta guía explica detalladamente cómo configurar el Worker en Cloudflare para resolver:
1. **Tarea A1:** Servir HTML completo a bots e IAs (Googlebot, GPTBot, Perplexity, etc.) con caché de 24h.
2. **Tarea A2:** Redirección automática permanente 301 de `www.cambiafx.pe` hacia `cambiafx.pe`.

---

## 🛠️ Paso 1: Crear el Worker en Cloudflare

1. Inicia sesión en [dash.cloudflare.com](https://dash.cloudflare.com/).
2. En el menú lateral izquierdo principal, haz clic en **Compute (Workers & Pages)** o **Workers y Pages**.
3. Haz clic en el botón azul **"Create application"** (o *"Crear aplicación"*).
4. Selecciona la pestaña **"Workers"** y haz clic en **"Create Worker"**.
5. Asígnale un nombre descriptivo, por ejemplo:
   `cambiafx-prerender-worker`
6. Haz clic en **"Deploy"** (Desplegar).

---

## 💻 Paso 2: Pegar el Código del Worker

1. Una vez desplegado el worker básico, haz clic en el botón **"Edit code"** (Editar código).
2. Verás un editor de código en el navegador (`worker.js`).
3. Borra todo el código que viene por defecto.
4. Abre el archivo local **[`cloudflare/worker.js`](./worker.js)**, copia todo su contenido y pégalo en el editor de Cloudflare.
5. Haz clic en el botón superior derecho **"Deploy"** (o *"Save and Deploy"*).

---

## 🔑 Paso 3: Configurar Variables de Entorno (Token de Prerender)

Para que el worker pueda renderizar el JavaScript en un HTML completo, se utiliza un servicio de prerender (el estándar es **Prerender.io**):

1. Si el cliente tiene cuenta en [Prerender.io](https://prerender.io/) (o crea una gratuita con su correo corporativo):
   - Ve a su dashboard de Prerender.io y copia el **Token** que aparece en pantalla.
2. En el dashboard de Cloudflare, ve a la configuración de tu Worker:
   * **Settings** (Configuración) ➔ **Variables and Secrets** (Variables y Secretos).
   * Haz clic en **"Add"** (Añadir variable o secreto).
   * **Nombre:** `PRERENDER_TOKEN`
   * **Valor:** *(Pega el token de Prerender.io)*
   * Tipo: Selecciona **Secret** (Encriptado).
   * Haz clic en **Save and Deploy**.

*(Nota: Si van a usar un Rendertron propio o contenedor propio, pueden añadir la variable `PRERENDER_SERVICE_URL` con la URL de su servidor).*

---

## 🌐 Paso 4: Enlazar el Worker al Dominio (`cambiafx.pe`)

Ahora debemos hacer que el Worker intercepte el tráfico de la web:

1. En el menú de Cloudflare, ve a la sección **Websites** (Sitios web) y selecciona el dominio **`cambiafx.pe`**.
2. En el menú lateral del dominio, ve a **Workers Routes** (Rutas de Workers).
3. Haz clic en **"Add route"** (Añadir ruta).
4. Agrega las siguientes 2 rutas:

   * **Ruta 1 (Dominio principal y subrutas):**
     * **Route:** `cambiafx.pe/*`
     * **Worker:** Selecciona `cambiafx-prerender-worker`
     * Haz clic en **Save**.

   * **Ruta 2 (Versión www para redirección 301):**
     * **Route:** `www.cambiafx.pe/*`
     * **Worker:** Selecciona `cambiafx-prerender-worker`
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

### 2. Probar como Usuario Normal (debe recibir la SPA rápida sin prerender):
```bash
curl -I https://cambiafx.pe/
```
* **Resultado esperado:** Cabeceras normales del servidor sin `X-Served-By: Cloudflare-Worker-Prerender`.

### 3. Probar como Bot de Google o IA (debe recibir HTML renderizado completo con <h1> y textos):
```bash
curl -A "Googlebot" -s -L https://cambiafx.pe/ | grep -i "<h1"
curl -A "GPTBot" -s -L https://cambiafx.pe/tipo-de-cambio-hoy | grep -i "compra"
```
* **Resultado esperado:** Retorna el HTML con contenido real y la cabecera `X-Served-By: Cloudflare-Worker-Prerender`.
