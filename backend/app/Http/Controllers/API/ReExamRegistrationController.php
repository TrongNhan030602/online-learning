<?php
namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\ReExamRegistrationService;
use App\Http\Requests\ReExamRegistrationRequest\ReExamRegistrationRequest;

class ReExamRegistrationController extends Controller
{
    protected $service;

    public function __construct(ReExamRegistrationService $service)
    {
        $this->service = $service;
    }

    // Lấy tất cả đăng ký thi lại (có quan hệ)
    public function index(): JsonResponse
    {
        try {
            $reExamRegistrations = $this->service->getAllWithRelations();

            if ($reExamRegistrations->isEmpty()) {
                return response()->json([
                    'message' => 'Không có đăng ký thi lại nào.'
                ], 200);
            }

            return response()->json([
                'data' => $reExamRegistrations
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy dữ liệu đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy đăng ký thi lại theo ID
    public function show($id): JsonResponse
    {
        try {
            $reExamRegistration = $this->service->getById($id);

            if (!$reExamRegistration) {
                return response()->json([
                    'message' => 'Đăng ký thi lại không tồn tại.'
                ], 404);
            }

            return response()->json([
                'data' => $reExamRegistration
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy thông tin đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy đăng ký thi lại theo user (có quan hệ)
    public function getByUser($userId): JsonResponse
    {
        try {
            $registrations = $this->service->getByUserWithRelations($userId);

            if ($registrations->isEmpty()) {
                return response()->json([
                    'message' => 'Không có đăng ký thi lại cho người dùng này.'
                ], 404);
            }

            return response()->json([
                'data' => $registrations
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy đăng ký thi lại theo người dùng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy đăng ký thi lại theo trạng thái
    public function getByStatus($status): JsonResponse
    {
        try {
            $registrations = $this->service->getByStatus($status);

            if ($registrations->isEmpty()) {
                return response()->json([
                    'message' => 'Không có đăng ký thi lại với trạng thái này.'
                ], 404);
            }

            return response()->json([
                'data' => $registrations
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy đăng ký thi lại theo trạng thái.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Lấy danh sách đăng ký thi lại của sinh viên đang đăng nhập
    public function getMyReExamRegistrations(): JsonResponse
    {
        try {
            $userId = Auth::id();
            $registrations = $this->service->getByUserWithRelations($userId);

            if ($registrations->isEmpty()) {
                return response()->json([
                    'message' => 'Bạn chưa đăng ký lịch thi lại nào.'
                ], 200);
            }

            return response()->json([
                'data' => $registrations
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi lấy danh sách lịch thi lại của bạn.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo mới đăng ký thi lại
    public function store(ReExamRegistrationRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id();

            $reExamRegistration = $this->service->create($data);

            return response()->json([
                'message' => 'Đăng ký thi lại thành công.',
                'data' => $reExamRegistration
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi tạo đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật đăng ký thi lại
    public function update(ReExamRegistrationRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $reExamRegistration = $this->service->update($id, $data);

            if (!$reExamRegistration) {
                return response()->json([
                    'message' => 'Không tìm thấy đăng ký thi lại để cập nhật.'
                ], 404);
            }

            return response()->json([
                'message' => 'Cập nhật đăng ký thi lại thành công.',
                'data' => $reExamRegistration
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi cập nhật đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Thay đổi trạng thái đăng ký thi lại
    public function changeStatus($id, $status): JsonResponse
    {
        $validStatuses = ['pending', 'approved', 'rejected'];

        if (!in_array($status, $validStatuses)) {
            return response()->json([
                'message' => 'Trạng thái không hợp lệ.'
            ], 422);
        }

        try {
            $registration = $this->service->changeStatus($id, $status);

            return response()->json([
                'message' => 'Cập nhật trạng thái thành công.',
                'data' => $registration
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi cập nhật trạng thái đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Xóa đăng ký thi lại
    public function destroy($id): JsonResponse
    {
        try {
            $this->service->delete($id);

            return response()->json([
                'message' => 'Đăng ký thi lại đã được xóa.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi khi xóa đăng ký thi lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}