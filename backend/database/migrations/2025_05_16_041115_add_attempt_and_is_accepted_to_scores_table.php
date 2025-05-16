<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('scores', function (Blueprint $table) {
            $table->unsignedTinyInteger('attempt')->default(1)->after('value');
            $table->boolean('is_accepted')->default(true)->after('attempt');
        });
    }

    public function down(): void
    {
        Schema::table('scores', function (Blueprint $table) {
            $table->dropColumn(['attempt', 'is_accepted']);
        });
    }
};