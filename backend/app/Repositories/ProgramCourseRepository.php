<?php
namespace App\Repositories;

use App\Models\ProgramCourse;
use App\Interfaces\ProgramCourseRepositoryInterface;
use Exception;

class ProgramCourseRepository implements ProgramCourseRepositoryInterface
{
    // Gán môn học vào chương trình đào tạo
    public function assignCourseToProgram(array $data)
    {
        $programCourses = [];

        foreach ($data['courses'] as $courseId) {
            // Kiểm tra nếu môn học đã được gán vào chương trình đào tạo
            $existing = ProgramCourse::where('training_program_id', $data['training_program_id'])
                ->where('course_id', $courseId)
                ->exists();

            if ($existing) {
                continue; // Nếu môn học đã tồn tại, bỏ qua và tiếp tục
            }

            // Nếu môn học chưa được gán vào chương trình, tạo mới
            $programCourses[] = ProgramCourse::create([
                'training_program_id' => $data['training_program_id'],
                'course_id' => $courseId,
            ]);
        }

        return $programCourses;
    }

    public function getCoursesByTrainingProgram(int $trainingProgramId)
    {
        return ProgramCourse::with('course')
            ->where('training_program_id', $trainingProgramId)
            ->get();
    }

    // Xóa môn học khỏi chương trình đào tạo
    public function deleteProgramCourse(int $id)
    {
        $programCourse = ProgramCourse::find($id);
        if (!$programCourse) {
            throw new Exception("Môn học không tồn tại trong chương trình.");
        }
        return $programCourse->delete();
    }
}