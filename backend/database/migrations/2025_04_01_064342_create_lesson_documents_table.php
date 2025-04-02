<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLessonDocumentsTable extends Migration
{
    public function up()
    {
        Schema::create('lesson_documents', function (Blueprint $table) {
            $table->id(); // ID tài liệu
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade'); // Liên kết với bài học
            $table->string('file_path'); // Đường dẫn đến tài liệu
            $table->string('file_type'); // Loại tài liệu (PDF, DOCX, v.v.)
            $table->timestamps(); // Thời gian tạo và cập nhật
        });
    }

    public function down()
    {
        Schema::dropIfExists('lesson_documents');
    }
}