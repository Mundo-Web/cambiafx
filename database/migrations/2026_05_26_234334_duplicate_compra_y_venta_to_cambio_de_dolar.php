<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\TransactionalLanding;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $original = TransactionalLanding::where('url', 'compra-y-venta-de-dolares')->first();
        if ($original) {
            // Check if it already exists to avoid duplicates
            $exists = TransactionalLanding::where('url', 'cambio-de-dolar')->exists();
            if (!$exists) {
                $new = $original->replicate();
                $new->url = 'cambio-de-dolar';
                $new->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        TransactionalLanding::where('url', 'cambio-de-dolar')->delete();
    }
};
