<?php
namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Models\TrainingProgram;
use App\Services\SemesterService;
use App\Http\Controllers\Controller;
use App\Http\Requests\SemesterRequest\SemesterRequest;

class SemesterController extends Controller
{
    protected $semesterService;

    public function __construct(SemesterService $semesterService)
    {
        $this->semesterService = $semesterService;
    }

    // Lấy danh sách học kỳ
    public function index()
    {
        try {
            $semesters = $this->semesterService->getAllSemesters();

            if ($semesters->isEmpty()) {
                return response()->json([
                    'message' => 'Không có học kỳ nào.'
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách học kỳ.',
                'data' => $semesters
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách học kỳ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết học kỳ
    public function show($id)
    {
        try {
            $semester = $this->semesterService->getSemesterById($id);

            if (!$semester) {
                return response()->json([
                    'message' => 'Học kỳ không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết học kỳ.',
                'data' => $semester
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy chi tiết học kỳ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo học kỳ mới
    public function store(SemesterRequest $request)
    {
        try {
            $trainingProgram = TrainingProgram::findOrFail($request->training_program_id);

            if (!in_array($trainingProgram->level, ['college', 'intermediate'])) {
                return response()->json([
                    'message' => 'Chỉ chương trình đào tạo loại "college" hoặc "intermediate" mới có học kỳ.'
                ], 400);
            }

            $semester = $this->semesterService->createSemester($request->validated());

            return response()->json([
                'message' => 'Học kỳ đã được tạo.',
                'data' => $semester
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo học kỳ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật học kỳ
    public function update(SemesterRequest $request, $id)
    {
        try {
            $semester = $this->semesterService->updateSemester($id, $request->validated());

            if (!$semester) {
                return response()->json([
                    'message' => 'Học kỳ không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Học kỳ đã được cập nhật.',
                'data' => $semester
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật học kỳ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa học kỳ
    public function destroy($id)
    {
        try {
            $deleted = $this->semesterService->deleteSemester($id);

            if (!$deleted) {
                return response()->json([
                    'message' => 'Học kỳ không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Học kỳ đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa học kỳ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Gán môn học vào học kỳ
    public function addCoursesToSemester(Request $request, $semesterId)
    {
        try {
            $courseIds = $request->course_ids;
            $semester = $this->semesterService->addCoursesToSemester($semesterId, $courseIds);

            if (!$semester) {
                return response()->json([
                    'message' => 'Học kỳ không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Môn học đã được gán vào học kỳ thành công.',
                'data' => $semester
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi gán môn học vào học kỳ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}