<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('training_programs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id'); // Khóa ngoại tới khóa học
            $table->string('name'); // Tên chương trình đào tạo
            $table->text('description')->nullable(); // Mô tả chương trình
            $table->integer('duration')->nullable(); // Số ngày/giờ học
            $table->text('requirements')->nullable(); // Yêu cầu đầu vào
            $table->text('objectives')->nullable(); // Mục tiêu khóa học
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('training_programs');
    }
};