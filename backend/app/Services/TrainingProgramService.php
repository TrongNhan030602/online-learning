<?php
namespace App\Services;

use App\Interfaces\TrainingProgramRepositoryInterface;

class TrainingProgramService
{
    protected $repo;

    public function __construct(TrainingProgramRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function getAll()
    {
        return $this->repo->getAll();
    }

    public function getById($id)
    {
        return $this->repo->getById($id);
    }

    public function create(array $data)
    {
        return $this->repo->create($data);
    }

    public function update($id, array $data)
    {
        return $this->repo->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repo->delete($id);
    }

    public function getByLevel($level)
    {
        return $this->repo->getByLevel($level);
    }

    public function getSemestersByProgramId($programId)
    {
        return $this->repo->getSemestersByProgramId($programId);
    }
    public function getStudentsWithoutScoresForSemester($programId, $semesterId)
    {
        return $this->repo->getStudentsWithoutScoresForSemester($programId, $semesterId);
    }
    // For Student
    public function getDetailedById($id)
    {
        return $this->repo->getDetailedById($id);
    }

}