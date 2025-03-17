<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->integer('usage_limit')->nullable()->after('expires_at'); // Số lần tối đa có thể sử dụng
            $table->integer('times_used')->default(0)->after('usage_limit'); // Số lần đã dùng
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            //
        });
    }
};