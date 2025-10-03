#!/bin/bash

# Script de optimización post-implementación para CambiaFX
# Este script debe ejecutarse después de implementar las optimizaciones

echo "🚀 Iniciando proceso de optimización de CambiaFX..."
echo "=================================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Limpiar cache de Laravel
echo ""
echo "${YELLOW}📦 Paso 1: Limpiando cache de Laravel...${NC}"
php artisan optimize:clear
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo "${GREEN}✓ Cache de Laravel limpiado${NC}"

# 2. Rebuild de assets
echo ""
echo "${YELLOW}🔨 Paso 2: Compilando assets de producción...${NC}"
npm run build
echo "${GREEN}✓ Assets compilados${NC}"

# 3. Optimizar autoloader
echo ""
echo "${YELLOW}⚡ Paso 3: Optimizando autoloader de Composer...${NC}"
composer dump-autoload --optimize --no-dev
echo "${GREEN}✓ Autoloader optimizado${NC}"

# 4. Cachear configuraciones
echo ""
echo "${YELLOW}💾 Paso 4: Cacheando configuraciones...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "${GREEN}✓ Configuraciones cacheadas${NC}"

# 5. Limpiar sesiones viejas
echo ""
echo "${YELLOW}🧹 Paso 5: Limpiando sesiones y cache antiguos...${NC}"
find storage/framework/sessions -type f -mtime +1 -delete 2>/dev/null || echo "No hay sesiones viejas"
find storage/framework/cache/data -type f -mtime +1 -delete 2>/dev/null || echo "No hay cache viejo"
echo "${GREEN}✓ Sesiones y cache antiguos eliminados${NC}"

# 6. Optimizar permisos
echo ""
echo "${YELLOW}🔐 Paso 6: Verificando permisos...${NC}"
chmod -R 755 storage bootstrap/cache
echo "${GREEN}✓ Permisos verificados${NC}"

# 7. Verificar .htaccess
echo ""
echo "${YELLOW}📄 Paso 7: Verificando .htaccess...${NC}"
if [ -f "public/.htaccess" ]; then
    echo "${GREEN}✓ .htaccess existe${NC}"
else
    echo "${RED}✗ .htaccess NO existe - ¡URGENTE!${NC}"
fi

# 8. Resumen final
echo ""
echo "=================================================="
echo "${GREEN}✅ Optimización completada!${NC}"
echo ""
echo "📊 Próximos pasos:"
echo "1. Ejecutar git gc para compactar repositorio"
echo "2. Medir performance en PageSpeed Insights"
echo "3. Configurar cron job de Laravel"
echo "4. Considerar implementar CDN"
echo ""
echo "🔗 Recursos útiles:"
echo "- PageSpeed: https://pagespeed.web.dev/"
echo "- GTmetrix: https://gtmetrix.com/"
echo "- Ver OPTIMIZACIONES_PERFORMANCE.md para más detalles"
echo ""
