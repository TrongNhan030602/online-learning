<?php
namespace App\Repositories;

use App\Models\ProgramCourse;
use App\Interfaces\ProgramCourseInterface;

class ProgramCourseRepository implements ProgramCourseInterface
{
    public function assignCourseToProgram(array $data)
    {
        return ProgramCourse::firstOrCreate([
            'training_program_id' => $data['training_program_id'],
            'course_id' => $data['course_id'],
        ]);
    }

    public function getCoursesByTrainingProgram(int $trainingProgramId)
    {
        return ProgramCourse::with('course')
            ->where('training_program_id', $trainingProgramId)
            ->get();
    }

    public function deleteProgramCourse(int $id)
    {
        return ProgramCourse::destroy($id);
    }
}