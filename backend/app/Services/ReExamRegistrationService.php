<?php
namespace App\Services;

use App\Interfaces\ReExamRegistrationRepositoryInterface;
use Exception;

class ReExamRegistrationService
{
    protected $repository;

    public function __construct(ReExamRegistrationRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAll()
    {
        return $this->repository->all();
    }

    public function getAllWithRelations()
    {
        return $this->repository->allWithRelations();
    }

    public function getById($id)
    {
        return $this->repository->find($id);
    }

    public function getByUser($userId)
    {
        return $this->repository->getByUser($userId);
    }

    public function getByUserWithRelations($userId)
    {
        return $this->repository->getByUserWithRelations($userId);
    }

    public function getByStatus($status)
    {
        return $this->repository->getByStatus($status);
    }

    public function create(array $data)
    {
        // Kiểm tra trùng trước khi tạo
        if ($this->repository->isDuplicateRegistration($data['user_id'], $data['exam_schedule_id'])) {
            throw new Exception('Đăng ký thi lại đã tồn tại.');
        }
        return $this->repository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->repository->changeStatus($id, $status);
    }
}