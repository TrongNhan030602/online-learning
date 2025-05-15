<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('semester_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('training_program_id')->nullable()->constrained()->onDelete('set null');

            $table->enum('exam_type', ['midterm', 'final']);

            $table->date('exam_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedInteger('duration_minutes'); // Thời lượng thi

            $table->date('retake_exam_date')->nullable();      // Ngày thi lại (dự kiến)
            $table->time('retake_start_time')->nullable();     // Giờ bắt đầu thi lại
            $table->time('retake_end_time')->nullable();       // Giờ kết thúc thi lại

            $table->string('location');
            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_schedules');
    }
};