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
}