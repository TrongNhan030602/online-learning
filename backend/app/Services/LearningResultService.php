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

    public function getById(int $id)
    {
        return $this->repository->find($id);
    }
    public function getLearningResultsForLoggedInStudent(): array
    {
        return $this->repository->getLearningResultsForLoggedInStudent();
    }


    public function delete(int $id)
    {
        return $this->repository->delete($id);
    }

    public function getByStudentAndProgram(int $studentTrainingProgramId, int $programId, ?int $semesterId = null)
    {
        return $this->repository->findByStudentAndProgram($studentTrainingProgramId, $programId, $semesterId);
    }
    public function getByUserAndProgram(int $userId, int $programId, ?int $semesterId = null): ?array
    {
        return $this->repository->getByUserAndProgram($userId, $programId, $semesterId);
    }

    public function calculateAverageScore(int $studentTrainingProgramId, ?int $semesterId = null): float
    {
        return $this->repository->calculateAverageScore($studentTrainingProgramId, $semesterId);
    }


    public function updateLearningResult(
        int $studentTrainingProgramId,
        int $programId,
        ?int $semesterId,
        float $average,
        ?float $gpa = null
    ): bool {
        return $this->repository->updateLearningResult($studentTrainingProgramId, $programId, $semesterId, $average, $gpa);
    }

    public function calculateGPA(int $studentTrainingProgramId, int $programId, ?int $semesterId = null): float
    {
        return $this->repository->calculateGPA($studentTrainingProgramId, $programId, $semesterId);
    }

    public function calculateAndUpdateAverageScore(
        int $studentTrainingProgramId,
        int $programId,
        ?int $semesterId = null
    ): array {
        return $this->repository->calculateAndUpdateAverageScore(
            $studentTrainingProgramId,
            $programId,
            $semesterId
        );
    }
    public function recalculateOverallForProgram(int $programId): void
    {
        $this->repository->recalculateOverallForProgram($programId);
    }


    public function getByProgram(int $programId, ?int $semesterId = null, array $filters = [])
    {
        return $this->repository->getByProgram($programId, $semesterId, $filters);
    }

    public function recalculateAllForProgram(int $programId, ?int $semesterId = null): void
    {
        $this->repository->recalculateAllForProgram($programId, $semesterId);
    }

    public function classify(float $averageScore): string
    {
        return $this->repository->classify($averageScore);
    }

    public function getReport(array $criteria = [])
    {
        return $this->repository->getReport($criteria);
    }

    public function getByProgramAndUser(int $programId, int $userId)
    {
        return $this->repository->getByProgramAndUser($programId, $userId);
    }

}