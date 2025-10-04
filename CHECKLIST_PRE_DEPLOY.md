# ✅ CHECKLIST PRE-DEPLOY - CambiaFX Optimizaciones

## 🎯 Estado Actual: CASI LISTO

---

## ✅ **LO QUE YA ESTÁ IMPLEMENTADO**

### Código (100%)
- ✅ 15 archivos nuevos creados
- ✅ 4 archivos modificados y optimizados
- ✅ Backend: Comando OptimizeApp + Middleware Cache
- ✅ Frontend: LazyComponent + WebVitals hooks
- ✅ Vite.config optimizado (code-splitting)
- ✅ .htaccess optimizado (compression + cache)
- ✅ public_with_seo.blade.php optimizado (resource hints)

### Documentación (100%)
- ✅ 11 documentos completos
- ✅ Guías paso a paso
- ✅ Ejemplos de código
- ✅ Scripts de deploy
- ✅ Comandos rápidos

---

## ⚠️ **LO QUE FALTA CONFIGURAR EN EL SERVIDOR**

### 1. Redis (REQUERIDO - 10 min) ⭐
```bash
# En el servidor (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install redis-server php-redis

# Iniciar Redis
sudo systemctl start redis
sudo systemctl enable redis

# Verificar
redis-cli ping  # Debe retornar PONG
```

**En .env del servidor:**
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 2. OPcache (REQUERIDO - 5 min) ⭐
**Editar `/etc/php/8.x/fpm/php.ini` o `/etc/php/8.x/apache2/php.ini`:**
```ini
[opcache]
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.fast_shutdown=1
```

**Reiniciar PHP-FPM:**
```bash
sudo systemctl restart php8.1-fpm  # o php-fpm
sudo systemctl restart apache2     # o nginx
```

### 3. Brotli Compression (OPCIONAL - 5 min)
```bash
# Instalar módulo
sudo apt-get install brotli

# Habilitar en Apache
sudo a2enmod brotli
sudo systemctl restart apache2

# Verificar
apachectl -M | grep brotli
```

### 4. Permisos (REQUERIDO - 2 min) ⭐
```bash
# En el servidor
cd /var/www/tu-proyecto

# Permisos correctos
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Verificar
ls -la storage/
ls -la bootstrap/cache/
```

---

## 🚀 **PROCESO DE DEPLOY RECOMENDADO**

### Opción A: Deploy Manual (Recomendado primera vez)

```bash
# 1. En tu máquina local
git add .
git commit -m "feat: performance optimizations - PageSpeed"
git push origin react

# 2. SSH al servidor
ssh usuario@tu-servidor.com

# 3. En el servidor
cd /var/www/cambiafx
git pull origin react

# 4. Instalar dependencias
composer install --no-dev --optimize-autoloader --no-interaction
npm ci

# 5. Build de producción
npm run build

# 6. Optimizar Laravel
php artisan app:optimize-all

# 7. Migraciones (si hay)
php artisan migrate --force

# 8. Permisos
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 9. Restart services
sudo systemctl restart php8.1-fpm
sudo systemctl restart apache2

# 10. Verificar
curl -I https://cambiafx.pe
```

### Opción B: Deploy Automático (Después de verificar)

```bash
# Desde tu máquina local (Windows)
# Primero hacer push
git push origin react

# Luego SSH y ejecutar script
ssh usuario@servidor "cd /var/www/cambiafx && ./optimize-production.sh"
```

---

## 🧪 **TESTING PRE-DEPLOY (EN LOCAL)**

### 1. Build Local ✅
```bash
npm run build
# Debe completar sin errores
```

### 2. Optimización Local ✅
```bash
php artisan app:optimize-all
# Debe mostrar "✅ Optimization completed successfully!"
```

### 3. Verificar Bundle Size ✅
```bash
# Windows
dir /s public\build\assets\*.js

# Debe mostrar archivos < 150KB cada uno
```

### 4. Test Funcional (IMPORTANTE) ⚠️
```bash
# Iniciar servidor local
php artisan serve

# Abrir http://localhost:8000
# Verificar que TODO funcione:
# - Homepage carga correctamente
# - Navegación funciona
# - Formularios funcionan
# - No hay errores en consola
```

---

## 📊 **TESTING POST-DEPLOY (EN PRODUCCIÓN)**

### 1. Verificar Sitio Funcional
```bash
# Verificar que el sitio carga
curl -I https://cambiafx.pe
# Status: 200 OK

# Verificar compression
curl -H "Accept-Encoding: gzip,br" -I https://cambiafx.pe | grep Content-Encoding
# Content-Encoding: br o gzip

# Verificar cache headers
curl -I https://cambiafx.pe/assets/img/logo.webp | grep Cache-Control
# Cache-Control: public, max-age=31536000, immutable
```

