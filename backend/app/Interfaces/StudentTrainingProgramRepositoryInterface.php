<?php
namespace App\Interfaces;

interface StudentTrainingProgramRepositoryInterface
{
    public function create(array $data);
    public function getStudentsByTrainingProgramId(int $trainingProgramId);
    public function getById(int $id);
    public function removeStudentFromProgram(int $studentId, int $trainingProgramId);
}