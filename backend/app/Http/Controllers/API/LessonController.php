<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Services\LessonService;
use App\Http\Controllers\Controller;
use App\Http\Requests\LessonRequest\LessonRequest;
use Illuminate\Http\JsonResponse;

class LessonController extends Controller
{
    protected $lessonService;

    public function __construct(LessonService $lessonService)
    {
        $this->lessonService = $lessonService;
    }

    // Lấy danh sách bài học theo buổi học
    public function index($courseSessionId): JsonResponse
    {
        try {
            $lessons = $this->lessonService->getAllLessonsBySessionId($courseSessionId);

            if ($lessons->isEmpty()) {
                return response()->json([
                    'message' => 'Không có bài học nào cho buổi học này.'
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách bài học.',
                'data' => $lessons
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy danh sách bài học.');
        }
    }

    // Lấy chi tiết bài học
    public function show($id): JsonResponse
    {
        try {
            $lesson = $this->lessonService->getLessonById($id);

            if (!$lesson) {
                return response()->json([
                    'message' => 'Bài học không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết bài học.',
                'data' => $lesson
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi lấy chi tiết bài học.');
        }
    }

    // Tạo mới bài học
    public function store(LessonRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $lesson = $this->lessonService->createLesson($data);

            return response()->json([
                'message' => 'Bài học đã được tạo.',
                'data' => $lesson
            ], 201);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi tạo bài học.');
        }
    }

    // Cập nhật bài học
    public function update(LessonRequest $request, $id): JsonResponse
    {
        try {
            $lesson = $this->lessonService->updateLesson($id, $request->validated());

            if (!$lesson) {
                return response()->json([
                    'message' => 'Bài học không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Bài học đã được cập nhật.',
                'data' => $lesson
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi cập nhật bài học.');
        }
    }

    // Xóa bài học
    public function destroy($id): JsonResponse
    {
        try {
            $deleted = $this->lessonService->deleteLesson($id);

            if (!$deleted) {
                return response()->json([
                    'message' => 'Bài học không tồn tại hoặc đã bị xóa.'
                ], 404);
            }

            return response()->json([
                'message' => 'Bài học đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return $this->handleException($e, 'Lỗi khi xóa bài học.');
        }
    }

    // Hàm xử lý lỗi chung
    private function handleException(Exception $e, string $message): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'error' => $e->getMessage()
        ], 500);
    }
}