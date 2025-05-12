<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDisciplineScoresTable extends Migration
{
    public function up()
    {
        Schema::create('discipline_scores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_training_program_id'); // Liên kết với bảng student_training_programs
            $table->unsignedBigInteger('semester_id');
            $table->float('score');
            $table->text('evaluation')->nullable();
            $table->timestamps();

            // Thiết lập khóa ngoại
            $table->foreign('student_training_program_id')->references('id')->on('student_training_programs')->onDelete('cascade');
            $table->foreign('semester_id')->references('id')->on('semesters')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('discipline_scores');
    }
}