<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('learning_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('program_id')->constrained('training_programs')->onDelete('cascade');
            $table->float('average_score'); // trung bình các môn
            $table->enum('classification', ['excellent', 'good', 'fair', 'average', 'weak']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_results');
    }
};