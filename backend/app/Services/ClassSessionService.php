<?php

namespace App\Services;

use App\Interfaces\ClassSessionRepositoryInterface;

class ClassSessionService
{
    protected $classSessionRepository;

    public function __construct(ClassSessionRepositoryInterface $classSessionRepository)
    {
        $this->classSessionRepository = $classSessionRepository;
    }

    public function getSessionsByClassroomId($classroomId)
    {
        return $this->classSessionRepository->getAllByClassroomId($classroomId);
    }

    public function createSession($classroomId, $data)
    {
        $data['classroom_id'] = $classroomId;
        return $this->classSessionRepository->create($data);
    }

    public function updateSession($sessionId, $data)
    {
        return $this->classSessionRepository->update($sessionId, $data);
    }

    public function deleteSession($sessionId)
    {
        return $this->classSessionRepository->delete($sessionId);
    }
    public function addLessonsToSession($sessionId, $lessonIds)
    {
        return $this->classSessionRepository->addLessonsToSession($sessionId, $lessonIds);
    }
    // Cập nhật bài học cho buổi học
    public function updateLessons($sessionId, $lessonIds)
    {
        return $this->classSessionRepository->updateLessons($sessionId, $lessonIds);
    }

    // Xóa một bài học khỏi buổi học
    public function removeLesson($sessionId, $lessonId)
    {
        return $this->classSessionRepository->removeLesson($sessionId, $lessonId);
    }
}