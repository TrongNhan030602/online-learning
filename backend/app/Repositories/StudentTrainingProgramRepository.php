<?php

namespace App\Repositories;

use App\Models\User;
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
            ->with(['user', 'trainingProgram', 'fromProgram']) // Sửa lại: dùng 'user' thay vì 'student'
            ->get();
    }

    public function getStudentsNotInProgram(int $trainingProgramId)
    {
        $registeredUserIds = StudentTrainingProgram::where('training_program_id', $trainingProgramId)
            ->pluck('user_id');

        return User::where('role', 'student')
            ->whereNotIn('id', $registeredUserIds)
            ->get();
    }

    public function getById(int $id)
    {
        return StudentTrainingProgram::with(['user', 'trainingProgram', 'fromProgram']) // Sửa lại: dùng 'user'
            ->findOrFail($id);
    }

    public function removeStudentFromProgram(int $userId, int $trainingProgramId)
    {
        $studentTrainingProgram = StudentTrainingProgram::where('user_id', $userId)
            ->where('training_program_id', $trainingProgramId)
            ->first();

        if ($studentTrainingProgram) {
            $studentTrainingProgram->delete();
            return true;
        }

        return false;
    }

    // Kiểm tra xem sinh viên có thuộc chương trình đào tạo trước đó hay không
    public function checkPreviousProgram(int $userId, int $fromProgramId)
    {
        return StudentTrainingProgram::where('user_id', $userId)
            ->where('training_program_id', $fromProgramId)
            ->exists();
    }

    public function getPreviousPrograms(int $userId)
    {
        return StudentTrainingProgram::with([
            'trainingProgram' => function ($query) {
                $query->select('id', 'name', 'level', 'code');
            }
        ])
            ->where('user_id', $userId)
            ->whereHas('trainingProgram', function ($query) {
                $query->whereIn('level', ['certificate', 'intermediate', 'college']);
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }
}