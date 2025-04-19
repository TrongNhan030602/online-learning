<?php

namespace App\Interfaces;

interface ClassSessionRepositoryInterface
{
    public function getAllByClassroomId($classroomId);
    public function create($data);
    public function update($sessionId, $data);
    public function delete($sessionId);

    // Các phương thức liên quan đến bài học
    public function getAvailableLessons($sessionId);
    public function addLessonsToSession($sessionId, array $lessonIds);
    public function removeLessonFromSession($sessionId, $lessonId);
    public function getCurrentLessons($sessionId);
}