<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_program_id')->nullable();
            $table->string('title');
            $table->text('body');
            $table->string('type')->default('general'); // Ví dụ: general | exam | announcement
            $table->timestamps();

            $table->foreign('training_program_id')
                ->references('id')->on('training_programs')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};