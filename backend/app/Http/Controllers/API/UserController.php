<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use Exception;
use App\Http\Requests\User\UserUpdateRequest;
use App\Http\Requests\User\UserResetPasswordRequest;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    // Lấy danh sách người dùng với lọc và tìm kiếm
    public function index(Request $request)
    {
        try {
            $filters = $request->only(['role', 'search']);
            $users = $this->userService->listUsers($filters);
            return response()->json($users, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không thể lấy danh sách người dùng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết người dùng theo ID
    public function show($id)
    {
        try {
            $user = $this->userService->getUserById((int) $id);
            // Eager load các quan hệ: enrollments, reviews, progress
            $user->load(['profile']);
            return response()->json($user, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không tìm thấy người dùng.',
                'error' => $e->getMessage()
            ], 404);
        }
    }


    // Cập nhật thông tin người dùng
    public function update(UserUpdateRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $user = $this->userService->updateUser($id, $data);
            return response()->json($user, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Cập nhật thông tin người dùng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa người dùng và các dữ liệu liên quan
    public function destroy($id)
    {
        try {
            $this->userService->deleteUser($id);
            return response()->json(['message' => 'Người dùng đã được xóa thành công.'], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Xóa người dùng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Reset mật khẩu cho người dùng (admin đặt lại mật khẩu)
    public function resetPassword(UserResetPasswordRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $this->userService->resetUserPassword($id, $data['password']);
            return response()->json(['message' => 'Mật khẩu đã được đặt lại thành công.'], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Đặt lại mật khẩu thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy thống kê người dùng
    public function statistics()
    {
        try {
            $stats = $this->userService->getStatistics();
            return response()->json($stats, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không thể lấy thống kê người dùng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}