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
            $table->time('exam_time');
            $table->string('room', 50);
            $table->date('exam_date_second')->nullable();
            $table->time('exam_time_second')->nullable();
            $table->string('exam_type', 50); // hoặc enum nếu bạn muốn kiểm soát
            $table->integer('duration_minutes');
            $table->string('exam_term', 50)->nullable(); // chỉ có khi chương trình có học kỳ
            $table->text('note')->nullable();
        });
    }

    public function down()
    {
        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->dropColumn([
                'exam_time',
                'room',
                'exam_date_second',
                'exam_time_second',
                'exam_type',
                'duration_minutes',
                'exam_term',
                'note'
            ]);
        });
    }

};