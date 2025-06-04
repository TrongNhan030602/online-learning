<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlogsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('type')->nullable();         // Loại bài viết, có thể null
            $table->text('summary')->nullable();        // Tóm tắt, có thể null
            $table->timestamp('published_at')->nullable(); // Ngày xuất bản, có thể null
            $table->enum('status', ['draft', 'published'])->default('draft'); // Trạng thái
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('blogs');
    }
}