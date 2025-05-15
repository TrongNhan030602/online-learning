<?php

namespace App\Interfaces;

interface ExamScheduleInterface
{
    // ADMIN - Quản lý lịch thi
    public function getAll(array $filters = []); // Lấy tất cả lịch thi, có thể lọc theo chương trình, học kỳ, môn học, loại thi, ngày thi
    public function getById($id);                // Lấy chi tiết lịch thi theo ID
    public function create(array $data);         // Tạo lịch thi mới
    public function update($id, array $data);    // Cập nhật thông tin lịch thi
    public function delete($id);                 // Xóa lịch thi

    // STUDENT - Học viên
    public function getSchedulesForStudent($studentId);  // Lấy lịch thi cho học viên, tính theo tất cả các chương trình đào tạo học viên tham gia
    public function getUpcomingForStudent($studentId);   // Lấy lịch thi sắp tới cho học viên (ví dụ: 7 ngày tới)
    public function getCourseScheduleForStudent($studentId, $courseId); // Lấy lịch thi của môn cụ thể cho học viên
    public function getRetakeScheduleForStudent($studentId, $courseId); // Lấy lịch thi lại cho học viên, nếu có
}