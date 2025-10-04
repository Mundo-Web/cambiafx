# ⌨️ Comandos Útiles - Mejoras CambiaFX.pe

Referencia rápida de todos los comandos necesarios para implementar y validar las mejoras.

---

## 📦 Instalación

### Dependencias Completas
```bash
npm install --save-dev critical lighthouse pa11y-ci web-vitals vite-bundle-visualizer purgecss rollup-plugin-visualizer
```

### Dependencias Mínimas (Quick Start)
```bash
npm install --save-dev web-vitals
```

---

## 🔧 Laravel/PHP

### Cache
```bash
# Limpiar todo el cache
php artisan optimize:clear

# Específicos
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Cachear configuración (producción)
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Servidor
```bash
# Iniciar servidor de desarrollo
php artisan serve

# Puerto específico
php artisan serve --port=8080
```

### Composer
```bash
# Actualizar dependencias
composer update

# Autoload optimizado (producción)
composer install --optimize-autoloader --no-dev
```

---

## ⚛️ Node/NPM/Vite

### Desarrollo
```bash
# Modo desarrollo con hot reload
npm run dev

# Preview build de producción
npm run preview
```

### Build
```bash
# Build de producción
npm run build

# Build con análisis de bundle
npm run build && npm run analyze

# Build forzado (limpia cache)
npm run build -- --force
```

### Auditorías
```bash
# Lighthouse Desktop
npm run audit:lighthouse

# Lighthouse Mobile
npm run audit:lighthouse-mobile

# Accesibilidad con pa11y
npm run audit:accessibility

# Todas las auditorías
npm run audit:full
```

### Performance
```bash
# Extraer Critical CSS
node extract-critical-css.js

# Análisis de bundle
npm run analyze

# Ver tamaño de archivos
ls -lh public/build/assets/
# Windows PowerShell:
Get-ChildItem public\build\assets\ | Select-Object Name, Length
```

---

## 🧪 Testing de Performance

### PageSpeed Insights (Manual)
```bash
# Abrir en navegador
start https://pagespeed.web.dev/analysis?url=https://cambiafx.pe

# Mac/Linux
open https://pagespeed.web.dev/analysis?url=https://cambiafx.pe
```

### Lighthouse CLI
```bash
# Desktop
lighthouse https://cambiafx.pe --preset=desktop --output=html --output-path=./reports/lighthouse-desktop.html

# Mobile
lighthouse https://cambiafx.pe --preset=mobile --output=html --output-path=./reports/lighthouse-mobile.html

# Solo performance
lighthouse https://cambiafx.pe --only-categories=performance --output=json

# Con throttling personalizado
lighthouse https://cambiafx.pe --throttling.cpuSlowdownMultiplier=4
```

### WebPageTest (Manual)
```bash
start https://www.webpagetest.org/?url=https://cambiafx.pe
```

---

## ♿ Testing de Accesibilidad

### pa11y
```bash
# Test básico
pa11y https://cambiafx.pe

# Con reporter específico
pa11y https://cambiafx.pe --reporter html > reports/a11y.html

# Múltiples URLs
pa11y-ci --sitemap https://cambiafx.pe/sitemap.xml

# Con configuración personalizada
pa11y https://cambiafx.pe --standard WCAG2AA --level error
```

### axe-core (si instalado)
```bash
npx axe https://cambiafx.pe --save reports/axe-results.json
```

---

## 🖼️ Optimización de Imágenes

### ImageMagick (si instalado)
```bash
# Convertir a WebP
magick input.jpg -quality 85 output.webp

# Convertir a AVIF
magick input.jpg -quality 80 output.avif

# Batch conversion
for file in *.jpg; do magick "$file" -quality 85 "${file%.jpg}.webp"; done
```

### Sharp (Node.js)
```bash
# Instalar
npm install --save-dev sharp

# Usar en script
node scripts/optimize-images.js
```

---

## 📊 Git

### Branches
```bash
# Crear branch para implementación
git checkout -b feature/performance-improvements

# Ver cambios
git status
git diff

# Commit
git add .
git commit -m "feat: implement performance and accessibility improvements"

# Push
git push origin feature/performance-improvements
```

### Tags
```bash
# Crear tag de versión
git tag -a v1.0.0-performance -m "Performance improvements release"
git push origin v1.0.0-performance
```

---

## 🔍 Debugging

### Chrome DevTools
```bash
# Abrir con performance profiling
chrome --auto-open-devtools-for-tabs --remote-debugging-port=9222

# Generar coverage report
chrome --headless --disable-gpu --dump-dom https://cambiafx.pe
```

### Network Analysis
```bash
# Ver headers HTTP (curl)
curl -I https://cambiafx.pe

# Con detalles
curl -v https://cambiafx.pe

# Ver solo Cache-Control
curl -I https://cambiafx.pe | grep -i cache-control
```

---

## 📁 File Operations

### Buscar archivos
```bash
# Buscar imágenes sin optimizar
find public/assets -type f \( -name "*.jpg" -o -name "*.png" \) ! -name "*.webp"

