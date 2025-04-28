<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('program_id')->constrained('training_programs')->onDelete('cascade');
            $table->date('issue_date')->nullable();
            $table->enum('degree_type', ['certificate', 'trung_cap', 'cao_dang', 'specialized', 'software']);
            $table->timestamps();

            $table->unique(['student_id', 'program_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};