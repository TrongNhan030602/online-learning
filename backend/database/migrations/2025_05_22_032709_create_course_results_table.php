<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCourseResultsTable extends Migration
{
    public function up()
    {
        Schema::create('course_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_training_program_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('semester_id')->nullable()->constrained()->onDelete('set null');
            $table->float('average_score')->nullable();
            $table->string('classification')->nullable(); // Optional: excellent, good, etc.
            $table->timestamps();

            $table->unique(['student_training_program_id', 'course_id', 'semester_id'], 'unique_course_result');
        });
    }

    public function down()
    {
        Schema::dropIfExists('course_results');
    }
}