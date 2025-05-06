<?php

namespace App\Repositories;

use App\Models\ExemptCourse;
use App\Models\StudentTrainingProgram;
use App\Models\ProgramCourse;
use App\Interfaces\ExemptCourseRepositoryInterface;

class ExemptCourseRepository implements ExemptCourseRepositoryInterface
{
    public function create(array $data)
    {
        return ExemptCourse::create($data);
    }

    public function getByStudentId($studentId)
    {
        return ExemptCourse::where('student_id', $studentId)
            ->with('course', 'fromProgram', 'toProgram')
            ->get();
    }

    public function isExempt($studentId, $courseId)
    {
        return ExemptCourse::where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->exists();
    }

    //  Kiểm tra học viên có học chương trình đào tạo không
    public function isStudentEnrolledInProgram($studentId, $programId)
    {
        return StudentTrainingProgram::where('student_id', $studentId)
            ->where('training_program_id', $programId)
            ->exists();
    }

    //  Kiểm tra môn học có thuộc chương trình đào tạo không
    public function isCourseInProgram($courseId, $programId)
    {
        return ProgramCourse::where('course_id', $courseId)
            ->where('training_program_id', $programId)
            ->exists();
    }
}