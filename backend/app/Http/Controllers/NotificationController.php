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
            $notifications = $this->service->getUserNotifications($request->user()->id);
            return response()->json($notifications);
        } catch (Exception $e) {
            return response()->json(['message' => 'Không thể lấy danh sách thông báo.', 'error' => $e->getMessage()], 500);
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