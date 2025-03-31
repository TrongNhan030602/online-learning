<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Http\Controllers\Controller;
use App\Exceptions\ApiExceptionHandler;
use App\Services\TrainingProgramService;
use App\Http\Requests\TrainingProgram\StoreTrainingProgramRequest;
use App\Http\Requests\TrainingProgram\UpdateTrainingProgramRequest;

class TrainingProgramController extends Controller
{
    protected $trainingProgramService;

    public function __construct(TrainingProgramService $trainingProgramService)
    {
        $this->trainingProgramService = $trainingProgramService;
    }
    public function getByCourseId($courseId)
    {
        try {
            // Kiểm tra xem courseId có hợp lệ không
            if (!$courseId) {
                return response()->json([
                    'error' => 'Thiếu courseId!',
                    'message' => 'Vui lòng cung cấp courseId hợp lệ.'
                ], 400);
            }

            // Lấy chương trình đào tạo theo courseId
            $trainingProgram = $this->trainingProgramService->getTrainingProgramByCourseId($courseId);

            // Kiểm tra nếu không tìm thấy chương trình đào tạo
            if (!$trainingProgram) {
                return response()->json([
                    'error' => 'Không tìm thấy chương trình đào tạo!',
                    'message' => 'Chương trình đào tạo cho khóa học này không tồn tại.'
                ], 404);
            }

            // Trả về kết quả chương trình đào tạo
            return response()->json($trainingProgram);
        } catch (Exception $e) {
            // Xử lý ngoại lệ
            return ApiExceptionHandler::handle($e);
        }
    }


    public function getAll()
    {
        try {
            $trainingPrograms = $this->trainingProgramService->getAll();
            return response()->json($trainingPrograms);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    public function getById($id)
    {
        try {
            $trainingProgram = $this->trainingProgramService->getById($id);

            if (!$trainingProgram) {
                return response()->json([
                    'error' => 'Không tìm thấy chương trình đào tạo!',
                    'message' => 'Chương trình đào tạo không tồn tại.'
                ], 404);
            }

            return response()->json($trainingProgram);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    public function create(StoreTrainingProgramRequest $request)
    {
        try {
            $trainingProgram = $this->trainingProgramService->create($request->validated());
            return response()->json([
                'message' => 'Tạo chương trình đào tạo thành công!',
                'data' => $trainingProgram
            ], 201);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    public function update(UpdateTrainingProgramRequest $request, $id)
    {
        try {
            $trainingProgram = $this->trainingProgramService->update($id, $request->validated());
            return response()->json([
                'message' => 'Cập nhật chương trình đào tạo thành công!',
                'data' => $trainingProgram
            ]);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    public function delete($id)
    {
        try {
            $deleted = $this->trainingProgramService->delete($id);

            if (!$deleted) {
                return response()->json([
                    'error' => 'Xóa thất bại!',
                    'message' => 'Chương trình đào tạo không tồn tại hoặc đã bị xóa trước đó.'
                ], 404);
            }

            return response()->json([
                'message' => 'Xóa chương trình đào tạo thành công!'
            ], 200);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }
}