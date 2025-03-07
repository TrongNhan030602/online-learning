<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Services\LessonService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Lesson\LessonStoreRequest;
use App\Http\Requests\Lesson\LessonUpdateRequest;
use App\Http\Requests\Lesson\AssignFilesRequest;

class LessonController extends Controller
{
    protected $lessonService;

    public function __construct(LessonService $lessonService)
    {
        $this->lessonService = $lessonService;
    }

    // Lấy danh sách bài học (có thể lọc theo course_id)
    public function index(Request $request)
    {
        try {
            $filters = $request->only(['course_id']);
            $lessons = $this->lessonService->listLessons($filters);
            return response()->json($lessons, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không thể lấy danh sách bài học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết bài học theo ID (bao gồm các file đã được gán)
    public function show($id)
    {
        try {
            $lesson = $this->lessonService->getLessonById((int) $id);
            $lesson->load('selectedFiles');
            return response()->json($lesson, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không tìm thấy bài học.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Thêm bài học mới (xử lý file cho trường document nếu có)
    public function store(LessonStoreRequest $request)
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('document')) {
                $originalName = $request->file('document')->getClientOriginalName();
                $extension = $request->file('document')->getClientOriginalExtension();
                $nameWithoutExt = pathinfo($originalName, PATHINFO_FILENAME);
                $sanitizedName = preg_replace('/[^A-Za-z0-9\-_]/', '-', $nameWithoutExt);
                $newName = $sanitizedName . '-' . time() . '.' . $extension;
                $data['document'] = $request->file('document')->storeAs('lesson_documents', $newName, 'public');
            }

            $lesson = $this->lessonService->createLesson($data);
            return response()->json($lesson, 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Tạo bài học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật thông tin bài học (không cập nhật file)
    public function update(LessonUpdateRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $lesson = $this->lessonService->updateLesson((int) $id, $data);
            return response()->json($lesson, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Cập nhật bài học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa bài học
    public function destroy($id)
    {
        try {
            $this->lessonService->deleteLesson((int) $id);
            return response()->json(['message' => 'Bài học đã được xóa thành công.'], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Xóa bài học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Endpoint riêng để gán file cho bài học (chỉ admin)
    public function assignFiles(AssignFilesRequest $request, $lessonId)
    {
        try {
            $data = $request->validated();
            $lesson = $this->lessonService->getLessonById((int) $lessonId);
            $lesson->selectedFiles()->sync($data['file_ids']);
            $lesson->load('selectedFiles');
            return response()->json($lesson, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Gán tài liệu cho bài học thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}