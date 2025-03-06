<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Exception;

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
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'image' => 'nullable|image|max:2048', // hình ảnh (max 2MB)
                'document' => 'nullable|mimes:pdf,mp4,avi,mov|max:10240' // PDF hoặc video (max 10MB)
            ]);

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('images', 'public');
            }
            if ($request->hasFile('document')) {
                $data['document'] = $request->file('document')->store('documents', 'public');
            }

            $course = $this->courseService->createNewCourse($data);
            return response()->json($course, 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Tạo khóa học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật thông tin khóa học 
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|nullable|string',
                'price' => 'sometimes|required|numeric|min:0'
            ]);

            $course = $this->courseService->updateExistingCourse($id, $data);
            return response()->json($course, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Cập nhật khóa học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Endpoint riêng để cập nhật file (image, document)
    public function upload(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'image' => 'nullable|image|max:2048',
                'document' => 'nullable|mimes:pdf,mp4,avi,mov|max:10240'
            ]);

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('images', 'public');
            }
            if ($request->hasFile('document')) {
                $data['document'] = $request->file('document')->store('documents', 'public');
            }

            $course = $this->courseService->updateExistingCourse($id, $data);
            return response()->json($course, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Cập nhật file khóa học thất bại.',
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