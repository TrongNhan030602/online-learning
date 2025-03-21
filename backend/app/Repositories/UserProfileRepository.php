<?php
namespace App\Repositories;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Hash;
use App\Interfaces\UserProfileRepositoryInterface;

class UserProfileRepository implements UserProfileRepositoryInterface
{
    public function getProfile($userId)
    {
        return UserProfile::where('user_id', $userId)->firstOrFail();
    }

    public function updateProfile($userId, array $data)
    {
        return UserProfile::updateOrCreate(['user_id' => $userId], $data);
    }

    public function updateAvatar($userId, $avatarPath)
    {
        return UserProfile::where('user_id', $userId)->update(['avatar' => $avatarPath]);
    }
    public function changePassword($userId, $currentPassword, $newPassword)
    {
        $user = User::findOrFail($userId);

        // Kiểm tra mật khẩu hiện tại
        if (!Hash::check($currentPassword, $user->password)) {
            throw new \Exception('Mật khẩu hiện tại không đúng.');
        }

        // Cập nhật mật khẩu mới
        $user->password = Hash::make($newPassword);
        $user->save();

        return $user;
    }
}