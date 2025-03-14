<?php

namespace App\Services;

use Exception;
use App\Enums\ProgressStatus;
use Illuminate\Support\Facades\Log;
use App\Interfaces\ProgressRepositoryInterface;

class ProgressService
{
    protected $progressRepository;

    public function __construct(ProgressRepositoryInterface $progressRepository)
    {
        $this->progressRepository = $progressRepository;
    }

    public function listProgress($filters)
    {
        try {
            return $this->progressRepository->getAllProgress($filters);
        } catch (Exception $e) {
            Log::error("Lỗi khi lấy danh sách tiến độ: " . $e->getMessage());
            throw new Exception("Không thể lấy danh sách tiến độ.");
        }
    }

    public function getProgressById($id)
    {
        try {
            return $this->progressRepository->getProgressById($id);
        } catch (Exception $e) {
            Log::error("Lỗi khi lấy tiến độ ID $id: " . $e->getMessage());
            throw new Exception("Không thể lấy tiến độ học viên.");
        }
    }

    public function createProgress(array $data)
    {
        try {
            $data['status'] = ProgressStatus::IN_PROGRESS;
            return $this->progressRepository->createProgress($data);
        } catch (Exception $e) {
            Log::error("Lỗi khi tạo tiến độ: " . $e->getMessage());
            throw new Exception("Không thể tạo tiến độ học.");
        }
    }

    public function updateProgress($id, array $data)
    {
        try {
            return $this->progressRepository->updateProgress($id, $data);
        } catch (Exception $e) {
            Log::error("Lỗi khi cập nhật tiến độ ID $id: " . $e->getMessage());
            throw new Exception("Không thể cập nhật tiến độ học.");
        }
    }

    public function markLessonComplete($id)
    {
        try {
            return $this->progressRepository->markLessonComplete($id);
        } catch (Exception $e) {
            Log::error("Lỗi khi đánh dấu bài học hoàn thành ID $id: " . $e->getMessage());
            throw new Exception("Không thể đánh dấu bài học hoàn thành.");
        }
    }

    public function getCompletedLessonsByUser($userId)
    {
        try {
            return $this->progressRepository->getCompletedLessonsByUser($userId);
        } catch (Exception $e) {
            Log::error("Lỗi khi lấy danh sách bài học hoàn thành của user ID $userId: " . $e->getMessage());
            throw new Exception("Không thể lấy danh sách bài học hoàn thành.");
        }
    }

    public function calculateCourseCompletion($userId, $courseId)
    {
        try {
            return $this->progressRepository->calculateCourseCompletion($userId, $courseId);
        } catch (Exception $e) {
            Log::error("Lỗi khi tính % hoàn thành khóa học user ID $userId, khóa học ID $courseId: " . $e->getMessage());
            throw new Exception("Không thể tính phần trăm hoàn thành khóa học.");
        }
    }

    public function submitReview($courseId, $userId, array $data)
    {
        if (!$this->progressRepository->checkUserHasProgress($userId, $courseId)) {
            throw new Exception("Bạn chưa tham gia khóa học này, không thể đánh giá.");
        }

        if (!$this->progressRepository->checkUserHasCompletedCourse($userId, $courseId)) {
            throw new Exception("Bạn cần hoàn thành tất cả bài học trước khi đánh giá.");
        }

        if ($data['rating'] < 1 || $data['rating'] > 5) {
            throw new Exception("Rating phải nằm trong khoảng 1 - 5.");
        }

        return $this->progressRepository->submitReview([
            'user_id' => $userId,
            'course_id' => $courseId,
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null, // Cho phép comment có thể null
        ]);
    }


    public function getAllUserProgress()
    {
        try {
            return $this->progressRepository->getAllUserProgress();
        } catch (Exception $e) {
            Log::error("Lỗi khi lấy danh sách tiến độ của tất cả học viên: " . $e->getMessage());
            throw new Exception("Không thể lấy danh sách tiến độ học viên.");
        }
    }
}