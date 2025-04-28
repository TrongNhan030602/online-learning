<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\DisciplineScoreRequest;
use App\Services\DisciplineScoreService;
use Illuminate\Http\Request;

class DisciplineScoreController extends Controller
{
    protected $service;

    public function __construct(DisciplineScoreService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $data = $this->service->getAll();
        return response()->json($data);
    }

    public function show($id)
    {
        $data = $this->service->getById($id);
        return response()->json($data);
    }

    public function store(DisciplineScoreRequest $request)
    {
        $data = $this->service->create($request->validated());
        return response()->json($data, 201);
    }

    public function update(DisciplineScoreRequest $request, $id)
    {
        $data = $this->service->update($id, $request->validated());
        return response()->json($data);
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Xóa thành công']);
    }
}