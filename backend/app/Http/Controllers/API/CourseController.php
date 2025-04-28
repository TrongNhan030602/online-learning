<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\CourseService;
use App\Http\Requests\CourseRequest\CourseRequest;
use Exception;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    // Lấy danh sách môn học
    public function index()
    {
        try {
            $courses = $this->courseService->getAllCourses();

            if ($courses->isEmpty()) {
                return response()->json([
                    'message' => 'Không có môn học nào.',
                    'data' => []
                ], 200);
            }

            return response()->json([
                'message' => 'Danh sách môn học.',
                'data' => $courses
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết môn học
    public function show($id)
    {
        try {
            $course = $this->courseService->getCourseById($id);

            if (!$course) {
                return response()->json([
                    'message' => 'Môn học không tồn tại.',
                    'data' => null
                ], 404); // Sửa status về 404 đúng chuẩn
            }

            return response()->json([
                'message' => 'Chi tiết môn học.',
                'data' => $course
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy chi tiết môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo mới môn học
    public function store(CourseRequest $request)
    {
        try {
            $course = $this->courseService->createCourse($request->validated());
            return response()->json([
                'message' => 'Môn học đã được tạo.',
                'data' => $course
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật môn học
    public function update(CourseRequest $request, $id)
    {
        try {
            $course = $this->courseService->updateCourse($id, $request->validated());

            if (!$course) {
                return response()->json([
                    'message' => 'Môn học không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Môn học đã được cập nhật.',
                'data' => $course
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật trạng thái môn học (active/inactive)
    public function updateStatus($id, $status)
    {
        try {
            $course = $this->courseService->updateStatus($id, $status);

            if (!$course) {
                return response()->json([
                    'message' => 'Môn học không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Trạng thái môn học đã được cập nhật.',
                'data' => $course
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật trạng thái môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa môn học
    public function destroy($id)
    {
        try {
            $deleted = $this->courseService->deleteCourse($id);

            if (!$deleted) {
                return response()->json([
                    'message' => 'Môn học không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Môn học đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}