# Script de optimización post-implementación para CambiaFX (Windows)
# Ejecutar en PowerShell como: .\optimize.ps1

Write-Host "🚀 Iniciando proceso de optimización de CambiaFX..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Limpiar cache de Laravel
Write-Host ""
Write-Host "📦 Paso 1: Limpiando cache de Laravel..." -ForegroundColor Yellow
php artisan optimize:clear
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
Write-Host "✓ Cache de Laravel limpiado" -ForegroundColor Green

# 2. Rebuild de assets
Write-Host ""
Write-Host "🔨 Paso 2: Compilando assets de producción..." -ForegroundColor Yellow
npm run build
Write-Host "✓ Assets compilados" -ForegroundColor Green

# 3. Optimizar autoloader
Write-Host ""
Write-Host "⚡ Paso 3: Optimizando autoloader de Composer..." -ForegroundColor Yellow
composer dump-autoload --optimize --no-dev
Write-Host "✓ Autoloader optimizado" -ForegroundColor Green

# 4. Cachear configuraciones
Write-Host ""
Write-Host "💾 Paso 4: Cacheando configuraciones..." -ForegroundColor Yellow
php artisan config:cache
php artisan route:cache
php artisan view:cache
Write-Host "✓ Configuraciones cacheadas" -ForegroundColor Green

# 5. Limpiar sesiones viejas
Write-Host ""
Write-Host "🧹 Paso 5: Limpiando sesiones y cache antiguos..." -ForegroundColor Yellow
try {
    Get-ChildItem -Path "storage\framework\sessions" -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) } | Remove-Item -Force
    Get-ChildItem -Path "storage\framework\cache\data" -Recurse -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) } | Remove-Item -Force
    Write-Host "✓ Sesiones y cache antiguos eliminados" -ForegroundColor Green
} catch {
    Write-Host "No hay sesiones o cache viejos para eliminar" -ForegroundColor Yellow
}

# 6. Verificar .htaccess
Write-Host ""
Write-Host "📄 Paso 6: Verificando .htaccess..." -ForegroundColor Yellow
if (Test-Path "public\.htaccess") {
    Write-Host "✓ .htaccess existe" -ForegroundColor Green
} else {
    Write-Host "✗ .htaccess NO existe - ¡URGENTE!" -ForegroundColor Red
}

# 7. Resumen final
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Optimización completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ejecutar git gc para compactar repositorio"
Write-Host "2. Medir performance en PageSpeed Insights"
Write-Host "3. Subir cambios al servidor de producción"
Write-Host "4. Configurar cron job de Laravel en cPanel"
Write-Host ""
Write-Host "🔗 Recursos útiles:" -ForegroundColor Cyan
Write-Host "- PageSpeed: https://pagespeed.web.dev/"
Write-Host "- GTmetrix: https://gtmetrix.com/"
Write-Host "- Ver OPTIMIZACIONES_PERFORMANCE.md para más detalles"
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
