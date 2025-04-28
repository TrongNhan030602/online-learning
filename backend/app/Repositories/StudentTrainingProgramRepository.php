<?php
namespace App\Repositories;

use App\Models\StudentTrainingProgram;
use App\Interfaces\StudentTrainingProgramRepositoryInterface;

class StudentTrainingProgramRepository implements StudentTrainingProgramRepositoryInterface
{
    public function create(array $data)
    {
        return StudentTrainingProgram::create($data);
    }

    public function getStudentsByTrainingProgramId(int $trainingProgramId)
    {
        return StudentTrainingProgram::where('training_program_id', $trainingProgramId)
            ->with('student') // Thêm mối quan hệ với bảng users để lấy thông tin học viên
            ->get();
    }

    public function getById(int $id)
    {
        return StudentTrainingProgram::with(['student', 'trainingProgram', 'fromProgram'])->findOrFail($id);
    }
    public function removeStudentFromProgram(int $studentId, int $trainingProgramId)
    {
        $studentTrainingProgram = StudentTrainingProgram::where('student_id', $studentId)
            ->where('training_program_id', $trainingProgramId)
            ->first();

        if ($studentTrainingProgram) {
            $studentTrainingProgram->delete();
            return true;
        }

        return false; // Nếu không tìm thấy học viên trong chương trình
    }
}