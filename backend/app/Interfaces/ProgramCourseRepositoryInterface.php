<?php
namespace App\Interfaces;

interface ProgramCourseInterface
{
    public function assignCourseToProgram(array $data);
    public function getCoursesByTrainingProgram(int $trainingProgramId);
    public function deleteProgramCourse(int $id);
}