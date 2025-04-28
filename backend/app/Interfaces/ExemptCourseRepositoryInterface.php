<?php

namespace App\Interfaces;

interface ExemptCourseRepositoryInterface
{
    // Thêm môn miễn cho học viên
    public function create(array $data);

    // Lấy danh sách môn miễn của học viên
    public function getByStudentId($studentId);

    // Kiểm tra môn học có được miễn cho học viên không
    public function isExempt($studentId, $courseId);
}