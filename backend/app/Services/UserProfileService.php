<?php
namespace App\Services;

use App\Models\UserProfile;
use App\Interfaces\UserProfileRepositoryInterface;

class UserProfileService
{
    protected $profileRepository;

    public function __construct(UserProfileRepositoryInterface $profileRepository)
    {
        $this->profileRepository = $profileRepository;
    }

    public function getProfile($userId)
    {
        return UserProfile::where('user_id', $userId)
            ->with('user') // 🔥 Đảm bảo lấy luôn User
            ->first();
    }
    public function getAvatarPath($userId)
    {
        $profile = $this->getProfile($userId);
        return $profile->avatar;
    }



    public function updateProfile($userId, array $data)
    {
        return $this->profileRepository->updateProfile($userId, $data);
    }

    public function updateAvatar($userId, $avatarPath)
    {
        return $this->profileRepository->updateAvatar($userId, $avatarPath);
    }
    public function changePassword($userId, $currentPassword, $newPassword)
    {
        return $this->profileRepository->changePassword($userId, $currentPassword, $newPassword);
    }
}