<?php

namespace App\Services;

use App\Interfaces\ExemptCourseRepositoryInterface;
use Illuminate\Validation\ValidationException;

class ExemptCourseService
{
    protected $repository;

    public function __construct(ExemptCourseRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function addExemptCourse(array $data)
    {
        // Check đã miễn chưa
        if ($this->repository->isExempt($data['student_id'], $data['course_id'])) {
            throw ValidationException::withMessages(['course_id' => 'Học viên đã được miễn môn học này.']);
        }

        // Check học viên đã đăng ký chương trình mới
        if (!$this->repository->isStudentEnrolledInProgram($data['student_id'], $data['to_program_id'])) {
            throw ValidationException::withMessages(['to_program_id' => 'Học viên chưa đăng ký chương trình đào tạo.']);
        }

        // Check môn học có thuộc chương trình cũ
        if (!$this->repository->isCourseInProgram($data['course_id'], $data['from_program_id'])) {
            throw ValidationException::withMessages(['course_id' => 'Môn học không thuộc chương trình đào tạo trước đó.']);
        }

        return $this->repository->create($data);
    }

    public function getExemptCoursesForStudent($studentId)
    {
        return $this->repository->getByStudentId($studentId);
    }

    public function checkIfExempt($studentId, $courseId)
    {
        return $this->repository->isExempt($studentId, $courseId);
    }
}