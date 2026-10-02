<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('post_newsletter_campaigns', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->uuid('post_id')->index();
            $table->unsignedInteger('total_subscribers')->default(0);
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('failed_count')->default(0);
            $table->unsignedInteger('daily_limit')->default(5000);
            $table->enum('target_order', ['recent', 'oldest'])->default('recent');
            $table->enum('status', ['pending', 'processing', 'paused', 'completed', 'cancelled'])->default('pending');
            $table->uuid('last_processed_subscription_id')->nullable();
            $table->timestamp('last_sent_at')->nullable();
            $table->timestamp('next_batch_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });

        Schema::create('post_newsletter_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('campaign_id')->index();
            $table->uuid('post_id')->index();
            $table->uuid('subscription_id')->index();
            $table->string('email');
            $table->enum('status', ['sent', 'failed'])->default('sent');
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->unique(['post_id', 'subscription_id'], 'post_subscription_unique');
            $table->foreign('campaign_id')->references('id')->on('post_newsletter_campaigns')->onDelete('cascade');
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_newsletter_logs');
        Schema::dropIfExists('post_newsletter_campaigns');
    }
};
