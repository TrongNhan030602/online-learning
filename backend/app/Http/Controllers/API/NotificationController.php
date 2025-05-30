<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use App\Http\Requests\NotificationRequest\StoreNotificationRequest;

class NotificationController extends Controller
{
    protected $service;

    public function __construct(NotificationService $service)
    {
        $this->service = $service;
    }

    public function store(StoreNotificationRequest $request)
    {
        try {
            // Đã được validate qua StoreNotificationRequest
            $validated = $request->validated();

            // Tạo thông báo
            $notification = $this->service->createNotification($validated);

            // Trả về phản hồi với status 201 (Created)
            return response()->json([
                'message' => 'Thông báo đã được tạo thành công.',
                'data' => $notification
            ], 201);
        } catch (Exception $e) {
            // Log chi tiết lỗi để phục vụ gỡ lỗi
            Log::error('Lỗi khi tạo thông báo: ' . $e->getMessage());

            // Trả về phản hồi lỗi với status 500 (Internal Server Error)
            return response()->json([
                'message' => 'Có lỗi xảy ra khi tạo thông báo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllNotifications()
    {
        try {
            $notifications = $this->service->getAllNotifications();

            if (empty($notifications)) {
                return response()->json([
                    'message' => 'Không có thông báo nào.'
                ], 404);
            }

            return response()->json([
                'data' => $notifications
            ]);
        } catch (Exception $e) {
            Log::error('Lỗi khi lấy tất cả thông báo: ' . $e->getMessage());

            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy thông báo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'nullable|string|in:announcement,exam,reminder',
        ]);

        $updatedNotification = $this->service->updateNotification($id, $validated);

        if (!$updatedNotification) {
            return response()->json(['message' => 'Không tìm thấy thông báo'], 404);
        }

        return response()->json(['data' => $updatedNotification]);
    }

    public function getUserNotifications(Request $request)
    {
        try {
            $userId = $request->user()->id;

            // Get notifications for the user
            $notifications = $this->service->getUserNotifications($userId);

            // Check if notifications exist
            if (empty($notifications)) {
                return response()->json([
                    'message' => 'Không có thông báo nào.'
                ], 404);
            }

            // Return notifications
            return response()->json([
                'data' => $notifications
            ]);
        } catch (Exception $e) {
            // Log error details for debugging
            Log::error('Lỗi khi lấy thông báo: ' . $e->getMessage());

            // Return error response with status 500
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy thông báo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function markAsRead($id, Request $request)
    {
        try {
            $userId = $request->user()->id;

            // Mark notification as read
            $success = $this->service->markAsRead($id, $userId);

            if (!$success) {
                return response()->json([
                    'message' => 'Thông báo không tìm thấy hoặc đã được đánh dấu là đã đọc.',
                ], 404);
            }

            // Return success response
            return response()->json([
                'message' => 'Thông báo đã được đánh dấu là đã đọc thành công.'
            ]);
        } catch (Exception $e) {
            // Log error details for debugging
            Log::error('Lỗi khi đánh dấu thông báo là đã đọc: ' . $e->getMessage());

            // Return error response with status 500
            return response()->json([
                'message' => 'Có lỗi xảy ra khi đánh dấu thông báo là đã đọc.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function statistics(Request $request)
    {
        try {
            $userId = $request->user()->id;
            $statistics = $this->service->getStatistics($userId);

            return response()->json($statistics);
        } catch (Exception $e) {
            Log::error('Lỗi khi thống kê thông báo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra khi thống kê thông báo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function delete($id, Request $request)
    {
        try {
            $success = $this->service->deleteNotification($id);

            if (!$success) {
                return response()->json([
                    'message' => 'Thông báo không tồn tại hoặc không thể xóa.'
                ], 404);
            }

            return response()->json([
                'message' => 'Thông báo đã được xóa thành công.'
            ]);
        } catch (Exception $e) {
            Log::error('Lỗi khi xóa thông báo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra khi xóa thông báo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByTrainingProgram($trainingProgramId, Request $request)
    {
        try {
            $notifications = $this->service->getNotificationsByTrainingProgram($trainingProgramId);

            if (empty($notifications)) {
                return response()->json([
                    'message' => 'Không có thông báo nào cho chương trình đào tạo này.'
                ], 404);
            }

            return response()->json([
                'data' => $notifications
            ]);
        } catch (Exception $e) {
            Log::error('Lỗi khi lấy thông báo theo chương trình đào tạo: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy thông báo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}