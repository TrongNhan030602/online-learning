<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->unsignedBigInteger('program_id')->nullable(); // Thêm trường program_id
            $table->foreign('program_id')->references('id')->on('training_programs')->onDelete('set null'); // Tạo quan hệ với bảng training_programs
        });
    }

    public function down()
    {
        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->dropForeign(['program_id']); // Xóa khóa ngoại
            $table->dropColumn('program_id'); // Xóa trường program_id
        });
    }
};