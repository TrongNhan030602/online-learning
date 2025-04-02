<?php

namespace App\Repositories;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Interfaces\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function createUser(array $data, array $profileData)
    {
        // Tạo người dùng
        $user = User::create($data);

        // Lưu thông tin hồ sơ
        $user->profile()->create($profileData);

        return $user;
    }
    public function getAllUsers(array $filters)
    {
        try {
            $query = User::leftJoin('user_profiles', 'users.id', '=', 'user_profiles.user_id')
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.role',
                    'users.created_at',
                    'users.updated_at',
                    'user_profiles.id as profile_id',
                    'user_profiles.first_name',
                    'user_profiles.last_name',
                    'user_profiles.phone',
                    'user_profiles.address',
                    'user_profiles.gender',
                    'user_profiles.position',
                    'user_profiles.info',
                    DB::raw("COALESCE(user_profiles.avatar, 'default-avatar.png') as avatar")
                );

            // Lọc theo vai trò (role)
            if (!empty($filters['role'])) {
                $query->where('users.role', $filters['role']);
            }

            // Tìm kiếm theo tên hoặc email
            if (!empty($filters['search'])) {
                $search = $filters['search'];
                $query->where(function ($q) use ($search) {
                    $q->where('users.name', 'LIKE', "%{$search}%")
                        ->orWhere('users.email', 'LIKE', "%{$search}%")
                        ->orWhere('user_profiles.first_name', 'LIKE', "%{$search}%")
                        ->orWhere('user_profiles.last_name', 'LIKE', "%{$search}%");
                });
            }

            $users = $query->get();

            return $users->map(function ($user) {
                return [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role,
                    "created_at" => $user->created_at,
                    "updated_at" => $user->updated_at,
                    "profile" => [
                        "id" => $user->profile_id,
                        "user_id" => $user->id,
                        "first_name" => $user->first_name ?? "",
                        "last_name" => $user->last_name ?? "",
                        "phone" => $user->phone ?? "",
                        "address" => $user->address ?? "",
                        "gender" => $user->gender ?? "",
                        "position" => $user->position ?? "",
                        "info" => $user->info ?? "",
                        "avatar" => $user->avatar,
                    ]
                ];
            });

        } catch (Exception $e) {
            throw new Exception("Lỗi trong quá trình truy vấn người dùng: " . $e->getMessage());
        }
    }





    public function getUserById($id)
    {
        try {
            return User::with([
                'profile',
                'enrollments.classroom.course',
                'enrollments.classroom.sessions',
            ])->findOrFail($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi trong quá trình truy vấn người dùng: " . $e->getMessage());
        }
    }



    public function updateUser($id, array $data, array $profileData)
    {
        $user = User::findOrFail($id);
        // Chỉ cập nhật các trường có trong $data (đảm bảo chỉ có 'name' được cập nhật)
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }
        // Không cập nhật email, password, role trong quá trình này
        $user->save();

        $profile = $user->profile()->first();

        if ($profile) {
            $profile->update($profileData);
        } else {
            // Tạo mới hồ sơ người dùng nếu chưa có
            $user->profile()->create($profileData);
        }

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