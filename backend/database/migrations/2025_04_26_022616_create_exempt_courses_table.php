<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exempt_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_program_id')->constrained('training_programs')->onDelete('cascade');
            $table->foreignId('to_program_id')->constrained('training_programs')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['student_id', 'course_id', 'from_program_id', 'to_program_id'], 'exempt_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exempt_courses');
    }
};