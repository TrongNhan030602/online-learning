<?php
namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\LearningResultService;
use App\Http\Requests\LearningResultRequest\LearningResultRequest;

class LearningResultController extends Controller
{
    protected $service;

    public function __construct(LearningResultService $service)
    {
        $this->service = $service;
    }

    // Lấy tất cả kết quả học tập
    public function index()
    {
        $learningResults = $this->service->getAll();
        return response()->json($learningResults);
    }

    // Lấy kết quả học tập theo ID
    public function show($id)
    {
        $learningResult = $this->service->getById($id);
        return response()->json($learningResult);
    }

    // Tạo mới kết quả học tập
    public function store(LearningResultRequest $request)
    {
        $data = $request->validated();
        $learningResult = $this->service->create($data);
        return response()->json($learningResult, 201);
    }

    // Cập nhật kết quả học tập
    public function update(LearningResultRequest $request, $id)
    {
        $data = $request->validated();
        $learningResult = $this->service->update($id, $data);
        return response()->json($learningResult);
    }

    // Xóa kết quả học tập
    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Kết quả học tập đã được xóa']);
    }
}