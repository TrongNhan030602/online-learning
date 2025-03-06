<?php

namespace App\Interfaces;


interface UserRepositoryInterface
{
    // Lấy danh sách người dùng với lọc và tìm kiếm
    public function getAllUsers(array $filters);

    // Lấy chi tiết người dùng theo ID
    public function getUserById($id);

    // Cập nhật thông tin người dùng
    public function updateUser($id, array $data);

    // Xóa người dùng (và các dữ liệu liên quan nếu cần)
    public function deleteUser($id);

    // Reset mật khẩu cho người dùng
    public function resetPassword($id, $password);

    // Lấy thống kê số lượng người dùng theo vai trò
    public function getStatistics();
}