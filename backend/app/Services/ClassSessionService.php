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

    // Lấy danh sách bài học có sẵn cho buổi học
    public function getAvailableLessons($sessionId)
    {
        return $this->classSessionRepository->getAvailableLessons($sessionId);
    }
    public function getCurrentLessons($sessionId)
    {
        return $this->classSessionRepository->getCurrentLessons($sessionId);
    }

    // Thêm bài học vào buổi học
    public function addLessonsToSession($sessionId, array $lessonIds)
    {
        return $this->classSessionRepository->addLessonsToSession($sessionId, $lessonIds);
    }

    // Xóa bài học khỏi buổi học
    public function removeLessonFromSession($sessionId, $lessonId)
    {
        return $this->classSessionRepository->removeLessonFromSession($sessionId, $lessonId);
    }
}