<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Services\ExamScheduleService;
use App\Http\Requests\ExamScheduleRequest\ExamScheduleRequest;

class ExamScheduleController extends Controller
{
    protected $examScheduleService;

    public function __construct(ExamScheduleService $examScheduleService)
    {
        $this->examScheduleService = $examScheduleService;
    }

    public function index()
    {
        return response()->json([
            'data' => $this->examScheduleService->getAll()
        ]);
    }

    public function store(ExamScheduleRequest $request)
    {
        $data = $this->examScheduleService->create($request->validated());
        return response()->json([
            'message' => 'Exam schedule created successfully',
            'data' => $data
        ], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $data = $this->examScheduleService->getById($id);
        return response()->json(['data' => $data]);
    }

    public function update(ExamScheduleRequest $request, $id)
    {
        $data = $this->examScheduleService->update($id, $request->validated());
        return response()->json([
            'message' => 'Exam schedule updated successfully',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {
        $this->examScheduleService->delete($id);
        return response()->json([
            'message' => 'Exam schedule deleted successfully'
        ], Response::HTTP_NO_CONTENT);
    }
}