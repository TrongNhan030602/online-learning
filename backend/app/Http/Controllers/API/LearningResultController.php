<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\LearningResultService;
use App\Http\Controllers\Controller;
use App\Http\Requests\LearningResultRequest\LearningResultRequest;

class LearningResultController extends Controller
{
    protected $service;

    public function __construct(LearningResultService $service)
    {
        $this->service = $service;
    }

    // Lấy tất cả kết quả học tập (có thể dùng filter)
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['program_id', 'student_training_program_id', 'semester_id']);
            $results = $this->service->getAll($filters);
            if ($results->isEmpty()) {
                return response()->json([
                    'message' => 'Không có kết quả học tập nào.'
                ], 200);
            }
            return response()->json([
                'message' => 'Danh sách kết quả học tập.',
                'data' => $results
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy danh sách kết quả học tập.');
        }
    }

    // Lấy kết quả học tập theo ID
    public function show($id): JsonResponse
    {
        try {
            $result = $this->service->getById($id);

            return response()->json([
                'message' => 'Chi tiết kết quả học tập.',
                'data' => $result
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy chi tiết kết quả học tập.');
        }
    }

    // Tạo mới kết quả học tập
    public function store(LearningResultRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $result = $this->service->create($data);

            return response()->json([
                'message' => 'Kết quả học tập đã được tạo.',
                'data' => $result
            ], 201);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi tạo kết quả học tập.');
        }
    }

    // Cập nhật kết quả học tập
    public function update(LearningResultRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $result = $this->service->update($id, $data);

            return response()->json([
                'message' => 'Kết quả học tập đã được cập nhật.',
                'data' => $result
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi cập nhật kết quả học tập.');
        }
    }

    // Xóa kết quả học tập
    public function destroy($id): JsonResponse
    {
        try {
            $this->service->delete($id);

            return response()->json([
                'message' => 'Kết quả học tập đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi xóa kết quả học tập.');
        }
    }

    // Lấy kết quả học tập theo học viên, chương trình và học kỳ
    public function getByStudent(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'student_training_program_id' => 'required|integer',
                'program_id' => 'required|integer',
                'semester_id' => 'nullable|integer'
            ]);

            $result = $this->service->getByStudentAndProgram(
                $validated['student_training_program_id'],
                $validated['program_id'],
                $validated['semester_id'] ?? null
            );

            return response()->json([
                'message' => 'Kết quả học tập theo học viên.',
                'data' => $result
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy kết quả học tập theo học viên.');
        }
    }

    // Tính và cập nhật điểm trung bình
    public function calculateAverageScore(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'student_training_program_id' => 'required|integer',
                'program_id' => 'required|integer',
                'semester_id' => 'nullable|integer'
            ]);

            $result = $this->service->calculateAndUpdateAverageScore(
                $validated['student_training_program_id'],
                $validated['program_id'],
                $validated['semester_id'] ?? null
            );

            return response()->json([
                'message' => 'Đã tính và cập nhật điểm trung bình.',
                'data' => $result
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi tính điểm trung bình.');
        }
    }

    // Lấy báo cáo tổng kết học tập theo tiêu chí
    public function report(Request $request): JsonResponse
    {
        try {
            $criteria = $request->only(['program_id', 'classification', 'completion_status']);
            $results = $this->service->getReport($criteria);

            return response()->json([
                'message' => 'Báo cáo kết quả học tập.',
                'data' => $results
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy báo cáo học tập.');
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