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
            if (!Schema::hasColumn('transactional_landings', 'schema_service_payments_accepted')) {
                $table->string('schema_service_payments_accepted')->nullable()->after('schema_service_description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactional_landings', function (Blueprint $table) {
            $table->dropColumn('schema_service_payments_accepted');
        });
    }
};
