<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Services\ExamScheduleService;
use App\Http\Requests\ExamScheduleRequest\ExamScheduleRequest;
use Exception;

class ExamScheduleController extends Controller
{
    protected $examScheduleService;

    public function __construct(ExamScheduleService $examScheduleService)
    {
        $this->examScheduleService = $examScheduleService;
    }

    public function index()
    {
        try {
            $data = $this->examScheduleService->getAll();

            // Kiểm tra nếu không có dữ liệu
            if ($data->isEmpty()) {
                return response()->json([
                    'message' => 'Không có lịch thi nào',
                ], 404); // Mã trạng thái HTTP: 404 Not Found
            }

            return response()->json([
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách lịch thi.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }


    public function store(ExamScheduleRequest $request)
    {
        try {
            $data = $this->examScheduleService->create($request->validated());
            return response()->json([
                'message' => 'Lịch thi đã được tạo thành công',
                'data' => $data
            ], 201); // Mã trạng thái HTTP: 201 Created
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo lịch thi.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    public function show($id)
    {
        try {
            $data = $this->examScheduleService->getById($id);
            return response()->json([
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy lịch thi.',
                'error' => $e->getMessage()
            ], 404); // Mã trạng thái HTTP: 404 Not Found
        }
    }

    public function update(ExamScheduleRequest $request, $id)
    {
        try {
            $data = $this->examScheduleService->update($id, $request->validated());
            return response()->json([
                'message' => 'Lịch thi đã được cập nhật thành công',
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật lịch thi.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    public function destroy($id)
    {
        try {
            $this->examScheduleService->delete($id);
            return response()->json([
                'message' => 'Lịch thi đã được xóa thành công'
            ], 204); // Mã trạng thái HTTP: 204 No Content
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa lịch thi.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }
}