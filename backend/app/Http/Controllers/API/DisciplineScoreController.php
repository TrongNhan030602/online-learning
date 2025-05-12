<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\DisciplineScoreService;
use App\Http\Requests\DisciplineScoreRequest\DisciplineScoreRequest;

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
                    'message' => 'Không có điểm rèn luyện nào.',
                ], 404);
            }

            $result = $data->map(function ($item) {
                return [
                    'id' => $item->id,
                    'student_training_program_id' => $item->student_training_program_id,
                    'user_id' => $item->studentTrainingProgram->user->id ?? null,
                    'student_name' => $item->studentTrainingProgram->user->name ?? null,
                    'semester_id' => $item->semester_id,
                    'semester_name' => $item->semester->name ?? null,
                    'training_program' => [
                        'id' => $item->semester->trainingProgram->id ?? null,
                        'name' => $item->semester->trainingProgram->name ?? null,
                        'code' => $item->semester->trainingProgram->code ?? null,
                    ],
                    'score' => $item->score,
                    'evaluation' => $item->evaluation,
                ];
            });

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách điểm rèn luyện.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $data = $this->service->getById($id);
            if (!$data) {
                return response()->json([
                    'message' => 'Không tìm thấy điểm rèn luyện với ID ' . $id,
                ], 404);
            }
            return response()->json($data);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy điểm rèn luyện.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(DisciplineScoreRequest $request)
    {
        try {
            $data = $this->service->create($request->validated());
            return response()->json($data, 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo điểm rèn luyện.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(DisciplineScoreRequest $request, $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
            if (!$data) {
                return response()->json([
                    'message' => 'Không tìm thấy điểm rèn luyện để cập nhật.',
                ], 404);
            }
            return response()->json($data);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật điểm rèn luyện.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $deleted = $this->service->delete($id);
            if (!$deleted) {
                return response()->json([
                    'message' => 'Không tìm thấy điểm rèn luyện để xóa.',
                ], 404);
            }
            return response()->json(['message' => 'Xóa thành công']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa điểm rèn luyện.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByStudent()
    {
        try {
            $userId = auth()->user()->id; // Lấy ID của người dùng hiện tại
            $data = $this->service->getByStudent($userId);

            if ($data->isEmpty()) {
                return response()->json([
                    'message' => 'Không có điểm rèn luyện nào.',
                ], 404);
            }

            return response()->json($data);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy điểm rèn luyện.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}