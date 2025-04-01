<?php
namespace App\Repositories;

use App\Interfaces\AttendanceRepositoryInterface;
use App\Models\Attendance;
use Exception;

class AttendanceRepository implements AttendanceRepositoryInterface
{
    public function markAttendance($classSessionId, $userId, $status, $note = null)
    {
        try {
            return Attendance::updateOrCreate(
                [
                    'class_session_id' => $classSessionId,
                    'user_id' => $userId
                ],
                [
                    'status' => $status,
                    'note' => $note
                ]
            );
        } catch (Exception $e) {
            throw new Exception("Lỗi điểm danh: " . $e->getMessage());
        }
    }

    public function getAttendanceBySession($classSessionId)
    {
        return Attendance::with('student')->where('class_session_id', $classSessionId)->get();
    }

    public function getAttendanceByStudent($userId)
    {
        return Attendance::with('session')
            ->where('user_id', $userId)
            ->get();
    }

    public function updateAttendance($id, $status, $note = null)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->update([
            'status' => $status,
            'note' => $note
        ]);
        return $attendance;
    }

    public function deleteAttendance($id)
    {
        return Attendance::where('id', $id)->delete();
    }
}