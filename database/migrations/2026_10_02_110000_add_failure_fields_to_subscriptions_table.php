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
        Schema::table('subscriptions', function (Blueprint $table) {
            if (!Schema::hasColumn('subscriptions', 'last_error')) {
                $table->text('last_error')->nullable()->after('status');
            }
            if (!Schema::hasColumn('subscriptions', 'failed_at')) {
                $table->timestamp('failed_at')->nullable()->after('last_error');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            if (Schema::hasColumn('subscriptions', 'failed_at')) {
                $table->dropColumn('failed_at');
            }
            if (Schema::hasColumn('subscriptions', 'last_error')) {
                $table->dropColumn('last_error');
            }
        });
    }
};
