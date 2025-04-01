<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;
use Illuminate\Http\Request;
use Exception;

class AttendanceController extends Controller
{
    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function markAttendance(Request $request)
    {
        try {
            $request->validate([
                'class_session_id' => 'required|exists:class_sessions,id',
                'user_id' => 'required|exists:users,id',
                'status' => 'required|in:present,absent,late,excused',
                'note' => 'nullable|string'
            ]);

            $attendance = $this->attendanceService->markAttendance(
                $request->class_session_id,
                $request->user_id,
                $request->status,
                $request->note
            );

            return response()->json($attendance, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getBySession($classSessionId)
    {
        return response()->json($this->attendanceService->getAttendanceBySession($classSessionId));
    }

    public function getByStudent($userId)
    {
        return response()->json($this->attendanceService->getAttendanceByStudent($userId));
    }

    public function updateAttendance(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:present,absent,late,excused',
                'note' => 'nullable|string'
            ]);

            $attendance = $this->attendanceService->updateAttendance(
                $id,
                $request->status,
                $request->note
            );

            return response()->json($attendance);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteAttendance($id)
    {
        return response()->json(['deleted' => $this->attendanceService->deleteAttendance($id)]);
    }
}