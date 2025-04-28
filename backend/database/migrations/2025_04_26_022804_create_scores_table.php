<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->decimal('value', 5, 2); // ví dụ: 8.50
            $table->enum('score_type', ['final', 'quiz', 'midterm', 'assignment'])->default('final');
            $table->timestamps();

            $table->unique(['student_id', 'course_id', 'score_type'], 'unique_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};