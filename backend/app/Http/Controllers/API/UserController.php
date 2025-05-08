<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\User\UserCreateRequest;
use App\Http\Requests\User\UserUpdateRequest;
use App\Http\Requests\User\UserResetPasswordRequest;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    public function store(UserCreateRequest $request)
    {
        // Lấy dữ liệu từ request
        $data = $request->only(['name', 'email', 'password', 'role']);
        $profileData = $request->only(['first_name', 'last_name', 'phone', 'address', 'gender', 'position', 'info', 'avatar']);

        // Mã hóa mật khẩu
        $data['password'] = Hash::make($data['password']);

        // Tạo người dùng qua service
        $user = $this->userService->createUser($data, $profileData);

        // Nếu có ảnh đại diện, lưu vào thư mục và cập nhật avatar
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->profile->update(['avatar' => $avatarPath]);
        }

        return response()->json([
            'message' => 'Tạo tài khoản thành công!',
            'user' => $user,
        ], 201);
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
            return response()->json($user, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không tìm thấy người dùng.',
                'error' => $e->getMessage()
            ], 404);
        }
    }


    // Cập nhật thông tin người dùng
    public function update($id, UserUpdateRequest $request)
    {
        // Không cần cập nhật password, email và role
        $data = $request->only(['name']);
        $profileData = $request->only(['first_name', 'last_name', 'phone', 'address', 'gender', 'position', 'info', 'avatar']);

        // Cập nhật thông tin người dùng và thông tin hồ sơ
        $user = $this->userService->updateUser($id, $data, $profileData);

        return response()->json($user);
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
    public function getUsersByRole($role)
    {
        try {
            $users = $this->userService->listUsers(['role' => $role]);
            return response()->json($users, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không thể lấy người dùng theo vai trò.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function personalInfo(Request $request)
    {
        try {
            $user = $request->user(); // Lấy từ JWT hoặc session
            $info = $this->userService->getPersonalInfo($user->id);
            return response()->json($info, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không thể lấy thông tin cá nhân.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}