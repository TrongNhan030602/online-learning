<?php
namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Services\TrainingProgramService;
use App\Http\Requests\TrainingProgramRequest\TrainingProgramRequest;
use App\Models\Semester;
use Illuminate\Http\JsonResponse;

class TrainingProgramController extends Controller
{
    protected $service;

    public function __construct(TrainingProgramService $service)
    {
        $this->service = $service;
    }

    // Lấy tất cả chương trình đào tạo
    public function index(): JsonResponse
    {
        try {
            $programs = $this->service->getAll();

            if ($programs->isEmpty()) {
                return response()->json([
                    'message' => 'Không có chương trình đào tạo nào.'
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách chương trình đào tạo.',
                'data' => $programs
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết chương trình đào tạo
    public function show($id): JsonResponse
    {
        try {
            $program = $this->service->getById($id);

            if (!$program) {
                return response()->json([
                    'message' => 'Chương trình đào tạo không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết chương trình đào tạo.',
                'data' => $program
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy chi tiết chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo mới chương trình đào tạo
    public function store(TrainingProgramRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $program = $this->service->create($data);

            if (in_array($program->level, ['college', 'intermediate'])) {
                $semester = new Semester([
                    'name' => 'Học kỳ 1',
                    'training_program_id' => $program->id
                ]);
                $semester->save();
            }

            return response()->json([
                'message' => 'Tạo chương trình đào tạo thành công.',
                'data' => $program
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật chương trình đào tạo
    public function update(TrainingProgramRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $program = $this->service->update($id, $data);

            if (!$program) {
                return response()->json([
                    'message' => 'Không tìm thấy chương trình đào tạo để cập nhật.'
                ], 404);
            }

            return response()->json([
                'message' => 'Cập nhật chương trình đào tạo thành công.',
                'data' => $program
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa chương trình đào tạo
    public function destroy($id): JsonResponse
    {
        try {
            $deleted = $this->service->delete($id);

            if (!$deleted) {
                return response()->json([
                    'message' => 'Không tìm thấy chương trình đào tạo để xóa.'
                ], 404);
            }

            return response()->json([
                'message' => 'Xóa chương trình đào tạo thành công.'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lọc chương trình đào tạo theo cấp bậc
    public function filterByLevel($level): JsonResponse
    {
        try {
            $programs = $this->service->getByLevel($level);

            if ($programs->isEmpty()) {
                return response()->json([
                    'message' => "Không có chương trình đào tạo nào với cấp bậc '{$level}'."
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách chương trình đào tạo theo cấp bậc.',
                'data' => $programs
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lọc chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}