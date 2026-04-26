<?php

namespace App\Console\Commands;

use App\Models\Category;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class FixCategorySlugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:category-slugs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Genera slugs para categorías que no lo tienen';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $categories = Category::whereNull('slug')->orWhere('slug', '')->get();
        
        $this->info("Procesando {$categories->count()} categorías...");

        foreach ($categories as $category) {
            $slugBase = Str::slug($category->name);
            $slug = $slugBase;
            $count = 1;

            // Asegurar que sea único
            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $slugBase . '-' . $count;
                $count++;
            }

            $category->slug = $slug;
            $category->save();
            
            $this->line("Categoría '{$category->name}' actualizada con slug: '{$slug}'");
        }

        $this->info('¡Proceso completado!');
    }
}
