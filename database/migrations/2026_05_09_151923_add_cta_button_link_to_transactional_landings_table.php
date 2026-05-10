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
            $table->string('cta_button_link')->nullable()->after('cta_button_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactional_landings', function (Blueprint $table) {
            $table->dropColumn('cta_button_link');
        });
    }
};
