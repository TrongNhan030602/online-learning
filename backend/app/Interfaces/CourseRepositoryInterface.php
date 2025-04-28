<?php
namespace App\Interfaces;



interface CourseRepositoryInterface
{
    public function getAllCourses();

    public function getCourseById(int $id);

    public function createCourse(array $data);

    public function updateCourse(int $id, array $data);

    public function updateStatus(int $id, string $status);

    public function deleteCourse(int $id);
}