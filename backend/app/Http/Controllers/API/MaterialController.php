<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\MaterialRequest\MaterialRequest;
use App\Services\MaterialService;
use Exception;

class MaterialController extends Controller
{
    protected $materialService;

    public function __construct(MaterialService $materialService)
    {
        $this->materialService = $materialService;
    }

    // Lấy danh sách tài liệu theo bài học
    public function index($lessonId)
    {
        try {
            $materials = $this->materialService->getAllMaterialsByLessonId($lessonId);
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
    public function show($id)
    {
        try {
            $material = $this->materialService->getMaterialById($id);
            return response()->json([
                'message' => 'Chi tiết tài liệu.',
                'data' => $material
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Tài liệu không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Tạo mới tài liệu
    public function store(MaterialRequest $request)
    {
        try {
            $data = $request->validated();

            // Nếu là file thì lưu file upload
            if ($request->type === 'file' && $request->hasFile('file_path')) {
                $path = $request->file('file_path')->store('materials', 'public');
                $data['file_path'] = '/storage/' . $path;
            }

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

    // Update bằng form-data (có file upload)
    public function updateWithFile(MaterialRequest $request, $id)
    {
        try {
            $data = $request->validated();

            if ($request->type === 'file' && $request->hasFile('file_path')) {
                $path = $request->file('file_path')->store('materials', 'public');
                $data['file_path'] = '/storage/' . $path;
            }

            $material = $this->materialService->updateMaterial($id, $data);

            return response()->json([
                'message' => 'Tài liệu đã được cập nhật.',
                'data' => $material
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Tài liệu không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Cập nhật tài liệu
    public function update(MaterialRequest $request, $id)
    {
        try {
            $material = $this->materialService->updateMaterial($id, $request->validated());
            return response()->json([
                'message' => 'Tài liệu đã được cập nhật.',
                'data' => $material
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Tài liệu không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Xóa tài liệu
    public function destroy($id)
    {
        try {
            $this->materialService->deleteMaterial($id);
            return response()->json([
                'message' => 'Tài liệu đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Tài liệu không tồn tại.',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}