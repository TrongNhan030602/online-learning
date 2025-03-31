<?php

namespace App\Services;

use App\Interfaces\TrainingProgramRepositoryInterface;

class TrainingProgramService
{
    protected $trainingProgramRepository;

    public function __construct(TrainingProgramRepositoryInterface $trainingProgramRepository)
    {
        $this->trainingProgramRepository = $trainingProgramRepository;
    }

    public function getTrainingProgramByCourseId($courseId)
    {
        return $this->trainingProgramRepository->getByCourseId($courseId);
    }

    public function getAll()
    {
        return $this->trainingProgramRepository->getAll();
    }

    public function getById($id)
    {
        return $this->trainingProgramRepository->getById($id);
    }

    public function create(array $data)
    {
        return $this->trainingProgramRepository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->trainingProgramRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->trainingProgramRepository->delete($id);
    }
}