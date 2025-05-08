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
            ->pluck('student_id')
            ->toArray();

        $this->repository->createReceivers($notification, $studentIds);

        return $notification->toArray();
    }

    public function getUserNotifications(int $userId): array
    {
        return $this->repository->getUserNotifications($userId);
    }

    public function markAsRead(int $notificationId, int $userId): bool
    {
        return $this->repository->markAsRead($notificationId, $userId);
    }

    public function getNotificationsByTrainingProgram(int $trainingProgramId): array
    {
        return $this->repository->getNotificationsByTrainingProgram($trainingProgramId);
    }


    public function deleteNotification(int $notificationId, int $userId): bool
    {
        return $this->repository->deleteNotification($notificationId, $userId);
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