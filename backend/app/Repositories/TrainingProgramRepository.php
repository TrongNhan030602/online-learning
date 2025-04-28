<?php
namespace App\Repositories;

use App\Models\TrainingProgram;
use App\Interfaces\TrainingProgramRepositoryInterface;

class TrainingProgramRepository implements TrainingProgramRepositoryInterface
{
    public function getAll()
    {
        return TrainingProgram::with(['advisor', 'semesters', 'programCourses.course'])->get();
    }

    public function getById($id)
    {
        return TrainingProgram::with(['advisor', 'semesters', 'programCourses.course'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return TrainingProgram::create($data);
    }

    public function update($id, array $data)
    {
        $program = TrainingProgram::findOrFail($id);
        $program->update($data);
        return $program->fresh();
    }

    public function delete($id)
    {
        $program = TrainingProgram::findOrFail($id);
        $program->delete();
    }

    public function getByLevel($level)
    {
        return TrainingProgram::where('level', $level)->with(['advisor'])->get();
    }
}