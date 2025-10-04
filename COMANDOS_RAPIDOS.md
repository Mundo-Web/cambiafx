# 🎮 Comandos Rápidos - Optimizaciones CambiaFX

## ⚡ Quick Commands Cheat Sheet

---

## 🔧 Setup Inicial

### Instalar Dependencias
```bash
# Backend
composer install --optimize-autoloader --no-dev

# Frontend
npm install
```

### Configurar Redis
```bash
# .env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Verificar
redis-cli ping  # → PONG
```

---

## 🏗️ Build & Deploy

### Build de Producción
```bash
# Build optimizado
npm run build

# Verificar tamaño de bundles
ls -lh public/build/assets/*.js

# Windows
dir /s public\build\assets\*.js
```

### Optimizar Laravel
```bash
# Optimización completa (1 comando)
php artisan app:optimize-all

# Con limpieza previa
php artisan app:optimize-all --clear

# Manual (si prefieres)
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Deploy Automático
```bash
# Windows (PowerShell)
.\optimize-production.ps1

# Linux/macOS
chmod +x optimize-production.sh
./optimize-production.sh
```

---

## 🧪 Testing & Auditoría

### Lighthouse Local
```bash
# Desktop audit
npm run audit:lighthouse

# Mobile audit
npm run audit:lighthouse-mobile

# Custom config
npx lighthouse https://cambiafx.pe --config-path=./lighthouse-config.json
```

### Bundle Analysis
```bash
# Visualizar bundle
npx vite-bundle-visualizer

# Source map explorer
npx source-map-explorer 'public/build/assets/*.js'

