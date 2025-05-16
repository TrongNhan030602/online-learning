<?php
namespace App\Services;

use App\Interfaces\LearningResultRepositoryInterface;

class LearningResultService
{
    protected $repository;

    public function __construct(LearningResultRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(array $filters = [])
    {
        return $this->repository->all($filters);
    }

    public function getById($id)
    {
        return $this->repository->find($id);
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }

    public function getByStudentAndProgram(int $studentTrainingProgramId, int $programId, ?int $semesterId = null)
    {
        return $this->repository->findByStudentAndProgram($studentTrainingProgramId, $programId, $semesterId);
    }

    public function calculateAndUpdateAverageScore(int $studentTrainingProgramId, int $programId, ?int $semesterId = null)
    {
        return $this->repository->calculateAndUpdateAverageScore($studentTrainingProgramId, $programId, $semesterId);
    }

    public function getReport(array $criteria = [])
    {
        return $this->repository->getReport($criteria);
    }
}