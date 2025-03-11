<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Services\CourseService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Course\CourseStoreRequest;
use App\Http\Requests\Course\CourseUpdateRequest;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    // Lấy danh sách khóa học với tùy chọn tìm kiếm theo tiêu đề
    public function index(Request $request)
    {
        try {
            $filters = $request->only(['title']);
            $courses = $this->courseService->listCourses($filters);
            return response()->json($courses, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không thể lấy danh sách khóa học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Thêm khóa học mới (bao gồm upload file nếu có)
    public function store(CourseStoreRequest $request)
    {
        try {
            $data = $request->validated();
            $course = $this->courseService->createNewCourse($data);
            return response()->json($course, 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Tạo khóa học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Lấy chi tiết một khóa học theo ID
    public function show($id)
    {
        try {
            // Lấy chi tiết khóa học, bao gồm files và lessons (với selectedFiles của mỗi bài học)
            $course = $this->courseService->getCourseById($id);
            return response()->json($course, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không tìm thấy khóa học.',
                'error' => $e->getMessage()
            ], 404);
        }
    }


    // Cập nhật thông tin khóa học 
    public function update(CourseUpdateRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $course = $this->courseService->updateExistingCourse($id, $data);
            return response()->json($course, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Cập nhật khóa học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    // Xóa khóa học và các file liên quan
    public function destroy($id)
    {
        try {
            $this->courseService->deleteCourseById($id);
            return response()->json(['message' => 'Khóa học đã được xóa thành công'], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Xóa khóa học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}