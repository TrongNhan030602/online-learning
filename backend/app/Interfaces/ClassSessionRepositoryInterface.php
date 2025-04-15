<?php

namespace App\Interfaces;

interface ClassSessionRepositoryInterface
{
    public function getAllByClassroomId($classroomId);
    public function create($data);
    public function update($sessionId, $data);
    public function delete($sessionId);
    public function addLessonsToSession($sessionId, $lessonIds);
    public function updateLessons($sessionId, $lessonIds);
    public function removeLesson($sessionId, $lessonId);

}