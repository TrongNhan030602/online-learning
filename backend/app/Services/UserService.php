<?php

namespace App\Services;

use App\Interfaces\UserRepositoryInterface;
use Exception;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    public function createUser(array $data, array $profileData)
    {
        // Gọi repository để tạo người dùng
        return $this->userRepository->createUser($data, $profileData);
    }
    public function listUsers(array $filters)
    {
        try {
            return $this->userRepository->getAllUsers($filters);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy danh sách người dùng: " . $e->getMessage());
        }
    }

    public function getUserById($id)
    {
        try {
            return $this->userRepository->getUserById($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy chi tiết người dùng: " . $e->getMessage());
        }
    }

    public function updateUser($id, array $data, array $profileData)
    {
        try {
            return $this->userRepository->updateUser($id, $data, $profileData);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi cập nhật người dùng: " . $e->getMessage());
        }
    }


    public function deleteUser($id)
    {
        try {
            return $this->userRepository->deleteUser($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi xóa người dùng: " . $e->getMessage());
        }
    }

    public function resetUserPassword($id, $password)
    {
        try {
            return $this->userRepository->resetPassword($id, $password);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi đặt lại mật khẩu: " . $e->getMessage());
        }
    }

    public function getStatistics()
    {
        try {
            return $this->userRepository->getStatistics();
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy thống kê người dùng: " . $e->getMessage());
        }
    }

    public function getPersonalInfo($id)
    {
        try {
            return $this->userRepository->getPersonalInfo($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy thông tin cá nhân: " . $e->getMessage());
        }
    }

}