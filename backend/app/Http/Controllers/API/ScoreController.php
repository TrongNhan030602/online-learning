<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScoreRequest;
use App\Services\ScoreService;
use Illuminate\Http\JsonResponse;
use Exception;

class ScoreController extends Controller
{
    protected $service;

    public function __construct(ScoreService $service)
    {
        $this->service = $service;
    }

    public function store(ScoreRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $score = $this->service->addScore($data);

            return response()->json([
                'message' => 'Nhập điểm thành công.',
                'data' => $score
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi nhập điểm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(ScoreRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $score = $this->service->updateScore($id, $data);

            return response()->json([
                'message' => 'Cập nhật điểm thành công.',
                'data' => $score
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi cập nhật điểm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getStudentScores($studentId): JsonResponse
    {
        try {
            $scores = $this->service->getStudentScores($studentId);

            return response()->json([
                'data' => $scores
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy bảng điểm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCourseScores($courseId): JsonResponse
    {
        try {
            $scores = $this->service->getCourseScores($courseId);

            return response()->json([
                'data' => $scores
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy điểm môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getStudentScoresBySemester($studentId, $semesterId): JsonResponse
    {
        try {
            $scores = $this->service->getStudentScoresBySemester($studentId, $semesterId);

            return response()->json([
                'data' => $scores
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy bảng điểm theo kỳ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}