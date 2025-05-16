<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ReCreateLearningResultsTable extends Migration
{
    public function up()
    {
        Schema::create('learning_results', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_training_program_id')->constrained()->onDelete('cascade');
            $table->foreignId('program_id')->constrained('training_programs')->onDelete('cascade');
            $table->string('program_level'); // college | intermediate | certificate | specialized | software

            $table->foreignId('semester_id')->nullable()->constrained()->onDelete('set null');

            $table->decimal('average_score', 5, 2)->nullable();
            $table->enum('classification', ['excellent', 'good', 'average', 'poor'])->nullable();

            $table->enum('completion_status', ['completed', 'incomplete'])->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('learning_results');
    }
}