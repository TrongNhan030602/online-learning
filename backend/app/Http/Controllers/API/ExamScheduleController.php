<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Services\ExamScheduleService;
use App\Http\Resources\ExamScheduleResource;
use App\Http\Requests\ExamScheduleRequest\ExamScheduleRequest;

class ExamScheduleController extends Controller
{
    protected $examScheduleService;

    public function __construct(ExamScheduleService $examScheduleService)
    {
        $this->examScheduleService = $examScheduleService;
    }

    // Lấy tất cả lịch thi, có thể lọc theo các tham số
    public function index()
    {
        try {
            $filters = request()->all();
            $data = $this->examScheduleService->getAll($filters);

            if ($data->isEmpty()) {
                return response()->json([
                    'message' => 'Không có lịch thi nào phù hợp với bộ lọc.'
                ], 200);
            }

            return response()->json([
                'data' => ExamScheduleResource::collection($data)
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách lịch thi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo lịch thi mới
    public function store(ExamScheduleRequest $request)
    {
        try {
            // Kiểm tra dữ liệu đã được xác thực
            $validatedData = $request->validated();
            // Kiểm tra và xử lý nếu `training_program_id` không tồn tại
            if (!isset($validatedData['training_program_id'])) {
                return response()->json([
                    'message' => 'Thông tin chương trình đào tạo không được cung cấp.'
                ], 400);
            }

            // Gọi service để tạo lịch thi
            $data = $this->examScheduleService->create($validatedData);

            return response()->json([
                'message' => 'Lịch thi đã được tạo thành công',
                'data' => $data
            ], 201);

        } catch (Exception $e) {
            \Log::error('Error when creating exam schedule:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Lỗi khi tạo lịch thi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    // Lấy chi tiết lịch thi theo ID
    public function show($id)
    {
        try {
            $data = $this->examScheduleService->getById($id);
            return response()->json([
                'data' => $data
            ], 200); // Mã trạng thái HTTP: 200 OK
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy lịch thi.',
                'error' => $e->getMessage()
            ], 404); // Mã trạng thái HTTP: 404 Not Found
        }
    }

    // Cập nhật lịch thi
    public function update(ExamScheduleRequest $request, $id)
    {
        try {
            $data = $this->examScheduleService->update($id, $request->validated());
            return response()->json([
                'message' => 'Lịch thi đã được cập nhật thành công',
                'data' => $data
            ], 200); // Mã trạng thái HTTP: 200 OK
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật lịch thi.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    // Xóa lịch thi
    public function destroy($id)
    {
        try {
            $this->examScheduleService->delete($id);
            return response()->json([
                'message' => 'Lịch thi đã được xóa thành công'
            ], 204); // Mã trạng thái HTTP: 204 No Content
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa lịch thi.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }
    // Lịch thi của sinh viên đang login
    public function mySchedules(Request $request)
    {
        try {
            $studentId = $request->user()->id;
            $data = $this->examScheduleService->getSchedulesForStudent($studentId);

            if ($data->isEmpty()) {
                return response()->json([
                    'message' => 'Không có lịch thi nào cho sinh viên này.',
                ], 404);
            }

            return response()->json([
                'data' => ExamScheduleResource::collection($data)
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy lịch thi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Lịch thi cho học viên
    public function studentSchedules($studentId)
    {
        try {
            $data = $this->examScheduleService->getSchedulesForStudent($studentId);
            // Kiểm tra nếu không có lịch thi cho học viên
            if ($data->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy lịch thi cho học viên này.'
                ], 200); // Mã trạng thái HTTP: 200 OK
            }
            return response()->json([
                'data' => $data
            ], 200); // Mã trạng thái HTTP: 200 OK
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy lịch thi cho học viên.',
                'error' => $e->getMessage()
            ], 404); // Mã trạng thái HTTP: 404 Not Found
        }
    }

    // Lịch thi sắp tới cho học viên
    public function upcomingSchedules($studentId)
    {
        try {
            $data = $this->examScheduleService->getUpcomingForStudent($studentId);
            // Kiểm tra nếu không có lịch thi sắp tới
            if ($data->isEmpty()) {
                return response()->json([
                    'message' => 'Không có lịch thi sắp tới cho học viên.'
                ], 200); // Mã trạng thái HTTP: 200 OK
            }
            return response()->json([
                'data' => $data
            ], 200); // Mã trạng thái HTTP: 200 OK
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy lịch thi sắp tới cho học viên.',
                'error' => $e->getMessage()
            ], 404); // Mã trạng thái HTTP: 404 Not Found
        }
    }

    // Lịch thi cho môn học cụ thể của học viên
    public function courseSchedule($studentId, $courseId)
    {
        try {
            $data = $this->examScheduleService->getCourseScheduleForStudent($studentId, $courseId);
            return response()->json([
                'data' => $data
            ], 200); // Mã trạng thái HTTP: 200 OK
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy lịch thi môn học cho học viên.',
                'error' => $e->getMessage()
            ], 404); // Mã trạng thái HTTP: 404 Not Found
        }
    }

    // Lịch thi lại cho học viên
    public function retakeSchedule($studentId, $courseId)
    {
        try {
            $data = $this->examScheduleService->getRetakeScheduleForStudent($studentId, $courseId);
            return response()->json([
                'data' => $data
            ], 200); // Mã trạng thái HTTP: 200 OK
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy lịch thi lại cho học viên.',
                'error' => $e->getMessage()
            ], 404); // Mã trạng thái HTTP: 404 Not Found
        }
    }
}