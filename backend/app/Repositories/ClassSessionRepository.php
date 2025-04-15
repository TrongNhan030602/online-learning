<?php // App\Repositories\ClassSessionRepository.php

namespace App\Repositories;

use App\Models\ClassSession;
use App\Models\Lesson;
use App\Interfaces\ClassSessionRepositoryInterface;

class ClassSessionRepository implements ClassSessionRepositoryInterface
{
    public function getAllByClassroomId($classroomId)
    {
        return ClassSession::where('classroom_id', $classroomId)->get();
    }

    public function create($data)
    {
        // Tạo buổi học mới
        $session = ClassSession::create($data);

        // Gắn các bài học vào buổi học nếu có
        if (isset($data['lesson_ids'])) {
            $session->lessons()->attach($data['lesson_ids']);
        }

        return $session;
    }

    public function update($sessionId, $data)
    {
        $session = ClassSession::find($sessionId);
        if ($session) {
            // Cập nhật buổi học
            $session->update($data);

            // Cập nhật các bài học liên quan
            if (isset($data['lesson_ids'])) {
                $session->lessons()->sync($data['lesson_ids']); // Đồng bộ lại các bài học
            }

            return $session;
        }
        return null;
    }

    public function delete($sessionId)
    {
        $session = ClassSession::find($sessionId);
        if ($session) {
            // Xóa mối quan hệ với bài học
            $session->lessons()->detach();
            $session->delete();
            return true;
        }
        return false;
    }

    public function addLessonsToSession($sessionId, $lessonIds)
    {
        $session = ClassSession::find($sessionId);

        if (!$session) {
            return null;
        }

        // Gắn các bài học vào buổi học nếu có
        $session->lessons()->syncWithoutDetaching($lessonIds);

        return $session;
    }
    // Cập nhật các bài học cho buổi học
    public function updateLessons($sessionId, $lessonIds)
    {
        $session = ClassSession::find($sessionId);
        if ($session) {
            // Lấy danh sách các bài học hiện tại của buổi học
            $currentLessonIds = $session->lessons->pluck('id')->toArray();

            // Lọc các bài học mới chưa có trong buổi học (tránh trùng)
            $newLessonIds = array_diff($lessonIds, $currentLessonIds);

            // Đồng bộ lại các bài học (giữ bài học cũ và thêm bài học mới)
            $session->lessons()->sync(array_merge($currentLessonIds, $newLessonIds));

            return $session;
        }
        return null;
    }


    // Xóa một bài học khỏi buổi học
    public function removeLesson($sessionId, $lessonId)
    {
        $session = ClassSession::find($sessionId);
        if ($session) {
            $session->lessons()->detach($lessonId);
            return true;
        }
        return false;
    }
}