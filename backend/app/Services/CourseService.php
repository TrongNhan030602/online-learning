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

    public function getAllCourses()
    {
        return $this->courseRepository->getAllCourses();
    }

    public function getCourseById($id)
    {
        return $this->courseRepository->getCourseById($id);
    }

    public function createCourse(array $data)
    {
        return $this->courseRepository->createCourse($data);
    }

    public function updateCourse($id, array $data)
    {
        return $this->courseRepository->updateCourse($id, $data);
    }

    public function updateStatus($id, $status)
    {
        return $this->courseRepository->updateStatus($id, $status);
    }

    public function deleteCourse($id)
    {
        return $this->courseRepository->deleteCourse($id);
    }

    //For Student
    public function getLearningDetail($id)
    {
        return $this->courseRepository->getLearningDetail($id);
    }

}