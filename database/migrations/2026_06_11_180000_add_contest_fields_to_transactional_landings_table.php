<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactional_landings', function (Blueprint $table) {
            $table->string('hero_image')->nullable()->after('hero_subtitle');
            $table->char('coupon_id', 36)->nullable()->after('hero_image');
            $table->string('campaign_name')->nullable()->after('coupon_id');
            
            $table->string('terms_title')->nullable()->after('benefit_cards');
            $table->string('terms_subtitle')->nullable()->after('terms_title');
            $table->longText('terms_content')->nullable()->after('terms_subtitle');
            $table->text('terms_footer')->nullable()->after('terms_content');
            
            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('transactional_landings', function (Blueprint $table) {
            $table->dropForeign(['coupon_id']);
            $table->dropColumn([
                'hero_image',
                'coupon_id',
                'campaign_name',
                'terms_title',
                'terms_subtitle',
                'terms_content',
                'terms_footer',
            ]);
        });
    }
};