# Tamaño de archivos
du -sh public/build/assets/*
```

### Verificar Headers
```bash
# Compression
curl -H "Accept-Encoding: gzip,br" -I https://cambiafx.pe | grep Content-Encoding

# Cache-Control
curl -I https://cambiafx.pe/assets/img/logo.webp | grep Cache-Control

# Security headers
curl -I https://cambiafx.pe | grep -E "X-Frame|X-Content-Type|X-XSS"
```

---

## 🧹 Limpieza de Caché

### Laravel Cache
```bash
# Limpiar todo
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear

# Re-optimizar
php artisan app:optimize-all
```

### NPM Cache
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Windows
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Composer Cache
```bash
# Limpiar cache
composer clear-cache

# Re-instalar optimizado
composer install --optimize-autoloader --no-dev
```

---

## 🔍 Debugging

### Ver Logs
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Windows
Get-Content storage/logs/laravel.log -Wait -Tail 50

# Limpiar logs viejos (>30 días)
find storage/logs -name "*.log" -mtime +30 -delete
```

### Verificar Redis
```bash
# Conectar
redis-cli

# Test
redis-cli ping
redis-cli set test "value"
redis-cli get test

# Ver todas las keys
redis-cli keys "*"

# Monitor en tiempo real
redis-cli monitor
```

### Verificar OPcache
```bash
# Ver configuración
php -i | grep opcache

# Reset OPcache (en producción, con cuidado)
php artisan cache:clear
sudo systemctl restart php-fpm  # o apache2
```

---

## 📊 Monitoreo

### Web Vitals (Browser Console)
```javascript
// En la consola del navegador
import('https://unpkg.com/web-vitals?module').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
  onCLS(console.log);
  onFCP(console.log);
  onLCP(console.log);
  onTTFB(console.log);
  onINP(console.log);
});
```

### Performance API
```javascript
// En la consola
performance.getEntriesByType('navigation')[0]
performance.getEntriesByType('resource')
performance.getEntriesByType('paint')
```

---

## 🚀 Deployment

### Pre-Deploy Checklist
```bash
# 1. Test local
npm run build
php artisan app:optimize-all
npm run audit:lighthouse

# 2. Git
git status
git add .
git commit -m "chore: performance optimizations"
git push origin main

# 3. Backup DB (producción)
php artisan backup:run  # si tienes backup configurado
```

### Deploy a Producción
```bash
# SSH a servidor
ssh user@cambiafx.pe

# Deploy
cd /var/www/cambiafx
git pull origin main
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan app:optimize-all --clear
php artisan migrate --force

# Restart services
sudo systemctl restart php-fpm
sudo systemctl restart apache2
```

### Post-Deploy Verification
```bash
# Verificar sitio
curl -I https://cambiafx.pe

# PageSpeed
# https://pagespeed.web.dev/

# Lighthouse
npm run audit:lighthouse
```

---

## 🛠️ Mantenimiento

### Diario
```bash
# Limpiar logs viejos
find storage/logs -name "*.log" -mtime +7 -delete
```

### Semanal
```bash
# Lighthouse audit
npm run audit:lighthouse
npm run audit:lighthouse-mobile

# Verificar bundle size
ls -lh public/build/assets/*.js
```

### Mensual
```bash
# Actualizar dependencias
composer update
npm update

# Re-optimizar
npm run build
php artisan app:optimize-all

# Backup
php artisan backup:run
```

---

## 🔐 Seguridad

### Verificar Permisos
```bash
# Linux
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Verificar
ls -la storage/
ls -la bootstrap/cache/
```

### Verificar .env
```bash
# No debe estar en git
cat .gitignore | grep .env

# Permisos correctos
chmod 600 .env
```

---

## 📦 Backup

### Crear Backup
```bash
# Base de datos
php artisan backup:run --only-db

# Archivos
tar -czf backup-$(date +%Y%m%d).tar.gz storage/ public/

# Todo
php artisan backup:run
```

### Restaurar Backup
```bash
# Base de datos
mysql -u usuario -p database < backup.sql

# Archivos
tar -xzf backup-20250104.tar.gz
```

---

## 🎯 Atajos Útiles

### Alias (agregar a .bashrc o .zshrc)
```bash
# Laravel
alias pa='php artisan'
alias pao='php artisan app:optimize-all'
alias pac='php artisan cache:clear'

# NPM
alias nb='npm run build'
alias nd='npm run dev'
alias nla='npm run audit:lighthouse'

# Git
alias gs='git status'
alias gp='git pull'
alias gc='git commit -m'

# Deploy
alias deploy='./optimize-production.sh'
```

### PowerShell Aliases (Windows)
```powershell
# En $PROFILE
function pa { php artisan $args }
function pao { php artisan app:optimize-all $args }
function nb { npm run build }
function deploy { .\optimize-production.ps1 }
```

---

## 📱 One-Liners Útiles

```bash
# Tamaño total de bundles
du -sh public/build/assets/

# Contar archivos JS
ls public/build/assets/*.js | wc -l

# Ver imports en componentes
grep -r "import" resources/js/components/ | wc -l

# Archivos > 100KB
find public/build/assets -type f -size +100k -exec ls -lh {} \;

# Limpiar todo y rebuild
rm -rf node_modules public/build && npm install && npm run build && php artisan app:optimize-all

# Ver procesos PHP
ps aux | grep php

# Verificar Apache modules
apachectl -M | grep -E "deflate|brotli|headers"
```

---

## 🆘 Emergency Commands

### Sitio Caído
```bash
# Modo mantenimiento
php artisan down --refresh=15

# Subir sitio
php artisan up

# Restart services
sudo systemctl restart php-fpm apache2
```

### Error 500
```bash
# Ver último error
tail -n 50 storage/logs/laravel.log

# Limpiar todo
php artisan cache:clear
php artisan config:clear
php artisan view:clear
composer dump-autoload

# Permisos
chmod -R 755 storage bootstrap/cache
```

### Bundle Corrupto
```bash
# Limpiar y rebuild
rm -rf node_modules public/build
npm install
npm run build
```

---

## 📖 Documentación Rápida

```bash
# Ver todos los comandos artisan
php artisan list

# Ayuda de comando específico
php artisan help app:optimize-all

# Ver rutas
php artisan route:list

# Ver config
php artisan config:show

# Tinker (REPL)
php artisan tinker
```

---

**Tip:** Guarda este archivo en tus favoritos para acceso rápido.

**Última actualización:** 2025-10-04
