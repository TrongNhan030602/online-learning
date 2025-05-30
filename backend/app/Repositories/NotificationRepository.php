<?php
namespace App\Repositories;

use App\Models\Notification;
use App\Models\NotificationReceiver;

class NotificationRepository
{
    public function create(array $data): Notification
    {
        return Notification::create($data);
    }

    public function createReceivers(Notification $notification, array $userIds): void
    {
        $rows = collect($userIds)->map(fn($id) => [
            'notification_id' => $notification->id,
            'user_id' => $id,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        NotificationReceiver::insert($rows);
    }
    public function updateNotification(int $notificationId, array $data)
    {
        $notification = Notification::find($notificationId);

        if (!$notification) {
            return null;
        }

        $notification->update([
            'title' => $data['title'] ?? $notification->title,
            'body' => $data['body'] ?? $notification->body,
            'type' => $data['type'] ?? $notification->type,
        ]);

        return $notification;
    }

    public function getUserNotifications(int $userId): array
    {
        return NotificationReceiver::with('notification', 'notification.trainingProgram')
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get()
            ->toArray();
    }

    public function markAsRead(int $notificationId, int $userId): bool
    {
        return NotificationReceiver::where([
            'notification_id' => $notificationId,
            'user_id' => $userId,
        ])->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]) > 0;
    }

    public function getNotificationsByTrainingProgram(int $trainingProgramId): array
    {
        return Notification::where('training_program_id', $trainingProgramId)
            ->orderByDesc('created_at')
            ->get()
            ->unique('id') // Loại bỏ các thông báo trùng lặp theo ID
            ->toArray();
    }



    public function deleteNotification($notificationId)
    {
        // Tìm thông báo theo ID
        $notification = Notification::find($notificationId);

        if ($notification) {
            // Xóa thông báo khỏi bảng Notification
            return $notification->delete(); // Thông báo và tất cả bản ghi liên quan trong NotificationReceiver sẽ bị xóa
        }

        return false; // Trả về false nếu không tìm thấy thông báo
    }
    public function getAllNotifications(): array
    {
        return Notification::with('trainingProgram')
            ->orderByDesc('created_at')
            ->get()
            ->toArray();
    }


}