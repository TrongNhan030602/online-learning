<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\ExemptCourseService;
use App\Http\Requests\ExemptCourseRequest\ExemptCourseRequest;

class ExemptCourseController extends Controller
{
    protected $service;

    public function __construct(ExemptCourseService $service)
    {
        $this->service = $service;
    }

    // Thêm môn miễn cho học viên
    public function store(ExemptCourseRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $exemptCourse = $this->service->addExemptCourse($data);

            return response()->json([
                'message' => 'Môn học đã được miễn cho học viên.',
                'data' => $exemptCourse
            ], 201);
        } catch (Exception $e) {
            return $this->handleException($e, 'Có lỗi xảy ra khi thêm môn miễn.');
        }
    }

    // Lấy danh sách môn miễn của học viên
    public function getExemptCourses($studentId): JsonResponse
    {
        try {
            $exemptCourses = $this->service->getExemptCoursesForStudent($studentId);

            if ($exemptCourses->isEmpty()) {
                return response()->json([
                    'message' => 'Không có môn miễn cho học viên này.',
                    'data' => []
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách môn miễn.',
                'data' => $exemptCourses
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Có lỗi xảy ra khi lấy danh sách môn miễn.');
        }
    }

    // Kiểm tra môn học có được miễn cho học viên không
    public function checkExemption($studentId, $courseId): JsonResponse
    {
        try {
            $isExempt = $this->service->checkIfExempt($studentId, $courseId);

            return response()->json([
                'message' => 'Kết quả kiểm tra miễn môn.',
                'data' => ['is_exempt' => $isExempt]
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Có lỗi xảy ra khi kiểm tra miễn môn.');
        }
    }

    // Hàm xử lý lỗi chung
    private function handleException(Exception $e, string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'error' => $e->getMessage()
        ], 500);
    }
}