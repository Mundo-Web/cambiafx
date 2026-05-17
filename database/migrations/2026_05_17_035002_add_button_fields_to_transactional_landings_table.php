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
            $table->string('hero_button_text')->nullable();
            $table->string('hero_button_link')->nullable();
            $table->string('comparison_button_text')->nullable();
            $table->string('comparison_button_link')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactional_landings', function (Blueprint $table) {
            $table->dropColumn(['hero_button_text', 'hero_button_link', 'comparison_button_text', 'comparison_button_link']);
        });
    }
};
