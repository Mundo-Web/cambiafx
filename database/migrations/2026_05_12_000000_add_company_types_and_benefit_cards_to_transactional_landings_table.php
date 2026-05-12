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
            $table->json('company_types')->nullable()->after('hero_subtitle');
            $table->json('benefit_cards')->nullable()->after('comparison_cta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactional_landings', function (Blueprint $table) {
            $table->dropColumn(['company_types', 'benefit_cards']);
        });
    }
};
