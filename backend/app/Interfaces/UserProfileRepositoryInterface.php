<?php
namespace App\Interfaces;

interface UserProfileRepositoryInterface
{
    public function getProfile($userId);
    public function updateProfile($userId, array $data);
    public function updateAvatar($userId, $avatarPath);
    public function changePassword($userId, $currentPassword, $newPassword);
}