<?php

namespace App\Interfaces;

interface NotificationRepositoryInterface
{
    public function getUserNotifications($userId);
    public function create(array $data);
    public function markAsRead($id);
    public function delete($id);
}