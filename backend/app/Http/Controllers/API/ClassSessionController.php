<?php


namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Services\ClassSessionService;
use App\Exceptions\ApiExceptionHandler;
use Illuminate\Http\Request;
use App\Http\Requests\ClassSession\CreateClassSessionRequest;
use App\Http\Requests\ClassSession\UpdateClassSessionRequest;

class ClassSessionController extends Controller
{
    protected $classSessionService;

    public function __construct(ClassSessionService $classSessionService)
    {
        $this->classSessionService = $classSessionService;
    }

    // Lấy danh sách buổi học của lớp học
    public function index($classroomId)
    {
        try {
            $sessions = $this->classSessionService->getSessionsByClassroomId($classroomId);

            if ($sessions->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy buổi học nào!'
                ], 404);
            }

            return response()->json($sessions);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Xử lý lỗi
        }
    }

    // Thêm buổi học mới
    public function store(CreateClassSessionRequest $request, $classroomId)
    {
        try {
            $validated = $request->validated();
            $session = $this->classSessionService->createSession($classroomId, $validated);
            return response()->json($session, 201);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Xử lý lỗi
        }
    }

    // Cập nhật buổi học
    public function update(UpdateClassSessionRequest $request, $classroomId, $sessionId)
    {
        try {
            $validated = $request->validated();  // Lấy dữ liệu đã được validate

            // Cập nhật buổi học
            $session = $this->classSessionService->updateSession($sessionId, $validated);

            if (!$session) {
                return response()->json([
                    'message' => 'Không tìm thấy buổi học!'
                ], 404);
            }

            // Xử lý các bài học liên kết (lesson_ids) sau khi cập nhật buổi học
            if (isset($validated['lesson_ids'])) {
                $session->lessons()->sync($validated['lesson_ids']);  // Cập nhật mối quan hệ bài học với buổi học
            }

            return response()->json($session);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }


    // Xóa buổi học
    public function destroy($classroomId, $sessionId)
    {
        try {
            $isDeleted = $this->classSessionService->deleteSession($sessionId);

            if (!$isDeleted) {
                return response()->json([
                    'message' => 'Không thể xóa buổi học!'
                ], 404);
            }

            return response()->json([
                'message' => 'Buổi học đã bị xóa thành công.'
            ]);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Xử lý lỗi
        }
    }
    public function addLessons(Request $request, $classroomId, $sessionId)
    {
        try {
            // Validate request
            $lessonIds = $request->input('lesson_ids');
            if (empty($lessonIds)) {
                return response()->json([
                    'message' => 'Vui lòng cung cấp danh sách bài học.'
                ], 400);
            }

            // Gọi service để thêm bài học vào buổi học
            $session = $this->classSessionService->addLessonsToSession($sessionId, $lessonIds);

            if (!$session) {
                return response()->json([
                    'message' => 'Không tìm thấy buổi học!'
                ], 404);
            }

            return response()->json([
                'message' => 'Bài học đã được thêm vào buổi học thành công.'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Cập nhật bài học trong buổi học
    public function updateLessons(Request $request, $classroomId, $sessionId)
    {
        try {
            $lessonIds = $request->input('lesson_ids');
            if (empty($lessonIds)) {
                return response()->json(['message' => 'Vui lòng cung cấp danh sách bài học.'], 400);
            }

            $session = $this->classSessionService->updateLessons($sessionId, $lessonIds);

            if (!$session) {
                return response()->json(['message' => 'Không tìm thấy buổi học!'], 404);
            }

            return response()->json(['message' => 'Bài học đã được cập nhật trong buổi học thành công.']);
        } catch (Exception $e) {
            return response()->json(['message' => 'Có lỗi xảy ra.', 'error' => $e->getMessage()], 500);
        }
    }

    // Xóa bài học khỏi buổi học
    public function removeLesson($classroomId, $sessionId, $lessonId)
    {
        try {
            $isRemoved = $this->classSessionService->removeLesson($sessionId, $lessonId);

            if (!$isRemoved) {
                return response()->json(['message' => 'Không tìm thấy bài học hoặc buổi học!'], 404);
            }

            return response()->json(['message' => 'Bài học đã được xóa khỏi buổi học thành công.']);
        } catch (Exception $e) {
            return response()->json(['message' => 'Có lỗi xảy ra.', 'error' => $e->getMessage()], 500);
        }
    }
}