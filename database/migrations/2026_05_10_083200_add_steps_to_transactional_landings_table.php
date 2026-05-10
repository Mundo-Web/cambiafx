<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactional_landings', function (Blueprint $table) {
            if (!Schema::hasColumn('transactional_landings', 'steps')) {
                $table->json('steps')->nullable()->after('schema_faq');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactional_landings', function (Blueprint $table) {
            if (Schema::hasColumn('transactional_landings', 'steps')) {
                $table->dropColumn('steps');
            }
        });
    }
};
