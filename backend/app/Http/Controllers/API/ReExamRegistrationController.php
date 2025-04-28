<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\ReExamRegistrationService;
use App\Http\Requests\ReExamRegistrationRequest;
use Exception;

class ReExamRegistrationController extends Controller
{
    protected $service;

    public function __construct(ReExamRegistrationService $service)
    {
        $this->service = $service;
    }

    // Lấy tất cả đăng ký thi lại
    public function index(): JsonResponse
    {
        try {
            $reExamRegistrations = $this->service->getAll();

            if ($reExamRegistrations->isEmpty()) {
                return response()->json([
                    'message' => 'Không có đăng ký thi lại nào.'
                ], 404);
            }

            return response()->json([
                'data' => $reExamRegistrations
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy dữ liệu đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy đăng ký thi lại theo ID
    public function show($id): JsonResponse
    {
        try {
            $reExamRegistration = $this->service->getById($id);

            if (!$reExamRegistration) {
                return response()->json([
                    'message' => 'Đăng ký thi lại không tồn tại.'
                ], 404);
            }

            return response()->json([
                'data' => $reExamRegistration
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy thông tin đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo mới đăng ký thi lại
    public function store(ReExamRegistrationRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $reExamRegistration = $this->service->create($data);

            return response()->json([
                'message' => 'Đăng ký thi lại thành công.',
                'data' => $reExamRegistration
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi tạo đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật đăng ký thi lại
    public function update(ReExamRegistrationRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $reExamRegistration = $this->service->update($id, $data);

            if (!$reExamRegistration) {
                return response()->json([
                    'message' => 'Không tìm thấy đăng ký thi lại để cập nhật.'
                ], 404);
            }

            return response()->json([
                'message' => 'Cập nhật đăng ký thi lại thành công.',
                'data' => $reExamRegistration
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi cập nhật đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa đăng ký thi lại
    public function destroy($id): JsonResponse
    {
        try {
            $this->service->delete($id);

            return response()->json([
                'message' => 'Đăng ký thi lại đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi xóa đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}