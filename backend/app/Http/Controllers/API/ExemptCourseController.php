<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExemptCourseRequest;
use App\Services\ExemptCourseService;
use Illuminate\Http\JsonResponse;
use Exception;

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
            return response()->json([
                'message' => 'Có lỗi xảy ra khi thêm môn miễn.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy danh sách môn miễn của học viên
    public function getExemptCourses($studentId): JsonResponse
    {
        try {
            $exemptCourses = $this->service->getExemptCoursesForStudent($studentId);

            return response()->json([
                'data' => $exemptCourses
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách môn miễn.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Kiểm tra môn học có được miễn cho học viên không
    public function checkExemption($studentId, $courseId): JsonResponse
    {
        try {
            $isExempt = $this->service->checkIfExempt($studentId, $courseId);

            return response()->json([
                'data' => ['is_exempt' => $isExempt]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi kiểm tra miễn môn.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}