<?php

namespace App\Repositories;

use App\Interfaces\TrainingProgramRepositoryInterface;
use App\Models\TrainingProgram;

class TrainingProgramRepository implements TrainingProgramRepositoryInterface
{
    public function getByCourseId($courseId)
    {
        return TrainingProgram::where('course_id', $courseId)->first();
    }


    public function getAll()
    {
        return TrainingProgram::all();
    }

    public function getById($id)
    {
        return TrainingProgram::find($id);
    }
    public function create(array $data)
    {
        // Kiểm tra nếu khóa học đã có chương trình đào tạo
        if (TrainingProgram::where('course_id', $data['course_id'])->exists()) {
            throw new \Exception('Khóa học này đã có chương trình đào tạo!');
        }

        return TrainingProgram::create($data);
    }


    public function update($id, array $data)
    {
        $trainingProgram = TrainingProgram::findOrFail($id);
        $trainingProgram->update($data);
        return $trainingProgram;
    }

    public function delete($id)
    {
        $trainingProgram = TrainingProgram::findOrFail($id);
        return $trainingProgram->delete();
    }
}