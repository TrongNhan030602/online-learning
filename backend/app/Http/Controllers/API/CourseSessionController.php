<?php
namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Services\CourseSessionService;
use App\Http\Requests\CourseSessionRequest\CourseSessionRequest;

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

            if (!$session) {
                return response()->json([
                    'message' => 'Buổi học không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết buổi học.',
                'data' => $session
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy chi tiết buổi học.',
                'error' => $e->getMessage()
            ], 500);
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

            if (!$session) {
                return response()->json([
                    'message' => 'Buổi học không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Buổi học đã được cập nhật.',
                'data' => $session
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật buổi học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Xóa buổi học
    public function destroy($id)
    {
        try {
            $deleted = $this->courseSessionService->deleteSession($id);

            if (!$deleted) {
                return response()->json([
                    'message' => 'Buổi học không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Buổi học đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa buổi học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}