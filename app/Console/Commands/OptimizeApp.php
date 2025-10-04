<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;

class OptimizeApp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:optimize-all {--clear : Clear all caches before optimizing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize application for production (cache routes, config, views)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting CambiaFX optimization...');
        $this->newLine();

        // Clear caches if requested
        if ($this->option('clear')) {
            $this->warn('🧹 Clearing existing caches...');
            $this->clearCaches();
            $this->newLine();
        }

        // Optimize application
        $this->info('⚡ Optimizing application...');
        $this->optimizeApp();
        
        $this->newLine();
        $this->info('✅ Optimization completed successfully!');
        $this->newLine();
        
        // Show cache status
        $this->showCacheStatus();
        
        return Command::SUCCESS;
    }

    /**
     * Clear all application caches
     */
    protected function clearCaches()
    {
        $commands = [
            'route:clear' => 'Routes cache',
            'config:clear' => 'Config cache',
            'view:clear' => 'View cache',
            'cache:clear' => 'Application cache',
            'event:clear' => 'Event cache',
        ];

        foreach ($commands as $command => $description) {
            $this->line("  → Clearing {$description}...");
            Artisan::call($command);
        }
    }

    /**
     * Optimize application caches
     */
    protected function optimizeApp()
    {
        $commands = [
            'config:cache' => 'Caching configuration',
            'route:cache' => 'Caching routes',
            'view:cache' => 'Caching views',
            'event:cache' => 'Caching events',
        ];

        foreach ($commands as $command => $description) {
            $this->line("  → {$description}...");
            Artisan::call($command, [], $this->getOutput());
        }

        // Optimize composer autoloader
        $this->line("  → Optimizing Composer autoloader...");
        exec('composer dump-autoload --optimize --no-dev 2>&1', $output, $return);
        
        if ($return === 0) {
            $this->line("    ✓ Composer autoloader optimized");
        }
    }

    /**
     * Show current cache status
     */
    protected function showCacheStatus()
    {
        $this->table(
            ['Cache Type', 'Status'],
            [
                ['Routes', $this->checkCacheFile('routes-v7.php') ? '✓ Cached' : '✗ Not cached'],
                ['Config', $this->checkCacheFile('config.php') ? '✓ Cached' : '✗ Not cached'],
                ['Views', $this->checkCacheDir('views') ? '✓ Cached' : '✗ Not cached'],
                ['Events', $this->checkCacheFile('events.php') ? '✓ Cached' : '✗ Not cached'],
            ]
        );
    }

    /**
     * Check if cache file exists
     */
    protected function checkCacheFile($filename)
    {
        return file_exists(base_path("bootstrap/cache/{$filename}"));
    }

    /**
     * Check if cache directory has files
     */
    protected function checkCacheDir($dirname)
    {
        $path = storage_path("framework/{$dirname}");
        return is_dir($path) && count(glob("{$path}/*")) > 0;
    }
}
