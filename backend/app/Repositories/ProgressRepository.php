<?php

namespace App\Repositories;

use App\Interfaces\ProgressRepositoryInterface;
use App\Models\Progress;
use Exception;

class ProgressRepository implements ProgressRepositoryInterface
{
    public function getAllProgress($filters)
    {
        try {
            $query = Progress::query();

            if (!empty($filters['user_id'])) {
                $query->where('user_id', $filters['user_id']);
            }
            if (!empty($filters['lesson_id'])) {
                $query->where('lesson_id', $filters['lesson_id']);
            }
            return $query->get();
        } catch (Exception $e) {
            throw new Exception("Lỗi trong quá trình truy vấn tiến độ: " . $e->getMessage());
        }
    }

    public function getProgressById($id)
    {
        return Progress::findOrFail($id);
    }

    public function createProgress(array $data)
    {
        return Progress::create($data);
    }

    public function updateProgress($id, array $data)
    {
        $progress = Progress::findOrFail($id);
        $progress->update($data);
        return $progress->fresh();
    }
}