<?php

namespace App\Repositories;

use App\Interfaces\CourseRepositoryInterface;
use App\Models\Course;
use Illuminate\Support\Facades\Storage;
use Exception;

class CourseRepository implements CourseRepositoryInterface
{
    public function getAllCourses($filters)
    {
        try {
            $query = Course::query();

            if (!empty($filters['title'])) {
                $query->where('title', 'LIKE', "%{$filters['title']}%");
            }

            return $query->get();
        } catch (Exception $e) {
            throw new Exception("Lỗi trong quá trình truy vấn khóa học: " . $e->getMessage());
        }
    }

    public function getCourseById($id)
    {
        return Course::with(['files', 'lessons.selectedFiles'])->findOrFail($id);
    }


    public function createCourse(array $data)
    {
        return Course::create($data);
    }

    public function updateCourse($id, array $data)
    {
        $course = Course::findOrFail($id);
        $course->update($data);
        return $course->fresh();
    }


    public function deleteCourse($id)
    {
        $course = Course::findOrFail($id);

        // Xóa các file liên quan từ storage nếu có quan hệ files
        if ($course->files) {
            foreach ($course->files as $file) {
                Storage::disk('public')->delete($file->file_path);
            }
        }

        return $course->delete();
    }
}