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

    // Nhập điểm cho học viên
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

    // Cập nhật điểm học viên
    public function update(ScoreRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $score = $this->service->updateScore($id, $data);

            if (!$score) {
                return response()->json([
                    'message' => 'Không tìm thấy điểm để cập nhật.'
                ], 404);
            }

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

    // Lấy bảng điểm của học viên
    public function getStudentScores($studentId): JsonResponse
    {
        try {
            $scores = $this->service->getStudentScores($studentId);

            if ($scores->isEmpty()) {
                return response()->json([
                    'message' => 'Không có điểm nào cho học viên này.'
                ], 404);
            }

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

    // Lấy bảng điểm của môn học
    public function getCourseScores($courseId): JsonResponse
    {
        try {
            $scores = $this->service->getCourseScores($courseId);

            if ($scores->isEmpty()) {
                return response()->json([
                    'message' => 'Không có điểm cho môn học này.'
                ], 404);
            }

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

    // Lấy bảng điểm của học viên theo học kỳ
    public function getStudentScoresBySemester($studentId, $semesterId): JsonResponse
    {
        try {
            $scores = $this->service->getStudentScoresBySemester($studentId, $semesterId);

            if ($scores->isEmpty()) {
                return response()->json([
                    'message' => 'Không có điểm nào cho học viên này trong học kỳ.'
                ], 404);
            }

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