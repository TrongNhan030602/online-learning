<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReExamRegistrationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('re_exam_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')
                ->constrained('users')  // Liên kết với bảng users
                ->onDelete('cascade');  // Xóa khi học viên bị xóa
            $table->foreignId('course_id')
                ->constrained('courses')  // Liên kết với bảng courses
                ->onDelete('cascade');  // Xóa khi môn học bị xóa
            $table->foreignId('exam_schedule_id')
                ->constrained('exam_schedules')  // Liên kết với bảng exam_schedules
                ->onDelete('cascade');  // Xóa khi lịch thi bị xóa
            $table->date('registration_date');  // Ngày đăng ký thi lại
            $table->text('reason')->nullable();  // Lý do đăng ký thi lại
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');  // Trạng thái đăng ký thi lại
            $table->timestamps();  // Thời gian tạo và cập nhật
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('re_exam_registrations');
    }
}