<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Services\MaterialService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\MaterialRequest\MaterialRequest;
use App\Http\Requests\MaterialRequest\MaterialUpdateRequest;

class MaterialController extends Controller
{
    protected $materialService;

    public function __construct(MaterialService $materialService)
    {
        $this->materialService = $materialService;
    }

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

    public function updateWithFile(MaterialRequest $request, $id): JsonResponse
    {
        try {
            $material = $this->materialService->getMaterialById($id);

            if (!$material) {
                return response()->json([
                    'message' => 'Tài liệu không tồn tại.'
                ], 404);
            }

            $data = $request->validated();

            // Kiểm tra nếu loại tài liệu thay đổi từ file sang link
            if ($material->type === 'file' && $data['type'] === 'link') {
                // Xóa file cũ trong storage nếu tồn tại
                if ($material->file_path) {
                    if (Storage::disk('public')->exists($material->file_path)) {
                        $deleted = Storage::disk('public')->delete($material->file_path);
                        if ($deleted) {
                            \Log::info("File đã được xóa: " . $material->file_path);
                        } else {
                            \Log::error("Không thể xóa file: " . $material->file_path);
                        }
                    } else {
                        \Log::warning("File không tồn tại: " . $material->file_path);
                    }
                }
            }

            // Xử lý upload file mới nếu loại là file
            $data = $this->handleFileUpload($request, $data, $material);

            // Cập nhật tài liệu
            $updatedMaterial = $this->materialService->updateMaterial($id, $data);

            return response()->json([
                'message' => 'Tài liệu đã được cập nhật.',
                'data' => $updatedMaterial
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật tài liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function update(MaterialUpdateRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();

            $material = $this->materialService->getMaterialById($id);

            if (!$material) {
                return response()->json([
                    'message' => 'Tài liệu không tồn tại.'
                ], 404);
            }
            // Kiểm tra nếu loại tài liệu thay đổi từ file sang link
            if ($data['type'] === 'link' && $material->file_path) {
                // Xóa file cũ trong storage nếu tồn tại
                Storage::disk('public')->exists($material->file_path);
                $deleted = Storage::disk('public')->delete($material->file_path);


            }
            $updatedMaterial = $this->materialService->updateMaterial($id, $data);

            return response()->json([
                'message' => 'Tài liệu đã được cập nhật.',
                'data' => $updatedMaterial
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật tài liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $material = $this->materialService->getMaterialById($id);

            if (!$material) {
                return response()->json([
                    'message' => 'Tài liệu không tồn tại.'
                ], 404);
            }

            // Xóa file vật lý nếu có
            if ($material->type === 'file' && $material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }

            $this->materialService->deleteMaterial($id);

            return response()->json([
                'message' => 'Tài liệu đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa tài liệu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function handleFileUpload($request, $data, $material = null)
    {
        if ($request->type == 'file' && $request->hasFile('file_path')) {
            if ($material && $material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }

            $originalName = $request->file('file_path')->getClientOriginalName();
            $folder = 'materials';
            $path = $request->file('file_path')->storeAs($folder, $originalName, 'public');

            $data['file_path'] = $folder . '/' . $originalName;
        }

        return $data;
    }
}