<?php

namespace App\Repositories;

use App\Models\ExemptCourse;
use App\Interfaces\ExemptCourseRepositoryInterface;

class ExemptCourseRepository implements ExemptCourseRepositoryInterface
{
    // Thêm môn miễn cho học viên
    public function create(array $data)
    {
        return ExemptCourse::create($data);
    }

    // Lấy danh sách môn miễn của học viên
    public function getByStudentId($studentId)
    {
        return ExemptCourse::where('student_id', $studentId)
            ->with('course', 'fromProgram', 'toProgram')
            ->get();
    }

    // Kiểm tra môn học có được miễn cho học viên không
    public function isExempt($studentId, $courseId)
    {
        return ExemptCourse::where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->exists();
    }
}