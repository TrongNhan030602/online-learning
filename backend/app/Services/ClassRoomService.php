<?php

namespace App\Services;

use App\Interfaces\ClassRoomRepositoryInterface;

class ClassRoomService
{
    protected $classRoomRepository;

    public function __construct(ClassRoomRepositoryInterface $classRoomRepository)
    {
        $this->classRoomRepository = $classRoomRepository;
    }

    public function getAll()
    {
        return $this->classRoomRepository->getAll();
    }

    public function getById($id)
    {
        return $this->classRoomRepository->getById($id);
    }

    public function getByCourseId($courseId)
    {
        return $this->classRoomRepository->getByCourseId($courseId);
    }

    public function create(array $data)
    {
        return $this->classRoomRepository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->classRoomRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->classRoomRepository->delete($id);
    }
}