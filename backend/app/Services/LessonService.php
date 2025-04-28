<?php
namespace App\Services;

use App\Interfaces\LessonRepositoryInterface;
use Exception;

class LessonService
{
    protected $lessonRepository;

    public function __construct(LessonRepositoryInterface $lessonRepository)
    {
        $this->lessonRepository = $lessonRepository;
    }

    public function getAllLessonsBySessionId(int $courseSessionId)
    {
        return $this->lessonRepository->getAllLessonsBySessionId($courseSessionId);
    }

    public function getLessonById(int $id)
    {
        return $this->lessonRepository->getLessonById($id);
    }

    public function createLesson(array $data)
    {
        return $this->lessonRepository->createLesson($data);
    }

    public function updateLesson(int $id, array $data)
    {
        return $this->lessonRepository->updateLesson($id, $data);
    }

    public function deleteLesson(int $id)
    {
        return $this->lessonRepository->deleteLesson($id);
    }
}