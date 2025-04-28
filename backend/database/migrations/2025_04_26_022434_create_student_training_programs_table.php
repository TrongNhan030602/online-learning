<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_training_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('training_program_id')->constrained()->onDelete('cascade');
            $table->enum('entry_type', ['default', 'lien_thong', 'van_bang_2'])->default('default');
            $table->foreignId('from_program_id')->nullable()->constrained('training_programs')->onDelete('set null');
            $table->timestamps();

            $table->unique(['student_id', 'training_program_id']); // mỗi sinh viên chỉ đăng ký 1 lần CTĐT
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_training_programs');
    }
};