<?php

namespace App\Http\Controllers\API;

use App\Enums\RoleEnum;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class ChatController extends Controller
{
    // 📌 Lấy danh sách tin nhắn của user hiện tại
    public function index()
    {
        try {
            $messages = Message::with('user')
                ->where('user_id', Auth::id())
                ->orWhere('recipient_id', Auth::id())
                ->orderBy('created_at', 'asc') // ✅ Sắp xếp từ cũ -> mới
                ->take(20)
                ->get();


            return response()->json($messages);
        } catch (Exception $e) {
            Log::error("Lỗi khi lấy tin nhắn: " . $e->getMessage());
            return response()->json(['error' => 'Không thể lấy tin nhắn, vui lòng thử lại sau.'], 500);
        }
    }

    // 📌 Gửi tin nhắn
    public function sendMessage(Request $request)
    {
        try {
            $user = auth()->user();

            if ($user->role === RoleEnum::Student) {
                // Học viên luôn gửi tin cho Admin
                $recipientId = config('custom.admin_id');
            } elseif ($user->role === RoleEnum::Admin) {
                // Admin phải chọn học viên để gửi tin
                if (!$request->user_id) {
                    return response()->json(['error' => 'Vui lòng chọn học viên để gửi tin nhắn.'], 400);
                }
                $recipientId = $request->user_id;
            } else {
                return response()->json(['error' => 'Quyền không hợp lệ.'], 403);
            }

            // Kiểm tra nội dung tin nhắn
            if (!$request->message || trim($request->message) === '') {
                return response()->json(['error' => 'Nội dung tin nhắn không được để trống.'], 400);
            }

            $message = Message::create([
                'user_id' => $user->id,
                'recipient_id' => $recipientId,
                'message' => $request->message
            ]);

            Log::info('Gửi tin nhắn ID: ' . $message->id);
            broadcast(new MessageSent($message))->toOthers();

            return response()->json([
                'message' => 'Tin nhắn đã được gửi thành công!',
                'data' => $message
            ]);
        } catch (Exception $e) {
            Log::error("Lỗi khi gửi tin nhắn: " . $e->getMessage());
            return response()->json(['error' => 'Không thể gửi tin nhắn, vui lòng thử lại sau.'], 500);
        }
    }

    // 📌 Lấy danh sách học viên đã chat với Admin
    public function getStudentsWhoChatted()
    {
        try {
            $adminId = config('custom.admin_id');

            $students = Message::where(function ($query) use ($adminId) {
                $query->where('recipient_id', $adminId)
                    ->orWhere('user_id', $adminId);
            })
                ->where('user_id', '!=', $adminId) // Loại bỏ Admin khỏi danh sách
                ->with('user')
                ->select('user_id')
                ->distinct()
                ->get();

            return response()->json($students);
        } catch (Exception $e) {
            Log::error("Lỗi khi lấy danh sách học viên đã chat: " . $e->getMessage());
            return response()->json(['error' => 'Không thể lấy danh sách học viên, vui lòng thử lại sau.'], 500);
        }
    }

}