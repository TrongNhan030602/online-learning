<?php

namespace App\Interfaces;

interface LessonRepositoryInterface
{
    public function getAllLessons($filters);
    public function getLessonById($id);
    public function createLesson(array $data);
    public function updateLesson($id, array $data);
    public function deleteLesson($id);
}