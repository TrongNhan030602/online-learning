<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Services\LearningResultService;
use App\Http\Controllers\Controller;
use App\Http\Requests\LearningResultRequest\LearningResultRequest;
use Illuminate\Http\JsonResponse;

class LearningResultController extends Controller
{
    protected $service;

    public function __construct(LearningResultService $service)
    {
        $this->service = $service;
    }

    // Lấy tất cả kết quả học tập
    public function index(): JsonResponse
    {
        try {
            $learningResults = $this->service->getAll();

            if ($learningResults->isEmpty()) {
                return response()->json([
                    'message' => 'Không có kết quả học tập nào.'
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách kết quả học tập.',
                'data' => $learningResults
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy danh sách kết quả học tập.');
        }
    }

    // Lấy kết quả học tập theo ID
    public function show($id): JsonResponse
    {
        try {
            $learningResult = $this->service->getById($id);

            if (!$learningResult) {
                return response()->json([
                    'message' => 'Kết quả học tập không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết kết quả học tập.',
                'data' => $learningResult
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
            $learningResult = $this->service->create($data);

            return response()->json([
                'message' => 'Kết quả học tập đã được tạo.',
                'data' => $learningResult
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
            $learningResult = $this->service->update($id, $data);

            if (!$learningResult) {
                return response()->json([
                    'message' => 'Kết quả học tập không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Kết quả học tập đã được cập nhật.',
                'data' => $learningResult
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi cập nhật kết quả học tập.');
        }
    }

    // Xóa kết quả học tập
    public function destroy($id): JsonResponse
    {
        try {
            $deleted = $this->service->delete($id);

            if (!$deleted) {
                return response()->json([
                    'message' => 'Kết quả học tập không tồn tại hoặc đã bị xóa.'
                ], 404);
            }

            return response()->json([
                'message' => 'Kết quả học tập đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi xóa kết quả học tập.');
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