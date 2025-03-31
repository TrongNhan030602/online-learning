<?php
namespace App\Interfaces;

interface EnrollmentRepositoryInterface
{
    public function enrollStudent($classroomId, $userId);
    public function getEnrollmentsByClassroom($classroomId);
    public function getEnrollmentsByStudent($userId);
    public function updateEnrollmentStatus($id, $status);
    public function removeEnrollment($id);
}