# Buscar archivos grandes (>500KB)
find public -type f -size +500k

# PowerShell
Get-ChildItem -Recurse -File | Where-Object {$_.Length -gt 500KB}
```

### Copiar archivos
```bash
# Copiar .htaccess
cp .htaccess.performance .htaccess

# Backup
cp .htaccess .htaccess.backup

# Windows
copy .htaccess.performance .htaccess
```

---

## 🎯 Aliases Útiles (Opcional)

Agregar a `.bashrc` o `.zshrc`:

```bash
# Alias para desarrollo
alias dev='npm run dev'
alias build='npm run build'
alias serve='php artisan serve'

# Alias para testing
alias test-perf='npm run build && npm run audit:lighthouse'
alias test-a11y='npm run audit:accessibility'
alias test-all='npm run audit:full'

# Alias para cache
alias clear-all='php artisan optimize:clear && npm run build -- --force'
alias cache-prod='php artisan config:cache && php artisan route:cache && php artisan view:cache'
```

---

## 🚀 Deployment

### Build optimizado para producción
```bash
# 1. Limpiar
php artisan optimize:clear
rm -rf public/build

# 2. Dependencies
composer install --optimize-autoloader --no-dev
npm ci --production=false

# 3. Build
npm run build

# 4. Cache Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Verificar
npm run audit:lighthouse
```

### Rollback rápido
```bash
# Git
git checkout main
git pull

# Rebuild
npm ci
npm run build
php artisan optimize:clear
```

---

## 📈 Monitoring

### Logs en tiempo real
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Filtrar errores
tail -f storage/logs/laravel.log | grep ERROR

# PowerShell
Get-Content storage\logs\laravel.log -Wait -Tail 50
```

### Performance del servidor
```bash
# Ver procesos PHP
ps aux | grep php

# Memoria
free -h

# Disco
df -h

# Windows
Get-Process php
Get-Counter '\Memory\Available MBytes'
```

---

## 🔧 Troubleshooting

### Error: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Permission denied
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Error: Cache issues
```bash
php artisan optimize:clear
composer dump-autoload
npm run build -- --force
```

### Error: Port already in use
```bash
# Encontrar proceso
lsof -i :8000
# O
netstat -ano | findstr :8000

# Matar proceso
kill -9 <PID>
# Windows
taskkill /PID <PID> /F
```

---

## 📋 Checklist de Comandos Pre-Deploy

```bash
# 1. Tests
npm run test
php artisan test

# 2. Linting
npm run lint
php artisan insights

# 3. Build
npm run build

# 4. Auditorías
npm run audit:lighthouse
npm run audit:accessibility

# 5. Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Verificar archivos
ls -lh public/build/assets/
```

---

## 🎨 CSS/SCSS

### Compilación
```bash
# Si usas PostCSS adicional
npx postcss resources/css/app.css -o public/css/app.css

# PurgeCSS manual
npx purgecss --css public/build/assets/*.css --content resources/**/*.{js,jsx,blade.php} --output public/build/purged/
```

---

## 🌐 SEO

### Sitemap
```bash
# Generar sitemap
php artisan sitemap:generate

# Ping a Google
curl "https://www.google.com/ping?sitemap=https://cambiafx.pe/sitemap.xml"
```

### Robots.txt
```bash
# Verificar
curl https://cambiafx.pe/robots.txt

# Validar
start https://support.google.com/webmasters/answer/6062598
```

---

## 💡 Tips de PowerShell (Windows)

```powershell
# Equivalentes a comandos Unix
Get-ChildItem # ls
Copy-Item # cp
Remove-Item # rm
Set-Location # cd
Get-Content # cat

# Alias útiles
Set-Alias -Name dev -Value "npm run dev"
Set-Alias -Name build -Value "npm run build"

# Ejecutar múltiples comandos
npm run build; php artisan optimize:clear

# Ver uso de puerto
netstat -ano | findstr :8000

# Variables de entorno
$env:NODE_ENV = "production"
```

---

## 🎯 One-Liners Útiles

```bash
# Build completo optimizado
npm run build && php artisan optimize:clear && php artisan config:cache

# Test completo
npm run audit:full && echo "✅ Auditorías completadas"

# Limpiar todo
rm -rf node_modules public/build && npm install && npm run build

# Ver tamaño total de build
du -sh public/build

# Contar líneas de código
find resources/js -name "*.jsx" | xargs wc -l

# Backup rápido
tar -czf backup-$(date +%Y%m%d).tar.gz public/build storage/app
```

---

## 📚 Referencias Rápidas

### Lighthouse scores
```bash
# Minimum acceptable
Performance: 90+
Accessibility: 100
Best Practices: 90+
SEO: 90+
```

### Web Vitals thresholds
```bash
LCP: < 2.5s (good), < 4.0s (needs improvement)
FID: < 100ms (good), < 300ms (needs improvement)
CLS: < 0.1 (good), < 0.25 (needs improvement)
INP: < 200ms (good), < 500ms (needs improvement)
```

---

**Última actualización:** 2025-10-04  
**Versión:** 1.0

**¡Comandos listos para usar! ⚡**

