<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Services\CourseService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
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

            // Xử lý ảnh nếu có
            if ($request->hasFile('image_url')) {
                $data['image_url'] = $this->uploadImage($request->file('image_url'));
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


    // Cập nhật thông tin khóa học (KHÔNG CẬP NHẬT ẢNH)
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
            $this->deleteOldImage($id);
            $this->courseService->deleteCourseById($id);
            return response()->json(['message' => 'Khóa học đã được xóa thành công'], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Xóa khóa học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Các phương thức xử lý ảnh
    // Hàm upload ảnh
    private function uploadImage($image)
    {
        $filename = time() . '-' . $image->getClientOriginalName();
        $path = $image->storeAs('courses', $filename, 'public');
        return $path;
    }

    private function deleteOldImage($courseId)
    {
        $course = $this->courseService->getCourseById($courseId);
        if ($course->image_url) {
            Storage::disk('public')->delete($course->image_url);
        }
    }
    // Cập nhật ảnh khóa học RIÊNG BIỆT
    public function updateImage(Request $request, $id)
    {
        try {
            $request->validate([
                'image_url' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Xóa ảnh cũ nếu có
            $this->deleteOldImage($id);

            // Upload ảnh mới
            $imagePath = $this->uploadImage($request->file('image_url'));

            // Cập nhật ảnh mới trong database
            $course = $this->courseService->updateExistingCourse($id, ['image_url' => $imagePath]);

            return response()->json($course, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Cập nhật ảnh thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}