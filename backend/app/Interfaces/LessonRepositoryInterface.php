<?php
namespace App\Interfaces;



interface LessonRepositoryInterface
{
    public function getAllLessonsBySessionId(int $courseSessionId);

    public function getLessonById(int $id);

    public function createLesson(array $data);

    public function updateLesson(int $id, array $data);

    public function deleteLesson(int $id);
}