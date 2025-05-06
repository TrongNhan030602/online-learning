<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('training_program_banners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_program_id')->constrained()->onDelete('cascade');
            $table->string('title')->nullable();
            $table->string('image_url');
            $table->text('description')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_program_banners');
    }
};