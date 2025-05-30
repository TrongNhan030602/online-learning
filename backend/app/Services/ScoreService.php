<?php

namespace App\Services;

use App\Interfaces\ScoreRepositoryInterface;

class ScoreService
{
    protected $repository;

    public function __construct(ScoreRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllWithRelations(array $filters = [])
    {
        return $this->repository->getAllWithRelations($filters);
    }

    public function addScore(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateScore($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function getStudentScores($studentId)
    {
        return $this->repository->getByStudent($studentId);
    }

    public function getCourseScores($courseId)
    {
        return $this->repository->getByCourse($courseId);
    }

    public function getStudentScoresBySemester($studentId, $semesterId)
    {
        return $this->repository->getByStudentAndSemester($studentId, $semesterId);
    }

    public function getScoreDetail($id)
    {
        return $this->repository->getById($id);
    }

    // Mới thêm

    public function getAcceptedScoresByUser($userId)
    {
        return $this->repository->getAcceptedScoresByUser($userId);
    }

    public function getLatestAttemptScore($userId, $courseId)
    {
        return $this->repository->getLatestAttemptScore($userId, $courseId);
    }

    public function saveBulkScoresAndCalculateResults(array $bulkScores, int $courseId, ?int $semesterId = null, int $attempt = 1)
    {
        return $this->repository->saveBulkScoresAndCalculateResults($bulkScores, $courseId, $semesterId, $attempt);
    }
    public function deleteScore($id)
    {
        return $this->repository->delete($id);
    }

    public function getScoresByCourseAndProgram(int $trainingProgramId, int $courseId, ?int $semesterId = null, int $attempt = 1)
    {
        return $this->repository->getScoresByCourseAndProgram($trainingProgramId, $courseId, $semesterId, $attempt);
    }

}