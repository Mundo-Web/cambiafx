# PowerShell Script para Optimización en Producción
# Ejecutar como administrador en el servidor

Write-Host "🚀 Iniciando optimización de CambiaFX para producción..." -ForegroundColor Cyan
Write-Host ""

# Variables
$projectPath = $PSScriptRoot
$phpPath = "php" # Ajustar si PHP no está en PATH
$composerPath = "composer" # Ajustar si composer no está en PATH
$npmPath = "npm" # Ajustar si npm no está en PATH

# Función para verificar si un comando existe
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) { return $true }
    } catch {
        return $false
    }
}

# Verificar dependencias
Write-Host "🔍 Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Command $phpPath)) {
    Write-Host "❌ PHP no encontrado en PATH" -ForegroundColor Red
    exit 1
}
if (-not (Test-Command $composerPath)) {
    Write-Host "❌ Composer no encontrado en PATH" -ForegroundColor Red
    exit 1
}
if (-not (Test-Command $npmPath)) {
    Write-Host "❌ NPM no encontrado en PATH" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Todas las dependencias están disponibles" -ForegroundColor Green
Write-Host ""

# Modo mantenimiento
Write-Host "🔧 Activando modo mantenimiento..." -ForegroundColor Yellow
& $phpPath artisan down --refresh=15
Write-Host ""

# Pull latest changes
Write-Host "📥 Obteniendo últimos cambios..." -ForegroundColor Yellow
git pull origin main
Write-Host ""

# Instalar dependencias de Composer
Write-Host "📦 Instalando dependencias de Composer..." -ForegroundColor Yellow
& $composerPath install --no-dev --optimize-autoloader --no-interaction
Write-Host ""

# Instalar dependencias de NPM
Write-Host "📦 Instalando dependencias de NPM..." -ForegroundColor Yellow
& $npmPath ci --production=false
Write-Host ""

# Build de assets
Write-Host "🏗️ Compilando assets..." -ForegroundColor Yellow
& $npmPath run build
Write-Host ""

# Ejecutar migraciones
Write-Host "🗄️ Ejecutando migraciones..." -ForegroundColor Yellow
$runMigrations = Read-Host "¿Ejecutar migraciones? (s/n)"
if ($runMigrations -eq "s") {
    & $phpPath artisan migrate --force
}
Write-Host ""

# Limpiar caché anterior
Write-Host "🧹 Limpiando cachés anteriores..." -ForegroundColor Yellow
& $phpPath artisan cache:clear
& $phpPath artisan config:clear
& $phpPath artisan route:clear
& $phpPath artisan view:clear
& $phpPath artisan event:clear
Write-Host ""

# Optimizar aplicación
Write-Host "⚡ Optimizando aplicación..." -ForegroundColor Yellow
& $phpPath artisan config:cache
& $phpPath artisan route:cache
& $phpPath artisan view:cache
& $phpPath artisan event:cache
Write-Host ""

# Optimizar autoloader de Composer
Write-Host "⚡ Optimizando autoloader..." -ForegroundColor Yellow
& $composerPath dump-autoload --optimize --no-dev
Write-Host ""

# Crear symlink de storage (si no existe)
Write-Host "🔗 Verificando symlink de storage..." -ForegroundColor Yellow
& $phpPath artisan storage:link
Write-Host ""

# Limpiar logs antiguos (opcional)
Write-Host "🧹 Limpiando logs antiguos..." -ForegroundColor Yellow
$logPath = Join-Path $projectPath "storage\logs"
Get-ChildItem $logPath -Filter "*.log" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item -Force
Write-Host ""

# Verificar permisos (importante en Linux/Unix)
if ($IsLinux -or $IsMacOS) {
    Write-Host "🔒 Configurando permisos..." -ForegroundColor Yellow
    chmod -R 775 storage bootstrap/cache
    chown -R www-data:www-data storage bootstrap/cache
}

# Optimización de OPcache (mostrar instrucciones)
Write-Host ""
Write-Host "📝 Recordatorio: Verificar configuración de OPcache en php.ini:" -ForegroundColor Cyan
Write-Host "  opcache.enable=1" -ForegroundColor Gray
Write-Host "  opcache.memory_consumption=256" -ForegroundColor Gray
Write-Host "  opcache.interned_strings_buffer=16" -ForegroundColor Gray
Write-Host "  opcache.max_accelerated_files=20000" -ForegroundColor Gray
Write-Host "  opcache.validate_timestamps=0" -ForegroundColor Gray
Write-Host ""

# Verificar Redis (opcional)
Write-Host "📝 Recordatorio: Verificar que Redis esté configurado en .env:" -ForegroundColor Cyan
Write-Host "  CACHE_DRIVER=redis" -ForegroundColor Gray
Write-Host "  SESSION_DRIVER=redis" -ForegroundColor Gray
Write-Host "  QUEUE_CONNECTION=redis" -ForegroundColor Gray
Write-Host ""

# Desactivar modo mantenimiento
Write-Host "✅ Desactivando modo mantenimiento..." -ForegroundColor Yellow
& $phpPath artisan up
Write-Host ""

# Ejecutar auditoría de performance (opcional)
Write-Host "📊 ¿Desea ejecutar auditoría de performance con Lighthouse? (s/n)" -ForegroundColor Cyan
$runAudit = Read-Host
if ($runAudit -eq "s") {
    Write-Host "Ejecutando Lighthouse (esto puede tomar unos minutos)..." -ForegroundColor Yellow
    & $npmPath run audit:lighthouse
    & $npmPath run audit:lighthouse-mobile
}

Write-Host ""
Write-Host "✅ ¡Optimización completada exitosamente! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Siguiente pasos recomendados:" -ForegroundColor Cyan
Write-Host "  1. Verificar que el sitio funcione correctamente" -ForegroundColor Gray
Write-Host "  2. Revisar los logs en storage/logs/" -ForegroundColor Gray
Write-Host "  3. Ejecutar pruebas de performance con PageSpeed Insights" -ForegroundColor Gray
Write-Host "  4. Monitorear Web Vitals en Google Analytics" -ForegroundColor Gray
Write-Host ""
