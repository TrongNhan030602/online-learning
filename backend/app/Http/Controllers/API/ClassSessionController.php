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

    // Lấy danh sách bài học có thể thêm cho buổi học
    public function availableLessons($sessionId)
    {
        try {
            $availableLessons = $this->classSessionService->getAvailableLessons($sessionId);

            // Kiểm tra nếu không có bài học có thể thêm vào
            if ($availableLessons->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy bài học có sẵn để thêm vào buổi học.'
                ], 404);
            }

            return response()->json($availableLessons);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }


    // Lấy danh sách bài học đang có cho buổi học
    public function currentLessons($sessionId)
    {
        try {
            $currentLessons = $this->classSessionService->getCurrentLessons($sessionId);

            // Kiểm tra xem danh sách có trống không
            if ($currentLessons->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy bài học đang có trong buổi học.'
                ], 404);
            }

            return response()->json($currentLessons);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }


    // Thêm bài học vào buổi học
    public function addLesson(Request $request, $sessionId)
    {
        try {
            $request->validate([
                'lesson_ids' => 'required|array',
                'lesson_ids.*' => 'exists:lessons,id'
            ]);

            $this->classSessionService->addLessonsToSession($sessionId, $request->lesson_ids);

            return response()->json([
                'message' => 'Thêm bài học vào buổi học thành công.'
            ], 200);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    // Xóa bài học khỏi buổi học
    public function removeLesson($sessionId, $lessonId)
    {
        try {
            $this->classSessionService->removeLessonFromSession($sessionId, $lessonId);

            return response()->json([
                'message' => 'Xóa bài học khỏi buổi học thành công.'
            ], 200);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }
}