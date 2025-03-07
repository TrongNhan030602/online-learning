<?php

namespace App\Services;

use App\Interfaces\ProgressRepositoryInterface;
use Exception;

class ProgressService
{
    protected $progressRepository;

    public function __construct(ProgressRepositoryInterface $progressRepository)
    {
        $this->progressRepository = $progressRepository;
    }

    public function listProgress($filters)
    {
        try {
            return $this->progressRepository->getAllProgress($filters);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy danh sách tiến độ: " . $e->getMessage());
        }
    }

    public function getProgressById($id)
    {
        try {
            return $this->progressRepository->getProgressById($id);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi lấy chi tiết tiến độ: " . $e->getMessage());
        }
    }

    public function createProgress(array $data)
    {
        try {
            return $this->progressRepository->createProgress($data);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi tạo tiến độ: " . $e->getMessage());
        }
    }

    public function updateProgress($id, array $data)
    {
        try {
            return $this->progressRepository->updateProgress($id, $data);
        } catch (Exception $e) {
            throw new Exception("Lỗi khi cập nhật tiến độ: " . $e->getMessage());
        }
    }
}