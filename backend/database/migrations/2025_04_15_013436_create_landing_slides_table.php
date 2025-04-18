<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_landing_slides_table.php
    public function up()
    {
        Schema::create('landing_slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_program_id')->constrained()->onDelete('cascade');
            $table->string('image_url');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_slides');
    }
};