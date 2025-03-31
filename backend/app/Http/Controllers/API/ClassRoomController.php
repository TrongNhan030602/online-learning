<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ClassRoomService;
use App\Exceptions\ApiExceptionHandler;
use App\Http\Requests\ClassRoom\StoreClassRoomRequest;
use App\Http\Requests\ClassRoom\UpdateClassRoomRequest;

class ClassRoomController extends Controller
{
    protected $classRoomService;

    public function __construct(ClassRoomService $classRoomService)
    {
        $this->classRoomService = $classRoomService;
    }

    public function getAll()
    {
        try {
            return response()->json($this->classRoomService->getAll());
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    public function getById($id)
    {
        try {
            $classRoom = $this->classRoomService->getById($id);

            if (!$classRoom) {
                return response()->json([
                    'error' => 'Không tìm thấy lớp học!',
                    'message' => 'Lớp học không tồn tại.'
                ], 404);
            }

            return response()->json($classRoom);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    public function getByCourseId($courseId)
    {
        try {
            if (!$courseId) {
                return response()->json([
                    'error' => 'Thiếu courseId!',
                    'message' => 'Vui lòng cung cấp courseId hợp lệ.'
                ], 400);
            }

            $classrooms = $this->classRoomService->getByCourseId($courseId);

            return response()->json($classrooms);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    public function create(StoreClassRoomRequest $request)
    {
        try {
            $classRoom = $this->classRoomService->create($request->validated());

            return response()->json([
                'message' => 'Tạo lớp học thành công!',
                'data' => $classRoom
            ], 201);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    public function update(UpdateClassRoomRequest $request, $id)
    {
        try {
            $classRoom = $this->classRoomService->update($id, $request->validated());

            return response()->json([
                'message' => 'Cập nhật lớp học thành công!',
                'data' => $classRoom
            ]);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);  // Sử dụng ApiExceptionHandler để xử lý lỗi
        }
    }

    public function delete($id)
    {
        try {
            $deleted = $this->classRoomService->delete($id);

            if (!$deleted) {
                return response()->json([
                    'error' => 'Xóa thất bại!',
                    'message' => 'Lớp học không tồn tại hoặc đã bị xóa trước đó.'
                ], 404);
            }

            return response()->json([
                'message' => 'Xóa lớp học thành công!'
            ], 200);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }
}