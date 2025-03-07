<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ProgressService;
use Illuminate\Http\Request;
use Exception;

class ProgressController extends Controller
{
    protected $progressService;

    public function __construct(ProgressService $progressService)
    {
        $this->progressService = $progressService;
    }

    // Lấy danh sách tiến độ, có thể lọc theo user_id hoặc lesson_id
    public function index(Request $request)
    {
        try {
            $filters = $request->only(['user_id', 'lesson_id']);
            $progresses = $this->progressService->listProgress($filters);
            return response()->json($progresses, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không thể lấy danh sách tiến độ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết tiến độ theo ID
    public function show($id)
    {
        try {
            $progress = $this->progressService->getProgressById((int) $id);
            return response()->json($progress, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không tìm thấy tiến độ.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Tạo mới tiến độ (khi học viên bắt đầu bài học)
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'user_id' => 'required|exists:users,id',
                'lesson_id' => 'required|exists:lessons,id'
            ], [
                'user_id.required' => 'Trường user_id không được bỏ trống.',
                'lesson_id.required' => 'Trường lesson_id không được bỏ trống.'
            ]);

            $progress = $this->progressService->createProgress($data);
            return response()->json($progress, 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Tạo tiến độ thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật tiến độ (ví dụ: đánh dấu hoàn thành bài học)
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'completed' => 'required|boolean',
                'completed_at' => 'nullable|date'
            ], [
                'completed.required' => 'Trường trạng thái hoàn thành không được bỏ trống.'
            ]);

            $progress = $this->progressService->updateProgress((int) $id, $data);
            return response()->json($progress, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Cập nhật tiến độ thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}