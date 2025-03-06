<?php

namespace App\Interfaces;

interface CourseRepositoryInterface
{
    public function getAllCourses($filters);
    public function getCourseById($id);
    public function createCourse(array $data);
    public function updateCourse($id, array $data);
    public function deleteCourse($id);
}