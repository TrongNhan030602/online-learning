<?php
namespace App\Repositories;

use App\Models\Lesson;
use App\Interfaces\LessonRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;
class LessonRepository implements LessonRepositoryInterface
{
    public function getAllLessonsBySessionId(int $courseSessionId)
    {
        return Lesson::where('course_session_id', $courseSessionId)->get();
    }

    public function getLessonById($id)
    {
        return Lesson::find($id);
    }

    public function createLesson(array $data)
    {
        // Đảm bảo rằng dữ liệu đã có 'course_session_id' trước khi tạo bài học
        if (!isset($data['course_session_id'])) {
            throw new Exception("Không tìm thấy thông tin buổi học.");
        }

        return Lesson::create($data);
    }


    public function updateLesson(int $id, array $data)
    {
        $lesson = $this->getLessonById($id);

        if (!$lesson) {
            throw new ModelNotFoundException('Bài học không tồn tại.');
        }

        $lesson->update($data);
        return $lesson;
    }

    public function deleteLesson(int $id)
    {
        $lesson = $this->getLessonById($id);

        if (!$lesson) {
            throw new ModelNotFoundException('Bài học không tồn tại.');
        }

        return $lesson->delete();
    }
}