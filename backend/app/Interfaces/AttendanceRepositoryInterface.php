<?php
namespace App\Interfaces;

interface AttendanceRepositoryInterface
{
    public function markAttendance($classSessionId, $userId, $status, $note = null);
    public function getAttendanceBySession($classSessionId);
    public function getAttendanceByStudent($userId);
    public function updateAttendance($id, $status, $note = null);
    public function deleteAttendance($id);
}