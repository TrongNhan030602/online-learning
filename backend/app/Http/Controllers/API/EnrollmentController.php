<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;
use Exception;
use App\Exceptions\ApiExceptionHandler;

class EnrollmentController extends Controller
{
    protected $enrollmentService;

    public function __construct(EnrollmentService $enrollmentService)
    {
        $this->enrollmentService = $enrollmentService;
    }

    // 📌 Ghi danh học viên vào lớp
    public function enroll(Request $request)
    {
        try {
            $request->validate([
                'classroom_id' => 'required|exists:class_rooms,id',
                'user_id' => 'required|exists:users,id'
            ]);

            $enrollment = $this->enrollmentService->enrollStudent(
                $request->classroom_id,
                $request->user_id
            );

            return response()->json($enrollment, 201);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    // 📌 Lấy danh sách học viên của lớp
    public function getByClassroom($classroomId)
    {
        try {
            return response()->json($this->enrollmentService->getEnrollmentsByClassroom($classroomId));
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    // 📌 Lấy danh sách lớp mà học viên đã ghi danh
    public function getByStudent($userId)
    {
        try {
            return response()->json($this->enrollmentService->getEnrollmentsByStudent($userId));
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    // 📌 Duyệt ghi danh
    public function approve($id)
    {
        try {
            return response()->json($this->enrollmentService->approveEnrollment($id));
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    // 📌 Từ chối ghi danh
    public function reject($id)
    {
        try {
            return response()->json($this->enrollmentService->rejectEnrollment($id));
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    // 📌 Hủy ghi danh
    public function remove($id)
    {
        try {
            return response()->json(['deleted' => $this->enrollmentService->removeEnrollment($id)]);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }
}