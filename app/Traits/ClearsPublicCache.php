<?php

namespace App\Traits;

use App\Http\Controllers\BasicController;

trait ClearsPublicCache
{
    /**
     * Se ejecuta automáticamente al arrancar el modelo en Laravel.
     * Escucha los eventos 'saved' (crear y editar) y 'deleted' (eliminar)
     * para vaciar la caché pública de inmediato.
     */
    protected static function bootClearsPublicCache()
    {
        static::saved(function () {
            BasicController::clearPublicCache();
        });

        static::deleted(function () {
            BasicController::clearPublicCache();
        });
    }
}
