<?php
namespace App\Repositories;

use App\Models\Course;
use App\Interfaces\CourseRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CourseRepository implements CourseRepositoryInterface
{
    public function getAllCourses()
    {
        return Course::all();
    }

    public function getCourseById($id)
    {
        return Course::find($id);  // Truyền id trực tiếp vào đây
    }


    public function createCourse(array $data)
    {
        return Course::create($data);
    }

    public function updateCourse(int $id, array $data)
    {
        $course = $this->getCourseById($id);

        if (!$course) {
            throw new ModelNotFoundException('Môn học không tồn tại.');
        }

        $course->update($data);
        return $course;
    }

    public function updateStatus(int $id, string $status)
    {
        $course = $this->getCourseById($id);

        if (!$course) {
            throw new ModelNotFoundException('Môn học không tồn tại.');
        }

        // Chuyển đổi trạng thái từ 'active'/'inactive' thành 1/0
        $course->is_active = ($status == 'active') ? 1 : 0;

        // Lưu thay đổi vào CSDL
        $course->save();

        return $course;
    }


    public function deleteCourse(int $id)
    {
        $course = $this->getCourseById($id);

        if (!$course) {
            throw new ModelNotFoundException('Môn học không tồn tại.');
        }

        return $course->delete();
    }
}