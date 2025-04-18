<?php

namespace App\Repositories;

use App\Interfaces\TrainingProgramRepositoryInterface;
use App\Models\TrainingProgram;

class TrainingProgramRepository implements TrainingProgramRepositoryInterface
{
    public function getByCourseId($courseId)
    {
        return TrainingProgram::where('course_id', $courseId)->get();
    }


    public function getAll()
    {
        return TrainingProgram::all();
    }

    public function getById($id)
    {
        return TrainingProgram::with([
            'course',
            'course.classRooms',
        ])->find($id);
    }


    public function create(array $data)
    {

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