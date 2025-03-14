<?php

namespace App\Repositories;

use Exception;
use App\Models\Lesson;
use App\Models\Review;
use App\Models\Progress;
use App\Enums\ProgressStatus;
use App\Interfaces\ProgressRepositoryInterface;

class ProgressRepository implements ProgressRepositoryInterface
{
    public function getAllProgress($filters)
    {
        $query = Progress::query();

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }
        if (!empty($filters['course_id'])) {
            $query->where('course_id', $filters['course_id']);
        }
        return $query->get();
    }

    public function getProgressById($id)
    {
        return Progress::findOrFail($id);
    }

    public function createProgress(array $data)
    {
        return Progress::create($data);
    }

    public function updateProgress($id, array $data)
    {
        $progress = Progress::findOrFail($id);

        if (isset($data['status'])) {
            $progress->status = $data['status'];
        }

        if ($data['status'] === ProgressStatus::COMPLETED) {
            $progress->completed = true;
            $progress->completed_at = now();
        }

        $progress->save();
        return $progress;
    }


    public function markLessonComplete($id)
    {
        $progress = Progress::findOrFail($id);
        $progress->status = ProgressStatus::COMPLETED; // Đánh dấu hoàn thành
        $progress->completed = true;  // Cập nhật completed thành true
        $progress->completed_at = now(); // Ghi lại thời gian hoàn thành
        $progress->save();

        return $progress;
    }

    public function getCompletedLessonsByUser($userId)
    {
        return Progress::where('user_id', $userId)
            ->where('completed', true)
            ->get();
    }

    public function calculateCourseCompletion($userId, $courseId)
    {
        $totalLessons = Lesson::where('course_id', $courseId)->count();
        $completedLessons = Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('status', 'completed')
            ->count();

        $completionRate = ($totalLessons > 0) ? ($completedLessons / $totalLessons) * 100 : 0;

        return round($completionRate, 2);
    }

    public function checkUserHasCompletedCourse($userId, $courseId)
    {
        $totalLessons = Lesson::where('course_id', $courseId)->count();
        $completedLessons = Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('status', 'completed')
            ->count();

        return $totalLessons > 0 && $totalLessons == $completedLessons;
    }

    public function submitReview(array $data)
    {
        return Review::create($data);
    }

    public function checkUserHasProgress($userId, $courseId)
    {
        return Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->exists();
    }


    public function getAllUserProgress()
    {
        return Progress::with('user', 'course')->get();
    }
}