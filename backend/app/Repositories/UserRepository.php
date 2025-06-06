<?php

namespace App\Repositories;

use Exception;
use App\Models\User;
use App\Enums\RoleEnum;
use App\Models\TrainingProgram;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Interfaces\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function createUser(array $data, array $profileData)
    {
        if (!in_array($data['role'], RoleEnum::values(), true)) {
            throw new Exception("Role không hợp lệ");
        }
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

            // Lọc theo tìm kiếm tên, email hoặc tên trong profile
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

        // Không cho xoá cố vấn
        if ($user->role === RoleEnum::Advisor->value) {
            throw new Exception("Không thể xóa người dùng là cố vấn.");
        }

        DB::beginTransaction();
        try {
            // Xoá dữ liệu liên quan trước
            $user->profile()?->delete();

            // Xoá user
            $user->delete();

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Lỗi khi xoá người dùng: " . $e->getMessage());
        }
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
            $admins = User::where('role', RoleEnum::Admin->value)->count();
            $students = User::where('role', RoleEnum::Student->value)->count();
            $advisors = User::where('role', RoleEnum::Advisor->value)->count();  // Thêm thống kê cho cố vấn

            return [
                'total_users' => $total,
                'admins' => $admins,
                'students' => $students,
                'advisors' => $advisors,  // Thêm thống kê cho cố vấn
            ];
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy thống kê người dùng: " . $e->getMessage());
        }
    }


    public function getPersonalInfo($userId)
    {
        try {
            $user = User::with([
                'profile',
                'trainingPrograms' => function ($query) {
                    $query->with('advisor:id,name,email');  // Thêm email vào 'advisor'
                }
            ])->findOrFail($userId);

            $trainingPrograms = $user->trainingPrograms->map(function ($program) {
                return [
                    'id' => $program->id,
                    'name' => $program->name,
                    'code' => $program->code,
                    'level' => $program->level,
                    'entry_type' => $program->pivot->entry_type,
                    'advisor' => optional($program->advisor)->name,  // Dùng optional để tránh lỗi khi không có advisor
                    'advisor_email' => optional($program->advisor)->email,  // Dùng optional để tránh lỗi khi không có advisor
                    'from_program' => optional(TrainingProgram::find($program->pivot->from_program_id))->name,  // Dùng optional để tránh lỗi khi không có từ chương trình
                ];
            });

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'profile' => $user->profile,
                'training_programs' => $trainingPrograms,
            ];
        } catch (Exception $e) {
            throw new Exception("Không thể lấy thông tin cá nhân: " . $e->getMessage());
        }
    }
    public function getFullUserInfoById($id)
    {
        try {
            // Lấy thông tin người dùng với các quan hệ liên quan
            $user = User::with([
                'profile',
                'studentTrainingPrograms.trainingProgram',
                'studentTrainingPrograms.fromProgram',
                'studentTrainingPrograms.disciplineScores.semester',
            ])->findOrFail($id);

            // Thêm trường full_name cho tên đầy đủ
            $user->full_name = $user->profile->last_name . ' ' . $user->profile->first_name;

            // Chuyển đổi dữ liệu nếu cần format cho frontend
            $user->studentTrainingPrograms->map(function ($program) {
                // Format thông tin điểm rèn luyện cho mỗi chương trình học
                $program->discipline_scores = $program->disciplineScores->map(function ($score) {
                    return [
                        'semester' => $score->semester->name,
                        'score' => $score->score,
                        'evaluation' => $score->evaluation
                    ];
                });

                return $program;
            });

            return $user;
        } catch (Exception $e) {
            // Xử lý lỗi
            throw new Exception("Lỗi khi lấy thông tin chi tiết người dùng: " . $e->getMessage());
        }
    }







}