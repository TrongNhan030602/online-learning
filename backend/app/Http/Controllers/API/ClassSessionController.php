<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Services\ClassSessionService;
use App\Http\Requests\ClassSession\CreateClassSessionRequest;
use App\Http\Requests\ClassSession\UpdateClassSessionRequest;
use App\Exceptions\ApiExceptionHandler;

class ClassSessionController extends Controller
{
    protected $classSessionService;

    public function __construct(ClassSessionService $classSessionService)
    {
        $this->classSessionService = $classSessionService;
    }

    // Lấy danh sách buổi học của lớp học
    public function index($classroomId)
    {
        try {
            $sessions = $this->classSessionService->getSessionsByClassroomId($classroomId);

            if ($sessions->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy buổi học nào!'
                ], 404);
            }

            return response()->json($sessions);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    // Thêm buổi học mới
    public function store(CreateClassSessionRequest $request, $classroomId) // Sử dụng CreateClassSessionRequest
    {
        try {
            $validated = $request->validated();  // Sử dụng validated() để lấy dữ liệu đã được validate

            $session = $this->classSessionService->createSession($classroomId, $validated);

            return response()->json($session, 201);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    // Cập nhật buổi học
    public function update(UpdateClassSessionRequest $request, $classroomId, $sessionId) // Sử dụng UpdateClassSessionRequest
    {
        try {
            $validated = $request->validated();  // Sử dụng validated() để lấy dữ liệu đã được validate

            $session = $this->classSessionService->updateSession($sessionId, $validated);

            if (!$session) {
                return response()->json([
                    'message' => 'Không tìm thấy buổi học!'
                ], 404);
            }

            return response()->json($session);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    // Xóa buổi học
    public function destroy($classroomId, $sessionId)
    {
        try {
            $isDeleted = $this->classSessionService->deleteSession($sessionId);

            if (!$isDeleted) {
                return response()->json([
                    'message' => 'Không thể xóa buổi học!'
                ], 404);
            }

            return response()->json([
                'message' => 'Buổi học đã bị xóa thành công.'
            ]);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }
}