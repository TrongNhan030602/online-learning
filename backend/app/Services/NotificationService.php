<?php

namespace App\Services;

use App\Interfaces\NotificationRepositoryInterface;
use App\Repositories\NotificationRepository;
use App\Models\StudentTrainingProgram;

class NotificationService implements NotificationRepositoryInterface
{
    protected $repository;

    public function __construct(NotificationRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createNotification(array $data): array
    {
        $notification = $this->repository->create([
            'training_program_id' => $data['training_program_id'],
            'title' => $data['title'],
            'body' => $data['body'],
            'type' => $data['type'],
        ]);

        $studentIds = StudentTrainingProgram::where('training_program_id', $data['training_program_id'])
            ->pluck('user_id')
            ->toArray();

        $this->repository->createReceivers($notification, $studentIds);

        return $notification->toArray();
    }
    public function updateNotification(int $notificationId, array $data)
    {
        $notification = $this->repository->updateNotification($notificationId, $data);
        return $notification ? $notification->toArray() : null;
    }

    public function getUserNotifications(int $userId): array
    {
        return $this->repository->getUserNotifications($userId);
    }
    public function getAllNotifications(): array
    {
        return $this->repository->getAllNotifications();
    }

    public function markAsRead(int $notificationId, int $userId): bool
    {
        return $this->repository->markAsRead($notificationId, $userId);
    }

    public function getNotificationsByTrainingProgram(int $trainingProgramId): array
    {
        return $this->repository->getNotificationsByTrainingProgram($trainingProgramId);
    }


    public function deleteNotification($notificationId)
    {
        return $this->repository->deleteNotification($notificationId);
    }
    public function getStatistics(int $userId): array
    {
        $notifications = $this->repository->getUserNotifications($userId);
        $unreadNotifications = collect($notifications)->filter(fn($notification) => !$notification['is_read'])->count();

        return [
            'total_notifications' => count($notifications),
            'unread_notifications' => $unreadNotifications,
        ];
    }
}