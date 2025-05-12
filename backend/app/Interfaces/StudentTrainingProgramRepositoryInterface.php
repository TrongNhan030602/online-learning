<?php
namespace App\Interfaces;

interface StudentTrainingProgramRepositoryInterface
{
    public function create(array $data);
    public function getStudentsByTrainingProgramId(int $trainingProgramId);
    public function getStudentsNotInProgram(int $trainingProgramId);

    public function getById(int $id);
    public function removeStudentFromProgram(int $userId, int $trainingProgramId);
    public function checkPreviousProgram(int $userId, int $fromProgramId);
    public function getPreviousPrograms(int $userId);
}