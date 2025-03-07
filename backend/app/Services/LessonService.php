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

    public function listLessons($filters)
    {
        try {
            return $this->lessonRepository->getAllLessons($filters);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy danh sách bài học: " . $e->getMessage());
        }
    }

    public function getLessonById($id)
    {
        try {
            return $this->lessonRepository->getLessonById($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy chi tiết bài học: " . $e->getMessage());
        }
    }

    public function createLesson(array $data)
    {
        try {
            return $this->lessonRepository->createLesson($data);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi tạo bài học: " . $e->getMessage());
        }
    }

    public function updateLesson($id, array $data)
    {
        try {
            return $this->lessonRepository->updateLesson($id, $data);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi cập nhật bài học: " . $e->getMessage());
        }
    }

    public function deleteLesson($id)
    {
        try {
            return $this->lessonRepository->deleteLesson($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi xóa bài học: " . $e->getMessage());
        }
    }
}