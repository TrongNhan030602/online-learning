<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScoresTable extends Migration
{
    public function up()
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // thay student_id bằng user_id
            $table->foreignId('student_training_program_id')->constrained('student_training_programs')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('semester_id')->nullable()->constrained('semesters')->nullOnDelete();

            $table->enum('score_type', ['final', 'quiz', 'midterm', 'assignment'])->default('final');

            $table->decimal('value', 5, 2);

            $table->timestamps();

            // Tạo index cho các cột thường dùng tìm kiếm
            $table->index('user_id');
            $table->index('student_training_program_id');
            $table->index('course_id');
            $table->index('semester_id');
            $table->index('score_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('scores');
    }
}