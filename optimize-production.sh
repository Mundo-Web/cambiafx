#!/bin/bash
# Bash Script para Optimización en Producción (Linux/macOS)

echo "🚀 Iniciando optimización de CambiaFX para producción..."
echo ""

# Variables
PROJECT_PATH="$(cd "$(dirname "$0")" && pwd)"
PHP_PATH="php"
COMPOSER_PATH="composer"
NPM_PATH="npm"

# Verificar dependencias
echo "🔍 Verificando dependencias..."
command -v $PHP_PATH >/dev/null 2>&1 || { echo "❌ PHP no encontrado" >&2; exit 1; }
command -v $COMPOSER_PATH >/dev/null 2>&1 || { echo "❌ Composer no encontrado" >&2; exit 1; }
command -v $NPM_PATH >/dev/null 2>&1 || { echo "❌ NPM no encontrado" >&2; exit 1; }
echo "✅ Todas las dependencias están disponibles"
echo ""

# Modo mantenimiento
echo "🔧 Activando modo mantenimiento..."
$PHP_PATH artisan down --refresh=15
echo ""

# Pull latest changes
echo "📥 Obteniendo últimos cambios..."
git pull origin main
echo ""

# Instalar dependencias de Composer
echo "📦 Instalando dependencias de Composer..."
$COMPOSER_PATH install --no-dev --optimize-autoloader --no-interaction
echo ""

# Instalar dependencias de NPM
echo "📦 Instalando dependencias de NPM..."
$NPM_PATH ci --production=false
echo ""

# Build de assets
echo "🏗️ Compilando assets..."
$NPM_PATH run build
echo ""

# Ejecutar migraciones (con confirmación)
echo "🗄️ ¿Ejecutar migraciones? (s/n)"
read -r run_migrations
if [ "$run_migrations" = "s" ]; then
    $PHP_PATH artisan migrate --force
fi
echo ""

# Limpiar caché anterior
echo "🧹 Limpiando cachés anteriores..."
$PHP_PATH artisan cache:clear
$PHP_PATH artisan config:clear
$PHP_PATH artisan route:clear
$PHP_PATH artisan view:clear
$PHP_PATH artisan event:clear
echo ""

# Optimizar aplicación
echo "⚡ Optimizando aplicación..."
$PHP_PATH artisan config:cache
$PHP_PATH artisan route:cache
$PHP_PATH artisan view:cache
$PHP_PATH artisan event:cache
echo ""

# Optimizar autoloader
echo "⚡ Optimizando autoloader..."
$COMPOSER_PATH dump-autoload --optimize --no-dev
echo ""

# Storage link
echo "🔗 Verificando symlink de storage..."
$PHP_PATH artisan storage:link
echo ""

# Limpiar logs antiguos
echo "🧹 Limpiando logs antiguos..."
find storage/logs -name "*.log" -mtime +30 -delete
echo ""

# Configurar permisos
echo "🔒 Configurando permisos..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
echo ""

# Recordatorios
echo ""
echo "📝 Recordatorio: Verificar configuración de OPcache en php.ini:"
echo "  opcache.enable=1"
echo "  opcache.memory_consumption=256"
echo "  opcache.validate_timestamps=0"
echo ""
echo "📝 Recordatorio: Verificar que Redis esté configurado en .env:"
echo "  CACHE_DRIVER=redis"
echo "  SESSION_DRIVER=redis"
echo ""

# Desactivar modo mantenimiento
echo "✅ Desactivando modo mantenimiento..."
$PHP_PATH artisan up
echo ""

echo "✅ ¡Optimización completada exitosamente! 🎉"
echo ""
