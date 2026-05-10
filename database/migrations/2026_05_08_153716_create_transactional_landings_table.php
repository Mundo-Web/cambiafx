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
        Schema::create('transactional_landings', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('url')->unique(); // e.g., soles-a-dolares
            $blueprint->string('name'); // Internal name
            
            // SEO
            $blueprint->string('h1')->nullable();
            $blueprint->string('meta_title')->nullable();
            $blueprint->text('meta_description')->nullable();
            $blueprint->text('meta_keywords')->nullable();
            
            // Hero Content
            $blueprint->string('hero_eyebrow')->nullable();
            $blueprint->string('hero_title')->nullable();
            $blueprint->text('hero_subtitle')->nullable();
            
            // Comparison Section
            $blueprint->string('comparison_title')->nullable();
            $blueprint->text('comparison_subtitle')->nullable();
            $blueprint->string('comparison_cta')->nullable();
            
            // Steps Section
            $blueprint->string('steps_title')->nullable();
            $blueprint->string('steps_subtitle')->nullable();
            
            // CTA Final Section
            $blueprint->string('cta_title')->nullable();
            $blueprint->text('cta_subtitle')->nullable();
            $blueprint->string('cta_button_text')->nullable();
            $blueprint->string('cta_image')->nullable();
            
            // Schema / SEO Advanced
            $blueprint->string('schema_service_name')->nullable();
            $blueprint->text('schema_service_description')->nullable();
            $blueprint->json('schema_faq')->nullable();

            // JSON Fields
            $blueprint->json('stats')->nullable(); // [{label, value}]
            $blueprint->json('comparison_data')->nullable(); // [{entity, buy, sell, diff}]
            
            // Config
            $blueprint->boolean('status')->default(true);
            $blueprint->uuid('lang_id')->nullable()->constrained('langs')->onDelete('cascade');
            
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactional_landings');
    }
};
