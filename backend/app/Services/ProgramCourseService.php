<?php
namespace App\Services;

use App\Interfaces\ProgramCourseInterface;

class ProgramCourseService
{
    protected $programCourseRepo;

    public function __construct(ProgramCourseInterface $programCourseRepo)
    {
        $this->programCourseRepo = $programCourseRepo;
    }

    public function assignCourse(array $data)
    {
        return $this->programCourseRepo->assignCourseToProgram($data);
    }

    public function getCourses(int $trainingProgramId)
    {
        return $this->programCourseRepo->getCoursesByTrainingProgram($trainingProgramId);
    }

    public function delete(int $id)
    {
        return $this->programCourseRepo->deleteProgramCourse($id);
    }
}