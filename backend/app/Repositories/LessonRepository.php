<?php

namespace App\Repositories;

use Exception;
use App\Models\Lesson;
use Illuminate\Support\Str;
use App\Models\LessonDocument;
use Illuminate\Support\Facades\Storage;
use App\Interfaces\LessonRepositoryInterface;

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
    // Lưu nhiều tài liệu cho bài học
    // Lưu nhiều tài liệu cho bài học
    public function addDocumentsToLesson($lessonId, array $documents)
    {
        $lesson = Lesson::findOrFail($lessonId);
        $lessonTitleSlug = Str::slug($lesson->title); // Chuyển tiêu đề bài học thành slug

        foreach ($documents as $document) {
            $originalFileName = pathinfo($document->getClientOriginalName(), PATHINFO_FILENAME); // Lấy tên file gốc
            $fileExtension = $document->getClientOriginalExtension(); // Lấy đuôi file

            // Tạo tên file theo định dạng: {slug-bai-hoc}-{slug-file-goc}.{duoi-file}
            $newFileName = "{$lessonTitleSlug}-" . Str::slug($originalFileName) . ".{$fileExtension}";

            // Lưu tài liệu vào storage với tên mới
            $path = $document->storeAs('lesson_documents', $newFileName, 'public');

            // Lưu thông tin tài liệu vào bảng lesson_documents
            LessonDocument::create([
                'lesson_id' => $lesson->id,
                'file_path' => $path,
                'file_type' => $fileExtension, // Lưu loại tài liệu
            ]);
        }

        return $lesson->load('documents'); // Load lại tài liệu đã được thêm
    }

    public function deleteDocument($lessonId, $documentId)
    {
        // Tìm tài liệu theo lessonId và documentId
        $document = LessonDocument::where('lesson_id', $lessonId)
            ->where('id', $documentId)
            ->firstOrFail();

        // Xóa file khỏi storage
        Storage::disk('public')->delete($document->file_path);

        // Xóa tài liệu khỏi database
        $document->delete();

        return true;
    }
}