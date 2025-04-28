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
        Schema::table('courses', function (Blueprint $table) {
            $table->integer('credits')->nullable();        // Số tín chỉ
            $table->integer('total_hours')->nullable();    // Tổng số giờ học
            $table->integer('theory_hours')->nullable();   // Giờ lý thuyết
            $table->integer('practice_hours')->nullable(); // Giờ thực hành/thực tập
            $table->integer('exam_hours')->nullable();     // Giờ thi/kiểm tra
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['credits', 'total_hours', 'theory_hours', 'practice_hours', 'exam_hours']);
        });
    }

};