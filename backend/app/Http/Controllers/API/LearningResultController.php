<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Models\StudentTrainingProgram;
use App\Services\LearningResultService;

class LearningResultController extends Controller
{
    protected $service;

    public function __construct(LearningResultService $service)
    {
        $this->service = $service;
    }

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

    // Lấy kết quả học tập của sinh viên đang đăng nhập
    public function getLearningResultsForLoggedInStudent(): JsonResponse
    {
        try {
            $results = $this->service->getLearningResultsForLoggedInStudent();

            if (empty($results)) {
                return response()->json([
                    'message' => 'Không có kết quả học tập cho sinh viên này.'
                ], 200);
            }

            return response()->json([
                'message' => 'Kết quả học tập của sinh viên đang đăng nhập.',
                'data' => $results,
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy kết quả học tập của sinh viên.');
        }
    }

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


    public function getMyResult(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'program_id' => 'required|integer',
                'semester_id' => 'nullable|integer'
            ]);

            $userId = auth()->id(); // Lấy user đang đăng nhập

            $result = $this->service->getByUserAndProgram(
                $userId,
                $validated['program_id'],
                $validated['semester_id'] ?? null
            );

            if (!$result) {
                return response()->json([
                    'message' => 'Không tìm thấy kết quả học tập.'
                ], 404);
            }

            return response()->json([
                'message' => 'Kết quả học tập của người dùng.',
                'data' => $result
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy kết quả học tập của người dùng.');
        }
    }


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


    public function calculateGPA(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'student_training_program_id' => 'required|integer',
                'program_id' => 'required|integer',
                'semester_id' => 'nullable|integer'
            ]);

            $gpa = $this->service->calculateGPA(
                $validated['student_training_program_id'],
                $validated['program_id'],
                $validated['semester_id'] ?? null
            );

            return response()->json([
                'message' => 'GPA đã được tính.',
                'data' => ['gpa' => $gpa]
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi tính GPA.');
        }
    }
    public function recalculateOverall(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'program_id' => 'required|integer',
            ]);

            $this->service->recalculateOverallForProgram($validated['program_id']);

            return response()->json([
                'message' => 'Đã tính lại kết quả tổng kết toàn chương trình cho tất cả sinh viên.'
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi tính lại tổng kết toàn chương trình.');
        }
    }

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

    public function getByProgram(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'program_id' => 'required|integer',
                'semester_id' => 'nullable|integer'
            ]);
            $filters = $request->except(['program_id', 'semester_id']);
            $results = $this->service->getByProgram(
                $validated['program_id'],
                $validated['semester_id'] ?? null,
                $filters
            );

            return response()->json([
                'message' => 'Danh sách kết quả học tập theo chương trình.',
                'data' => $results
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy kết quả học tập theo chương trình.');
        }
    }

    public function recalculate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'program_id' => 'required|integer',
                'semester_id' => 'nullable|integer'
            ]);

            $this->service->recalculateAllForProgram(
                $validated['program_id'],
                $validated['semester_id'] ?? null
            );

            return response()->json([
                'message' => 'Đã tính lại toàn bộ kết quả học tập.'
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi tính lại kết quả học tập.');
        }
    }

    public function classify(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'average_score' => 'required|numeric|min:0|max:10'
            ]);

            $classification = $this->service->classify($validated['average_score']);

            return response()->json([
                'message' => 'Phân loại học lực.',
                'data' => ['classification' => $classification]
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi phân loại học lực.');
        }
    }

    public function getByProgramAndUser(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'program_id' => 'required|integer',
                'user_id' => 'required|integer',
            ]);

            $results = $this->service->getByProgramAndUser(
                $validated['program_id'],
                $validated['user_id']
            );

            if (empty($results)) {
                return response()->json([
                    'message' => 'Không tìm thấy kết quả học tập cho user và chương trình này.'
                ], 404);
            }

            return response()->json([
                'message' => 'Kết quả học tập theo chương trình và người dùng.',
                'data' => $results
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy kết quả học tập theo chương trình và người dùng.');
        }
    }



    private function handleException(Exception $e, string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'error' => $e->getMessage()
        ], 500);
    }
}