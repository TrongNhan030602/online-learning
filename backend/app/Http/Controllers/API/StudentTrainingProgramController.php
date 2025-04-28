<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentTrainingProgramRequest;
use App\Services\StudentTrainingProgramService;
use Illuminate\Http\JsonResponse;
use Exception;

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

            return response()->json([
                'message' => 'Học viên đăng ký thành công',
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

            return response()->json([
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

            return response()->json([
                'data' => $studentTrainingProgram
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin học viên.',
                'error' => $e->getMessage()
            ], 404);
        }
    }
    public function removeStudent($studentId, $trainingProgramId): JsonResponse
    {
        try {
            $result = $this->service->removeStudentFromProgram($studentId, $trainingProgramId);

            if ($result) {
                return response()->json([
                    'message' => 'Học viên đã được bỏ khỏi chương trình thành công.'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Không tìm thấy học viên trong chương trình để bỏ.',
                ], 404);
            }

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi bỏ học viên khỏi chương trình.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}