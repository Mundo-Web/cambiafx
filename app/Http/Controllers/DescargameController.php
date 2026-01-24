<?php

namespace App\Http\Controllers;

use App\Models\App;
use Illuminate\Http\Request;

class DescargameController extends Controller
{
    /**
     * Detecta el sistema operativo del usuario y redirige a la tienda de apps correspondiente.
     * 
     * Lógica de detección:
     * - iOS: Redirige a App Store
     * - Android: Redirige a Google Play
     * - Huawei: Redirige a AppGallery
     * - Otros: Redirige al home o muestra página de selección
     */
    public function redirect(Request $request)
    {
        $userAgent = $request->header('User-Agent', '');
        
        // Detectar sistema operativo
        $platform = $this->detectPlatform($userAgent);
        
        // Obtener las apps disponibles
        $apps = App::where('visible', true)->get();
        
        if ($apps->isEmpty()) {
            // Si no hay apps configuradas, redirigir al home
            return redirect('/');
        }
        
        // Buscar la app correspondiente a la plataforma
        $targetApp = $this->getAppForPlatform($apps, $platform);
        
        if ($targetApp && $targetApp->link) {
            return redirect()->away($targetApp->link);
        }
        
        // Si no se encuentra app para la plataforma, intentar fallback
        $fallbackApp = $this->getFallbackApp($apps);
        
        if ($fallbackApp && $fallbackApp->link) {
            return redirect()->away($fallbackApp->link);
        }
        
        // Si no hay ninguna app, redirigir al home
        return redirect('/');
    }

    /**
     * Detecta la plataforma del usuario basándose en el User-Agent.
     */
    private function detectPlatform(string $userAgent): string
    {
        $userAgent = strtolower($userAgent);
        
        // Detectar Huawei primero (puede tener también 'android' en el UA)
        if (preg_match('/huawei|honor|harmony/i', $userAgent)) {
            return 'huawei';
        }
        
        // Detectar iOS
        if (preg_match('/iphone|ipad|ipod/i', $userAgent)) {
            return 'ios';
        }
        
        // Detectar Android
        if (preg_match('/android/i', $userAgent)) {
            return 'android';
        }
        
        // Plataforma no detectada o desktop
        return 'unknown';
    }

    /**
     * Obtiene la app correspondiente a la plataforma.
     */
    private function getAppForPlatform($apps, string $platform)
    {
        // Primero buscar por campo 'platform'
        $app = $apps->first(function ($app) use ($platform) {
            return strtolower($app->platform ?? '') === $platform;
        });
        
        if ($app) {
            return $app;
        }
        
        // Fallback: buscar por nombre según la plataforma
        return match ($platform) {
            'ios' => $apps->first(function ($app) {
                $name = strtolower($app->name ?? '');
                return str_contains($name, 'app store') || 
                       str_contains($name, 'ios') || 
                       str_contains($name, 'apple');
            }),
            'android' => $apps->first(function ($app) {
                $name = strtolower($app->name ?? '');
                return str_contains($name, 'google play') || 
                       str_contains($name, 'android') || 
                       str_contains($name, 'play store');
            }),
            'huawei' => $apps->first(function ($app) {
                $name = strtolower($app->name ?? '');
                return str_contains($name, 'app gallery') || 
                       str_contains($name, 'huawei') || 
                       str_contains($name, 'appgallery');
            }),
            default => null,
        };
    }

    /**
     * Obtiene una app de fallback (la primera disponible).
     */
    private function getFallbackApp($apps)
    {
        return $apps->first();
    }
}
