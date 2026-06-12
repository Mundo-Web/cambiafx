<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaign_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transactional_landing_id')->nullable();
            $table->string('campaign_name')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->boolean('status')->default(true);
            $table->timestamps();

            $table->foreign('transactional_landing_id')->references('id')->on('transactional_landings')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_subscriptions');
    }
};
