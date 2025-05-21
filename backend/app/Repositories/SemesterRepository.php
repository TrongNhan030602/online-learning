<?php
namespace App\Repositories;

use App\Models\Course;
use App\Models\Semester;
use App\Models\SemesterCourse;
use App\Interfaces\SemesterRepositoryInterface;

class SemesterRepository implements SemesterRepositoryInterface
{
    public function createSemester(array $data)
    {
        return Semester::create($data);
    }

    public function getAllSemesters()
    {
        return Semester::with('trainingProgram')->get();
    }

    public function getSemesterById($id)
    {
        return Semester::with('trainingProgram', 'courses')->findOrFail($id);
    }

    public function updateSemester($id, array $data)
    {
        $semester = Semester::findOrFail($id);
        $semester->update($data);
        return $semester;
    }

    public function deleteSemester($id)
    {
        $semester = Semester::findOrFail($id);
        $semester->delete();
        return $semester;
    }

    public function addCoursesToSemester($semesterId, array $courseIds)
    {
        $semester = Semester::findOrFail($semesterId);

        // Lấy danh sách môn đã có để tránh gán trùng
        $existingCourseIds = $semester->courses()->pluck('course_id')->toArray();

        // Lọc ra những course chưa có
        $newCourseIds = array_diff($courseIds, $existingCourseIds);

        // Gán thêm những môn mới
        $semester->courses()->attach($newCourseIds);

        return $semester->load('courses');
    }

    public function removeCoursesFromSemester($semesterId, array $courseIds)
    {
        $semester = Semester::findOrFail($semesterId);
        $semester->courses()->detach($courseIds);
        return $semester->load('courses');
    }
    public function getCoursesBySemester($semesterId)
    {
        $semester = Semester::with('courses')->findOrFail($semesterId);
        return $semester->courses;
    }

    // Phương thức mới để lấy danh sách môn học chưa được gán vào bất kỳ học kỳ nào
    public function getCoursesNotInAnySemester($trainingProgramId)
    {
        // Lấy tất cả học kỳ của chương trình đào tạo
        $semesterIds = Semester::where('training_program_id', $trainingProgramId)->pluck('id');

        // Lấy tất cả các môn học đã được gán vào các học kỳ này
        $assignedCourseIds = SemesterCourse::whereIn('semester_id', $semesterIds)
            ->pluck('course_id')
            ->unique();

        // Lấy tất cả các môn học chưa được gán vào học kỳ nào
        return Course::whereNotIn('id', $assignedCourseIds)->get();
    }
}