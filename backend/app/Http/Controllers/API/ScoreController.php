<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Services\ScoreService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ScoreResource;
use App\Http\Requests\ScoreRequest\ScoreRequest;

class ScoreController extends Controller
{
    protected $service;

    public function __construct(ScoreService $service)
    {
        $this->service = $service;
    }
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['user_id', 'course_id', 'semester_id', 'score_type', 'is_accepted']);

            $scores = $this->service->getAllWithRelations($filters);

            return response()->json([
                'message' => 'Lấy danh sách điểm thành công.',
                'data' => ScoreResource::collection($scores)
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi lấy danh sách điểm.',
                'error' => $e->getMessage()
            ], 500);
        }
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
    public function destroy($id): JsonResponse
    {
        try {
            $this->service->deleteScore($id);

            return response()->json([
                'message' => 'Xóa điểm thành công.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi xóa điểm.',
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
                'data' => ScoreResource::collection($scores)
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



    // For student
    public function getMyScores(): JsonResponse
    {
        try {
            $studentId = Auth::id();
            $scores = $this->service->getStudentScores($studentId);

            if ($scores->isEmpty()) {
                return response()->json([
                    'message' => 'Không có điểm nào cho học viên này.'
                ], 404);
            }

            // Group scores by training program
            $grouped = $scores->groupBy(function ($score) {
                return $score->studentTrainingProgram->trainingProgram->id ?? 0;
            })->map(function ($programScores) {
                $trainingProgram = $programScores->first()->studentTrainingProgram->trainingProgram ?? null;

                // Group by semester id (null semesters grouped under key 0 or 'null')
                $semesterGrouped = $programScores->groupBy(function ($score) {
                    return $score->semester ? $score->semester->id : 0;
                })->map(function ($semesterScores) {
                    // Sort scores by course code or other criteria if needed here
                    return ScoreResource::collection($semesterScores->sortBy('course.code')->values());
                });

                // Sort semesters by semester id ascending, null (0) last
                $semesterGrouped = $semesterGrouped->sortKeys()->mapWithKeys(function ($v, $k) {
                    return [$k === 0 ? PHP_INT_MAX : $k => $v];
                })->sortKeys();

                return [
                    'training_program' => $trainingProgram ? [
                        'id' => $trainingProgram->id,
                        'code' => $trainingProgram->code,
                        'name' => $trainingProgram->name,
                    ] : null,
                    'semesters' => $semesterGrouped,
                ];
            })->values();

            return response()->json([
                'data' => $grouped,
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy bảng điểm.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}