### 2. PageSpeed Insights (5 min después)
```
1. Ir a: https://pagespeed.web.dev/
2. Ingresar: https://cambiafx.pe
3. Esperar análisis
4. Verificar:
   ✅ LCP < 2.5s
   ✅ FCP < 1.8s
   ✅ CLS < 0.1
   ✅ Core Web Vitals: PASSED
```

### 3. Lighthouse Local (si tienes Chrome)
```bash
# Instalar lighthouse (una sola vez)
npm install -g lighthouse

# Ejecutar audit
lighthouse https://cambiafx.pe --output=html --output-path=./lighthouse-report.html

# Abrir reporte
# Windows: start lighthouse-report.html
```

### 4. Pruebas Funcionales Manuales
- [ ] Homepage carga < 3 segundos
- [ ] Navegación entre páginas funciona
- [ ] Formularios envían correctamente
- [ ] Imágenes cargan (incluso con lazy loading)
- [ ] No hay errores en consola del navegador
- [ ] Calculadora de cambio funciona
- [ ] Login/Register funciona
- [ ] Checkout funciona (si aplica)

---

## ⚡ **COMANDOS RÁPIDOS POST-DEPLOY**

```bash
# Ver logs en tiempo real
tail -f storage/logs/laravel.log

# Verificar cache
php artisan cache:clear
php artisan app:optimize-all

# Verificar Redis
redis-cli ping
redis-cli info stats

# Verificar OPcache
php -i | grep opcache

# Restart todo
sudo systemctl restart php8.1-fpm apache2
```

---

## 🚨 **ROLLBACK (Si algo sale mal)**

```bash
# 1. Modo mantenimiento
php artisan down

# 2. Volver a versión anterior
git reset --hard HEAD~1

# 3. Reinstalar versión anterior
composer install --no-dev
npm ci
npm run build

# 4. Limpiar cache
php artisan cache:clear
php artisan app:optimize-all

# 5. Subir sitio
php artisan up
```

---

## 📋 **CHECKLIST FINAL PRE-DEPLOY**

### En Local (Antes de subir)
- [ ] `git status` - Todo commiteado
- [ ] `npm run build` - Build exitoso
- [ ] `php artisan app:optimize-all` - Sin errores
- [ ] Test funcional local - Todo funciona
- [ ] `.env` no está en git
- [ ] Documentación revisada

### En Servidor (Configuración)
- [ ] Redis instalado y corriendo
- [ ] OPcache habilitado en php.ini
- [ ] Permisos correctos (755/775)
- [ ] `.env` configurado con Redis
- [ ] Backup de BD realizado

### Deployment
- [ ] Git push exitoso
- [ ] Composer install sin errores
- [ ] npm ci sin errores
- [ ] npm run build exitoso
- [ ] php artisan migrate (si aplica)
- [ ] php artisan app:optimize-all exitoso
- [ ] Services reiniciados

### Post-Deploy
- [ ] Sitio carga correctamente
- [ ] No hay errores en logs
- [ ] Headers HTTP correctos
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals: PASSED

---

## 🎯 **RESUMEN: ¿ESTÁS LISTO?**

### ✅ LISTO para deploy:
- Código optimizado
- Documentación completa
- Scripts de deploy creados

### ⚠️ REQUIERE configuración en servidor:
1. **Redis** (10 min) - CRÍTICO
2. **OPcache** (5 min) - CRÍTICO
3. **Brotli** (5 min) - Opcional
4. **Permisos** (2 min) - CRÍTICO

### 📝 RECOMENDACIÓN:

**ANTES de subir a producción:**
1. ✅ Hacer backup completo de BD
2. ✅ Hacer backup de archivos actuales
3. ✅ Configurar Redis en servidor
4. ✅ Habilitar OPcache
5. ✅ Probar en staging primero (si tienes)

**ENTONCES SÍ:**
6. 🚀 Deploy a producción
7. 📊 Monitorear logs por 1 hora
8. 🎯 Verificar PageSpeed después de 2 horas

---

## 💬 **Respuesta a tu pregunta:**

**¿Ya está listo para subir al servidor?**

**SÍ, el CÓDIGO está listo**, pero necesitas:

1. **Configurar Redis en el servidor** (10 min) ⭐
2. **Habilitar OPcache** (5 min) ⭐
3. **Ajustar permisos** (2 min) ⭐

**DESPUÉS de eso:** ✅ 100% listo para deploy

---

**Siguiente paso:** Configurar Redis y OPcache en el servidor, luego deploy 🚀

**Tiempo total:** ~20 minutos de configuración + 10 minutos de deploy
