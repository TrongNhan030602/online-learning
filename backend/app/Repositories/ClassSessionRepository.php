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

    // Lấy danh sách bài học có sẵn cho buổi học
    public function getAvailableLessons($sessionId)
    {
        $session = ClassSession::find($sessionId);
        if (!$session) {
            return null;
        }

        $courseId = $session->classroom->course_id;
        return Lesson::where('course_id', $courseId)
            ->whereNotIn('id', $session->lessons->pluck('id'))
            ->get();
    }

    // Thêm các bài học vào buổi học
    public function addLessonsToSession($sessionId, array $lessonIds)
    {
        $session = ClassSession::find($sessionId);
        if (!$session) {
            return false;
        }

        $session->lessons()->attach($lessonIds);
        return true;
    }

    // Xóa bài học khỏi buổi học
    public function removeLessonFromSession($sessionId, $lessonId)
    {
        $session = ClassSession::find($sessionId);
        if (!$session) {
            return false;
        }

        $session->lessons()->detach($lessonId);
        return true;
    }
    // Lấy danh sách bài học đã có trong buổi học
    public function getCurrentLessons($sessionId)
    {
        $session = ClassSession::find($sessionId);
        if (!$session) {
            return null;
        }

        return $session->lessons; // Trả về danh sách bài học đã có
    }

}