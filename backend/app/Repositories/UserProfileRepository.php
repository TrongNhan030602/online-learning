<?php
namespace App\Repositories;

use App\Models\UserProfile;
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
}