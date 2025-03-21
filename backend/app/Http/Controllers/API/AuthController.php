<?php

namespace App\Http\Controllers\API;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Notifications\ResetPasswordRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->authService->register($request->validated());
            return response()->json([
                'message' => 'Đăng ký thành công!',
                'user' => $user
            ], 201);
        } catch (Exception $e) {
            Log::error('Register error: ' . $e->getMessage());
            return response()->json(['message' => 'Đăng ký thất bại.'], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $tokenData = $this->authService->login($request->validated());
            return response()->json($tokenData);
        } catch (ValidationException $e) {
            // Nếu xảy ra lỗi validation
            return response()->json(['message' => 'Thông tin đăng nhập không chính xác.'], 422);
        } catch (Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json(['message' => 'Đăng nhập thất bại.'], 500);
        }
    }

    public function logout()
    {
        try {
            $this->authService->logout();
            return response()->json(['message' => 'Đăng xuất thành công!']);
        } catch (Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json(['message' => 'Đăng xuất thất bại.'], 500);
        }
    }

    public function refresh()
    {
        try {
            $tokenData = $this->authService->refresh();
            return response()->json($tokenData);
        } catch (Exception $e) {
            Log::error('Refresh error: ' . $e->getMessage());
            return response()->json(['message' => 'Refresh token thất bại.'], 500);
        }
    }

    public function me()
    {
        try {
            $user = $this->authService->me();
            return response()->json($user);
        } catch (Exception $e) {
            Log::error('Me error: ' . $e->getMessage());
            return response()->json(['message' => 'Lấy thông tin người dùng thất bại.'], 500);
        }
    }

    public function sendMail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            $user = User::where('email', $request->email)->firstOrFail();

            // Tạo token reset mật khẩu
            $passwordReset = $this->authService->createPasswordResetToken($user->email);

            // Nếu tạo token thành công
            if ($passwordReset) {
                // Chọn mailer tùy thuộc vào người dùng
                $mailer = $user->email === 'admin@gmail.com' ? 'smtp' : 'smtp';

                $user->notify(new ResetPasswordRequest($passwordReset->token, $mailer));
            }

            return response()->json(['message' => 'Email đặt lại mật khẩu đã được gửi'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Email không tồn tại trong hệ thống'], 404);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Gửi mail thấy bại.', 'error' => $e->getMessage()], 500);
        }
    }


    public function reset(Request $request, $token)
    {
        $request->validate([
            'password' => 'required|min:6|confirmed',
        ]);

        try {
            $passwordReset = $this->authService->findPasswordResetToken($token);

            if (!$passwordReset) {
                return response()->json(['message' => 'Token đặt lại mật khẩu không hợp lệ.'], 404);
            }

            if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
                $this->authService->deletePasswordResetToken($token);
                return response()->json(['message' => 'Token đã hết hạn.'], 422);
            }

            $user = User::where('email', $passwordReset->email)->firstOrFail();
            $user->update(['password' => Hash::make($request->password)]);
            $this->authService->deletePasswordResetToken($token);

            return response()->json(['message' => 'Mật khẩu đã được cập nhật thành công.'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Người dùng không tông tại.'], 404);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Đổi mật khẩu thất bại.', 'error' => $e->getMessage()], 500);
        }
    }
}