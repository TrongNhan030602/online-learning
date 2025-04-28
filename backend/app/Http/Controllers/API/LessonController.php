<?php
namespace App\Http\Controllers\API;

use Exception;
use App\Services\LessonService;
use App\Http\Controllers\Controller;
use App\Http\Requests\LessonRequest\LessonRequest;

class LessonController extends Controller
{
    protected $lessonService;

    public function __construct(LessonService $lessonService)
    {
        $this->lessonService = $lessonService;
    }

    // Lấy danh sách bài học theo buổi học
    public function index($courseSessionId)
    {
        try {
            $lessons = $this->lessonService->getAllLessonsBySessionId($courseSessionId);
            return response()->json([
                'message' => 'Danh sách bài học.',
                'data' => $lessons
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách bài học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết bài học
    public function show($id)
    {
        try {
            $lesson = $this->lessonService->getLessonById($id);
            return response()->json([
                'message' => 'Chi tiết bài học.',
                'data' => $lesson
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Bài học không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Tạo mới bài học
    public function store(LessonRequest $request)
    {
        try {
            // Lấy thông tin course_session_id từ request
            $data = $request->validated();
            $lesson = $this->lessonService->createLesson($data); // Tạo bài học với course_session_id
            return response()->json([
                'message' => 'Bài học đã được tạo.',
                'data' => $lesson
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo bài học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Cập nhật bài học
    public function update(LessonRequest $request, $id)
    {
        try {
            $lesson = $this->lessonService->updateLesson($id, $request->validated());
            return response()->json([
                'message' => 'Bài học đã được cập nhật.',
                'data' => $lesson
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Bài học không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Xóa bài học
    public function destroy($id)
    {
        try {
            $this->lessonService->deleteLesson($id);
            return response()->json([
                'message' => 'Bài học đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Bài học không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}