<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->string('category')->nullable()->after('answer'); // Danh mục câu hỏi
            $table->tinyInteger('status')->default(1)->after('category'); // 1 = Hiển thị, 0 = Ẩn
            $table->integer('priority')->default(0)->after('status'); // Mức độ ưu tiên
        });
    }

    public function down()
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn(['category', 'status', 'priority']);
        });
    }
};