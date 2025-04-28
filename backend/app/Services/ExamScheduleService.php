<?php

namespace App\Services;

use App\Interfaces\ExamScheduleInterface;

class ExamScheduleService
{
    protected $examScheduleRepository;

    public function __construct(ExamScheduleInterface $examScheduleRepository)
    {
        $this->examScheduleRepository = $examScheduleRepository;
    }

    public function getAll()
    {
        return $this->examScheduleRepository->getAll();
    }

    public function getById($id)
    {
        return $this->examScheduleRepository->getById($id);
    }

    public function create(array $data)
    {
        return $this->examScheduleRepository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->examScheduleRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->examScheduleRepository->delete($id);
    }
}