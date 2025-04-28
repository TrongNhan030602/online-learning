<?php
namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Services\TrainingProgramService;
use App\Http\Requests\TrainingProgramRequest\TrainingProgramRequest;

class TrainingProgramController extends Controller
{
    protected $service;

    public function __construct(TrainingProgramService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->getAll());
    }

    public function show($id)
    {
        try {
            return response()->json($this->service->getById($id));
        } catch (Exception $e) {
            return response()->json(['message' => 'Không tìm thấy chương trình đào tạo.', 'error' => $e->getMessage()], 404);
        }
    }

    public function store(TrainingProgramRequest $request)
    {
        try {
            $program = $this->service->create($request->validated());
            return response()->json(['message' => 'Tạo chương trình đào tạo thành công.', 'data' => $program], 201);
        } catch (Exception $e) {
            return response()->json(['message' => 'Lỗi khi tạo chương trình.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(TrainingProgramRequest $request, $id)
    {
        try {
            $program = $this->service->update($id, $request->validated());
            return response()->json(['message' => 'Cập nhật thành công.', 'data' => $program]);
        } catch (Exception $e) {
            return response()->json(['message' => 'Lỗi khi cập nhật.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->delete($id);
            return response()->json(['message' => 'Đã xóa chương trình.']);
        } catch (Exception $e) {
            return response()->json(['message' => 'Lỗi khi xóa chương trình.', 'error' => $e->getMessage()], 500);
        }
    }

    public function filterByLevel($level)
    {
        try {
            return response()->json($this->service->getByLevel($level));
        } catch (Exception $e) {
            return response()->json(['message' => 'Lỗi khi lọc theo loại.', 'error' => $e->getMessage()], 500);
        }
    }
}