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

    // ADMIN - Quản lý lịch thi

    public function getAll(array $filters = [])
    {
        return $this->examScheduleRepository->getAll($filters);
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

    // STUDENT - Lịch thi cho học viên

    public function getSchedulesForStudent($studentId)
    {
        return $this->examScheduleRepository->getSchedulesForStudent($studentId);
    }

    public function getUpcomingForStudent($studentId)
    {
        return $this->examScheduleRepository->getUpcomingForStudent($studentId);
    }

    public function getCourseScheduleForStudent($studentId, $courseId)
    {
        return $this->examScheduleRepository->getCourseScheduleForStudent($studentId, $courseId);
    }

    public function getRetakeScheduleForStudent($studentId, $courseId)
    {
        return $this->examScheduleRepository->getRetakeScheduleForStudent($studentId, $courseId);
    }
}