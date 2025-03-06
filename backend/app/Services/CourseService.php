<?php

namespace App\Services;

use App\Interfaces\CourseRepositoryInterface;
use Exception;

class CourseService
{
    protected $courseRepository;

    public function __construct(CourseRepositoryInterface $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function listCourses($filters)
    {
        try {
            return $this->courseRepository->getAllCourses($filters);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy danh sách khóa học: " . $e->getMessage());
        }
    }

    public function createNewCourse($data)
    {
        try {
            return $this->courseRepository->createCourse($data);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi tạo khóa học: " . $e->getMessage());
        }
    }

    public function updateExistingCourse($id, $data)
    {
        try {
            return $this->courseRepository->updateCourse($id, $data);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi cập nhật khóa học: " . $e->getMessage());
        }
    }

    public function deleteCourseById($id)
    {
        try {
            return $this->courseRepository->deleteCourse($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi xóa khóa học: " . $e->getMessage());
        }
    }
}