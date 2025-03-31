<?php

namespace App\Repositories;

use App\Models\User;
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Exception;

class UserRepository implements UserRepositoryInterface
{
    public function getAllUsers(array $filters)
    {
        try {
            $query = User::query();

            // Lọc theo vai trò (role)
            if (!empty($filters['role'])) {
                $query->where('role', $filters['role']);
            }

            // Tìm kiếm theo tên hoặc email
            if (!empty($filters['search'])) {
                $search = $filters['search'];
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }

            // Lấy tất cả kết quả mà không phân trang
            return $query->get();
        } catch (Exception $e) {
            throw new Exception("Lỗi trong quá trình truy vấn người dùng: " . $e->getMessage());
        }
    }


    public function getUserById($id)
    {
        try {
            return User::with('profile')->findOrFail($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi trong quá trình truy vấn người dùng: " . $e->getMessage());
        }
    }


    public function updateUser($id, array $data)
    {
        $user = User::findOrFail($id);
        $user->update($data);
        return $user->fresh();
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        // Xóa các dữ liệu liên quan nếu cần (ví dụ: enrollments, reviews, progress)
        $user->enrollments()->delete();
        $user->reviews()->delete();
        $user->progress()->delete();
        return $user->delete();
    }

    public function resetPassword($id, $password)
    {
        $user = User::findOrFail($id);
        $user->password = Hash::make($password);
        return $user->save();
    }

    public function getStatistics()
    {
        try {
            $total = User::count();
            $admins = User::where('role', 'admin')->count();
            $students = User::where('role', 'student')->count();

            return [
                'total_users' => $total,
                'admins' => $admins,
                'students' => $students,
            ];
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy thống kê người dùng: " . $e->getMessage());
        }
    }
}