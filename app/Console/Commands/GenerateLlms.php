<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Admin\GeneralController;
use Illuminate\Support\Facades\Log;

class GenerateLlms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'llms:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Genera y actualiza automáticamente los archivos llms.txt y llms-full.txt con tipo de cambio en tiempo real y enlaces canónicos.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Iniciando generación de llms.txt y llms-full.txt...');

        try {
            $controller = new GeneralController();
            $controller->createLlmsFiles();

            $this->info('Archivos llms.txt y llms-full.txt actualizados exitosamente en public/.');
            Log::info('Cron/Artisan: llms.txt y llms-full.txt actualizados automáticamente.');
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Error al generar llms.txt: ' . $e->getMessage());
            Log::error('Cron/Artisan error al generar llms.txt: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
