<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassSessionLessonTable extends Migration
{
    public function up()
    {
        Schema::create('class_session_lesson', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade'); // Liên kết đến bảng lessons
            $table->foreignId('class_session_id')->constrained()->onDelete('cascade'); // Liên kết đến bảng class_sessions
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('class_session_lesson');
    }
}