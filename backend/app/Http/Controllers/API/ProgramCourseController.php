<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProgramCourseRequest\ProgramCourseRequest;
use App\Services\ProgramCourseService;
use Exception;

class ProgramCourseController extends Controller
{
    protected $service;

    public function __construct(ProgramCourseService $service)
    {
        $this->service = $service;
    }
    public function index($trainingProgramId)
    {
        try {
            $courses = $this->service->getCourses($trainingProgramId);
            return response()->json([
                'message' => 'Danh sách môn học trong chương trình.',
                'data' => $courses
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->delete($id);
            return response()->json([
                'message' => 'Môn học đã được xóa khỏi chương trình.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function assign(ProgramCourseRequest $request)
    {
        try {
            $programCourse = $this->service->assignCourse($request->validated());

            return response()->json([
                'message' => 'Đã gán môn học vào chương trình đào tạo.',
                'data' => $programCourse,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi gán môn học.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}