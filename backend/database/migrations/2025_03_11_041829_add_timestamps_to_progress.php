<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable()->after('last_accessed_at');
            $table->timestamp('updated_at')->nullable()->after('created_at');
        });
    }

    public function down()
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->dropColumn(['created_at', 'updated_at']);
        });
    }
};