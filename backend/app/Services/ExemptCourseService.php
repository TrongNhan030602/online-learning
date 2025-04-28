<?php

namespace App\Services;

use App\Interfaces\ExemptCourseRepositoryInterface;

class ExemptCourseService
{
    protected $repository;

    public function __construct(ExemptCourseRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    // Thêm môn miễn cho học viên
    public function addExemptCourse(array $data)
    {
        return $this->repository->create($data);
    }

    // Lấy danh sách môn miễn của học viên
    public function getExemptCoursesForStudent($studentId)
    {
        return $this->repository->getByStudentId($studentId);
    }

    // Kiểm tra môn học có được miễn cho học viên không
    public function checkIfExempt($studentId, $courseId)
    {
        return $this->repository->isExempt($studentId, $courseId);
    }
}