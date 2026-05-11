<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\TransactionalLanding;
use Illuminate\Support\Facades\DB;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🔍 Buscando landing con slug '/tipo-de-cambio-hoy'...\n";

$landing = TransactionalLanding::where('url', '/tipo-de-cambio-hoy')->first();

if ($landing) {
    echo "✅ Landing encontrada (ID: {$landing->id}). Actualizando slug...\n";
    $landing->url = 'tipo-de-cambio-hoy';
    $landing->save();
    echo "🚀 Slug actualizado correctamente a 'tipo-de-cambio-hoy'.\n";
} else {
    echo "❌ No se encontró ninguna landing con el slug '/tipo-de-cambio-hoy'.\n";
    
    // Check if it exists without the slash just in case
    $exists = TransactionalLanding::where('url', 'tipo-de-cambio-hoy')->first();
    if ($exists) {
        echo "ℹ️ Ya existe una landing con el slug 'tipo-de-cambio-hoy' (ID: {$exists->id}).\n";
    }
}
