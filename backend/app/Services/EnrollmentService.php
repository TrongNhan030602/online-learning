<?php
namespace App\Services;

use App\Repositories\EnrollmentRepository;
use Exception;

class EnrollmentService
{
    protected $enrollmentRepository;

    public function __construct(EnrollmentRepository $enrollmentRepository)
    {
        $this->enrollmentRepository = $enrollmentRepository;
    }

    public function enrollStudent($classroomId, $userId)
    {
        return $this->enrollmentRepository->enrollStudent($classroomId, $userId);
    }

    public function getEnrollmentsByClassroom($classroomId)
    {
        return $this->enrollmentRepository->getEnrollmentsByClassroom($classroomId);
    }

    public function getEnrollmentsByStudent($userId)
    {
        return $this->enrollmentRepository->getEnrollmentsByStudent($userId);
    }

    public function approveEnrollment($id)
    {
        return $this->enrollmentRepository->updateEnrollmentStatus($id, 'approved');
    }

    public function rejectEnrollment($id)
    {
        return $this->enrollmentRepository->updateEnrollmentStatus($id, 'rejected');
    }

    public function removeEnrollment($id)
    {
        return $this->enrollmentRepository->removeEnrollment($id);
    }
}