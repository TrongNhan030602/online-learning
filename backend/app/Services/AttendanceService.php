<?php
namespace App\Services;

use App\Interfaces\AttendanceRepositoryInterface;

class AttendanceService
{
    protected $attendanceRepository;

    public function __construct(AttendanceRepositoryInterface $attendanceRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
    }

    public function markAttendance($classSessionId, $userId, $status, $note = null)
    {
        return $this->attendanceRepository->markAttendance($classSessionId, $userId, $status, $note);
    }

    public function getAttendanceBySession($classSessionId)
    {
        return $this->attendanceRepository->getAttendanceBySession($classSessionId);
    }

    public function getAttendanceByStudent($userId)
    {
        return $this->attendanceRepository->getAttendanceByStudent($userId);
    }

    public function updateAttendance($id, $status, $note = null)
    {
        return $this->attendanceRepository->updateAttendance($id, $status, $note);
    }

    public function deleteAttendance($id)
    {
        return $this->attendanceRepository->deleteAttendance($id);
    }
}