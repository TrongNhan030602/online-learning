<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use App\Http\Requests\NotificationRequest\NotificationRequest;

class NotificationController extends Controller
{
    protected $service;

    public function __construct(NotificationService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;
            $notifications = $this->service->getUserNotifications($userId);

            if ($notifications->isEmpty()) {
                return response()->json([
                    'message' => 'Không có thông báo nào cho người dùng.'
                ], 204); // hoặc 404 nếu muốn báo rõ hơn
            }

            return response()->json($notifications, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không thể lấy danh sách thông báo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function store(NotificationRequest $request)
    {
        try {
            $notification = $this->service->createNotification($request->validated());
            return response()->json($notification, 201);
        } catch (Exception $e) {
            return response()->json(['message' => 'Không thể tạo thông báo.', 'error' => $e->getMessage()], 500);
        }
    }

    public function markAsRead($id)
    {
        try {
            $notification = $this->service->markAsRead($id);
            return response()->json($notification);
        } catch (Exception $e) {
            return response()->json(['message' => 'Không thể cập nhật trạng thái đọc.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->deleteNotification($id);
            return response()->json(['message' => 'Xóa thông báo thành công.']);
        } catch (Exception $e) {
            return response()->json(['message' => 'Không thể xóa thông báo.', 'error' => $e->getMessage()], 500);
        }
    }
}