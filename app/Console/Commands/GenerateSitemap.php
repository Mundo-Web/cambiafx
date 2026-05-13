<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use App\Models\Post;
use App\Models\Service;
use App\Models\Solution;
use Carbon\Carbon;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Genera un sitemap.xml automáticamente';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generando sitemap.xml...');
        
        $sitemap = $this->generateSitemap();
        
        File::put(public_path('sitemap.xml'), $sitemap);
        
        $this->info('Sitemap generado exitosamente en public/sitemap.xml');
    }
    
    /**
     * Genera el contenido del sitemap
     */
    private function generateSitemap()
    {
        $baseUrl = config('app.url', 'https://cambiafx.com');
        $now = Carbon::now()->toISOString();
        
        $urls = collect([
            // Páginas principales
            [
                'url' => $baseUrl,
                'lastmod' => $now,
                'changefreq' => 'daily',
                'priority' => '1.0'
            ],
            [
                'url' => $baseUrl . '/nosotros',
                'lastmod' => $now,
                'changefreq' => 'monthly',
                'priority' => '0.8'
            ],
            [
                'url' => $baseUrl . '/servicios',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.9'
            ],
            [
                'url' => $baseUrl . '/contacto',
                'lastmod' => $now,
                'changefreq' => 'monthly',
                'priority' => '0.7'
            ],
            [
                'url' => $baseUrl . '/blog',
                'lastmod' => $now,
                'changefreq' => 'daily',
                'priority' => '0.8'
            ]
        ]);

        // Agregar Landings Transaccionales dinámicamente
        if (class_exists(\App\Models\TransactionalLanding::class)) {
            try {
                $landings = \App\Models\TransactionalLanding::where('status', 1)
                    ->select('url', 'updated_at')
                    ->get();
                
                foreach ($landings as $landing) {
                    $urls->push([
                        'url' => $baseUrl . '/' . $landing->url,
                        'lastmod' => $landing->updated_at ? $landing->updated_at->toISOString() : $now,
                        'changefreq' => 'daily',
                        'priority' => '0.8'
                    ]);
                }
            } catch (\Exception $e) {
                $this->warn('No se pudieron cargar las landings: ' . $e->getMessage());
            }
        }
        
        // Agregar posts del blog
        if (class_exists(Post::class)) {
            try {
                $posts = Post::where('status', 1)
                    ->select('slug', 'updated_at')
                    ->get();
                
                foreach ($posts as $post) {
                    $urls->push([
                        'url' => $baseUrl . '/blog/' . $post->slug,
                        'lastmod' => $post->updated_at->toISOString(),
                        'changefreq' => 'monthly',
                        'priority' => '0.6'
                    ]);
                }
            } catch (\Exception $e) {
                $this->warn('No se pudieron cargar los posts: ' . $e->getMessage());
            }
        }
        
       
        
        // Agregar soluciones
        if (class_exists(Solution::class)) {
            try {
                $solutions = Solution::where('status', 1)
                    ->where('visible', 1)
                    ->select('slug', 'updated_at')
                    ->get();
                
                foreach ($solutions as $solution) {
                    $urls->push([
                        'url' => $baseUrl . '/soluciones/' . $solution->slug,
                        'lastmod' => $solution->updated_at->toISOString(),
                        'changefreq' => 'monthly',
                        'priority' => '0.7'
                    ]);
                }
            } catch (\Exception $e) {
                $this->warn('No se pudieron cargar las soluciones: ' . $e->getMessage());
            }
        }

 
        
        return $this->buildXml($urls);
    }
    
    /**
     * Construye el XML del sitemap
     */
    private function buildXml($urls)
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        
        foreach ($urls as $url) {
            $xml .= '    <url>' . "\n";
            $xml .= '        <loc>' . htmlspecialchars($url['url']) . '</loc>' . "\n";
            $xml .= '        <lastmod>' . $url['lastmod'] . '</lastmod>' . "\n";
            $xml .= '        <changefreq>' . $url['changefreq'] . '</changefreq>' . "\n";
            $xml .= '        <priority>' . $url['priority'] . '</priority>' . "\n";
            $xml .= '    </url>' . "\n";
        }
        
        $xml .= '</urlset>';
        
        return $xml;
    }
}
