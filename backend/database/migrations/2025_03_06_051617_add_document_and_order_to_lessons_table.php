<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDocumentAndOrderToLessonsTable extends Migration
{
    public function up()
    {
        Schema::table('lessons', function (Blueprint $table) {
            // Thêm cột 'document' để lưu đường dẫn file (ví dụ: PDF, video), có thể để null nếu không có tài liệu
            $table->string('document')->nullable()->after('video_url');
            // Thêm cột 'order' để xác định thứ tự bài học, mặc định là 1
            $table->integer('order')->default(1)->after('document');
        });
    }

    public function down()
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('order');
            $table->dropColumn('document');
        });
    }
}