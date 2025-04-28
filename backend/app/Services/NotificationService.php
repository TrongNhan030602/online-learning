<?php

namespace App\Services;

use App\Interfaces\NotificationRepositoryInterface;

class NotificationService
{
    protected $repository;

    public function __construct(NotificationRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getUserNotifications($userId)
    {
        return $this->repository->getUserNotifications($userId);
    }

    public function createNotification(array $data)
    {
        return $this->repository->create($data);
    }

    public function markAsRead($id)
    {
        return $this->repository->markAsRead($id);
    }

    public function deleteNotification($id)
    {
        return $this->repository->delete($id);
    }
}