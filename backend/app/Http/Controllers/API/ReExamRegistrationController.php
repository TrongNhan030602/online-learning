<?php
namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ReExamRegistrationService;
use App\Http\Requests\ReExamRegistrationRequest;

class ReExamRegistrationController extends Controller
{
    protected $service;

    public function __construct(ReExamRegistrationService $service)
    {
        $this->service = $service;
    }

    // Lấy tất cả đăng ký thi lại
    public function index()
    {
        $reExamRegistrations = $this->service->getAll();
        return response()->json($reExamRegistrations);
    }

    // Lấy đăng ký thi lại theo ID
    public function show($id)
    {
        $reExamRegistration = $this->service->getById($id);
        return response()->json($reExamRegistration);
    }

    // Tạo mới đăng ký thi lại
    public function store(ReExamRegistrationRequest $request)
    {
        $data = $request->validated();
        $reExamRegistration = $this->service->create($data);
        return response()->json($reExamRegistration, 201);
    }

    // Cập nhật đăng ký thi lại
    public function update(ReExamRegistrationRequest $request, $id)
    {
        $data = $request->validated();
        $reExamRegistration = $this->service->update($id, $data);
        return response()->json($reExamRegistration);
    }

    // Xóa đăng ký thi lại
    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Đăng ký thi lại đã được xóa']);
    }
}