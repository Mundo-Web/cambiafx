<?php

namespace App\Providers;

use App\Models\Sale;
use App\Models\User;
use App\Observers\SaleCreationObserver;
use App\Observers\SaleStatusObserver;
use App\Observers\UserNameObserver;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Prevenir que Cloudflare Rocket Loader retrase o reescriba los scripts ESM de Vite
        Vite::useScriptTagAttributes([
            'data-cfasync' => 'false',
        ]);

        // Configure database to disconnect idle connections
        DB::disconnect();
        
        // Add event listener to close connections after request is processed
        app()->terminating(function () {
            DB::disconnect();
        });

        Sale::observe([
            SaleCreationObserver::class,
            SaleStatusObserver::class,
        ]);
        User::observe(UserNameObserver::class);
    }
}
