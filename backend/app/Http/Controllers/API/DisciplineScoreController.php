<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\DisciplineScoreRequest;
use App\Services\DisciplineScoreService;
use Illuminate\Http\Request;
use Exception;

class DisciplineScoreController extends Controller
{
    protected $service;

    public function __construct(DisciplineScoreService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        try {
            $data = $this->service->getAll();
            if ($data->isEmpty()) {
                return response()->json([
                    'message' => 'Không có điểm kỷ luật nào.',
                ], 404); // Không tìm thấy dữ liệu, trả về 404 Not Found
            }
            return response()->json($data);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách điểm kỷ luật.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    public function show($id)
    {
        try {
            $data = $this->service->getById($id);
            if (!$data) {
                return response()->json([
                    'message' => 'Không tìm thấy điểm kỷ luật với ID ' . $id,
                ], 404); // Không tìm thấy dữ liệu, trả về 404 Not Found
            }
            return response()->json($data);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy điểm kỷ luật.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    public function store(DisciplineScoreRequest $request)
    {
        try {
            $data = $this->service->create($request->validated());
            return response()->json($data, 201); // Mã trạng thái HTTP: 201 Created
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo điểm kỷ luật.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    public function update(DisciplineScoreRequest $request, $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
            if (!$data) {
                return response()->json([
                    'message' => 'Không tìm thấy điểm kỷ luật để cập nhật.',
                ], 404); // Không tìm thấy dữ liệu để cập nhật, trả về 404 Not Found
            }
            return response()->json($data);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật điểm kỷ luật.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    public function destroy($id)
    {
        try {
            $deleted = $this->service->delete($id);
            if (!$deleted) {
                return response()->json([
                    'message' => 'Không tìm thấy điểm kỷ luật để xóa.',
                ], 404); // Không tìm thấy dữ liệu để xóa, trả về 404 Not Found
            }
            return response()->json(['message' => 'Xóa thành công']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa điểm kỷ luật.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }
}