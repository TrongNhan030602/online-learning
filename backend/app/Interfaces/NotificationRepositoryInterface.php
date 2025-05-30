<?php

namespace App\Interfaces;

interface NotificationRepositoryInterface
{
    public function createNotification(array $data): array;
    public function updateNotification(int $notificationId, array $data);

    public function getUserNotifications(int $userId): array;

    public function markAsRead(int $notificationId, int $userId): bool;
    public function getNotificationsByTrainingProgram(int $trainingProgramId): array;
    public function deleteNotification($notificationId);
    public function getAllNotifications(): array;
}