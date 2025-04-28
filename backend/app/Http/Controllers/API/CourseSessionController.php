<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\CourseSessionService;
use App\Http\Requests\CourseSessionRequest;
use Exception;

class CourseSessionController extends Controller
{
    protected $courseSessionService;

    public function __construct(CourseSessionService $courseSessionService)
    {
        $this->courseSessionService = $courseSessionService;
    }

    // Lấy danh sách buổi học
    public function index()
    {
        try {
            $sessions = $this->courseSessionService->getAllSessions();
            return response()->json([
                'message' => 'Danh sách buổi học.',
                'data' => $sessions
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách buổi học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết buổi học
    public function show($id)
    {
        try {
            $session = $this->courseSessionService->getSessionById($id);
            return response()->json([
                'message' => 'Chi tiết buổi học.',
                'data' => $session
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Buổi học không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Tạo mới buổi học
    public function store(CourseSessionRequest $request)
    {
        try {
            $session = $this->courseSessionService->createSession($request->validated());
            return response()->json([
                'message' => 'Buổi học đã được tạo.',
                'data' => $session
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo buổi học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật buổi học
    public function update(CourseSessionRequest $request, $id)
    {
        try {
            $session = $this->courseSessionService->updateSession($id, $request->validated());
            return response()->json([
                'message' => 'Buổi học đã được cập nhật.',
                'data' => $session
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Buổi học không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Xóa buổi học
    public function destroy($id)
    {
        try {
            $this->courseSessionService->deleteSession($id);
            return response()->json([
                'message' => 'Buổi học đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Buổi học không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}