<?php

namespace App\Repositories;

use App\Interfaces\LessonRepositoryInterface;
use App\Models\Lesson;
use Illuminate\Support\Facades\Storage;
use Exception;

class LessonRepository implements LessonRepositoryInterface
{
    public function getAllLessons($filters)
    {
        try {
            $query = Lesson::query();
            if (!empty($filters['course_id'])) {
                $query->where('course_id', $filters['course_id']);
            }
            // Sắp xếp theo trường order để định nghĩa thứ tự bài học
            $query->orderBy('order');
            return $query->get();
        } catch (Exception $e) {
            throw new Exception("Lỗi trong quá trình truy vấn bài học: " . $e->getMessage());
        }
    }

    public function getLessonById($id)
    {
        return Lesson::findOrFail($id);
    }

    public function createLesson(array $data)
    {
        return Lesson::create($data);
    }

    public function updateLesson($id, array $data)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->update($data);
        return $lesson->fresh();
    }

    public function deleteLesson($id)
    {
        $lesson = Lesson::findOrFail($id);
        // Nếu bài học có tài liệu, xóa file khỏi storage
        if ($lesson->document) {
            Storage::disk('public')->delete($lesson->document);
        }
        return $lesson->delete();
    }
}