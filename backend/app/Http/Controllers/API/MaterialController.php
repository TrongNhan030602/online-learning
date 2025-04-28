<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\MaterialRequest\MaterialRequest;
use App\Services\MaterialService;
use Exception;
use Illuminate\Http\JsonResponse;

class MaterialController extends Controller
{
    protected $materialService;

    public function __construct(MaterialService $materialService)
    {
        $this->materialService = $materialService;
    }

    // Lấy danh sách tài liệu theo bài học
    public function index($lessonId): JsonResponse
    {
        try {
            $materials = $this->materialService->getAllMaterialsByLessonId($lessonId);

            if ($materials->isEmpty()) {
                return response()->json([
                    'message' => 'Không có tài liệu nào cho bài học này.'
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách tài liệu.',
                'data' => $materials
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách tài liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết tài liệu
    public function show($id): JsonResponse
    {
        try {
            $material = $this->materialService->getMaterialById($id);

            if (!$material) {
                return response()->json([
                    'message' => 'Tài liệu không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết tài liệu.',
                'data' => $material
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy chi tiết tài liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo mới tài liệu
    public function store(MaterialRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data = $this->handleFileUpload($request, $data);

            $material = $this->materialService->createMaterial($data);

            return response()->json([
                'message' => 'Tài liệu đã được tạo.',
                'data' => $material
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo tài liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật tài liệu với file (nếu có)
    public function updateWithFile(MaterialRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $data = $this->handleFileUpload($request, $data);

            $material = $this->materialService->updateMaterial($id, $data);

            return response()->json([
                'message' => 'Tài liệu đã được cập nhật.',
                'data' => $material
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Tài liệu không tồn tại hoặc lỗi khi cập nhật.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Cập nhật tài liệu không có file
    public function update(MaterialRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();

            $material = $this->materialService->updateMaterial($id, $data);

            return response()->json([
                'message' => 'Tài liệu đã được cập nhật.',
                'data' => $material
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Tài liệu không tồn tại hoặc lỗi khi cập nhật.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Xóa tài liệu
    public function destroy($id): JsonResponse
    {
        try {
            $this->materialService->deleteMaterial($id);

            return response()->json([
                'message' => 'Tài liệu đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Tài liệu không tồn tại hoặc lỗi khi xóa.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Hàm xử lý upload file cho tài liệu
    private function handleFileUpload($request, $data)
    {
        if ($request->type === 'file' && $request->hasFile('file_path')) {
            $path = $request->file('file_path')->store('materials', 'public');
            $data['file_path'] = '/storage/' . $path;
        }

        return $data;
    }
}