<?php
namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\StudentTrainingProgramService;
use App\Http\Requests\StudentTrainingProgramRequest\StudentTrainingProgramRequest;

class StudentTrainingProgramController extends Controller
{
    protected $service;

    public function __construct(StudentTrainingProgramService $service)
    {
        $this->service = $service;
    }

    // Đăng ký học viên vào chương trình
    public function store(StudentTrainingProgramRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $studentTrainingProgram = $this->service->registerStudentToProgram($data);

            if (!$studentTrainingProgram) {
                return response()->json([
                    'message' => 'Không thể đăng ký học viên vào chương trình.'
                ], 400);
            }

            return response()->json([
                'message' => 'Học viên đăng ký thành công.',
                'data' => $studentTrainingProgram
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi đăng ký học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy danh sách học viên trong chương trình đào tạo
    public function getStudents($trainingProgramId): JsonResponse
    {
        try {
            $students = $this->service->getStudentsInProgram($trainingProgramId);

            if ($students->isEmpty()) {
                return response()->json([
                    'message' => 'Không có học viên nào trong chương trình.'
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách học viên trong chương trình.',
                'data' => $students
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy thông tin học viên trong chương trình
    public function show($id): JsonResponse
    {
        try {
            $studentTrainingProgram = $this->service->getStudentInfo($id);

            if (!$studentTrainingProgram) {
                return response()->json([
                    'message' => 'Không tìm thấy thông tin học viên trong chương trình.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết học viên trong chương trình.',
                'data' => $studentTrainingProgram
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy thông tin học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa học viên khỏi chương trình
    public function removeStudent($studentId, $trainingProgramId): JsonResponse
    {
        try {
            $result = $this->service->removeStudentFromProgram($studentId, $trainingProgramId);

            if (!$result) {
                return response()->json([
                    'message' => 'Không tìm thấy học viên trong chương trình để xóa.'
                ], 404);
            }

            return response()->json([
                'message' => 'Học viên đã được xóa khỏi chương trình thành công.'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi xóa học viên khỏi chương trình.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}