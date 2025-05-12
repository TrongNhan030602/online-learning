<?php
namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\StudentTrainingProgramService;
use App\Http\Resources\StudentTrainingProgramResource;
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

            // Kiểm tra nếu không có chương trình đào tạo trước (trường hợp 'lien_thong')
            if (!$studentTrainingProgram) {
                return response()->json([
                    'message' => 'Không thể đăng ký học viên vào chương trình. Sinh viên cần có chương trình đào tạo trước.'
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

            return response()->json([
                'message' => $students->isEmpty()
                    ? 'Không có học viên nào trong chương trình.'
                    : 'Danh sách học viên trong chương trình.',
                'data' => StudentTrainingProgramResource::collection($students)
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    //Lấy danh sách học viên không nằm trong chương trình đào tạo
    public function getStudentsNotInProgram($trainingProgramId): JsonResponse
    {
        try {
            $students = $this->service->getStudentsNotInProgram($trainingProgramId);

            return response()->json([
                'message' => 'Danh sách học viên chưa thuộc chương trình.',
                'data' => $students
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getPreviousProgram($studentId)
    {
        $program = $this->service->getPreviousPrograms($studentId);
        if (!$program) {
            return response()->json(['message' => 'Không tìm thấy chương trình đào tạo trước đó hợp lệ'], 404);
        }
        return response()->json($program);
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