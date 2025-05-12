<?php
namespace App\Repositories;

use App\Models\User;
use App\Models\PasswordReset;
use App\Models\RefreshToken;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Interfaces\AuthRepositoryInterface;

class AuthRepository implements AuthRepositoryInterface
{
    public function register(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    public function login(array $credentials)
    {
        if (!$token = Auth::attempt($credentials)) {
            throw new \Exception('Thông tin đăng nhập không chính xác!');
        }

        $user = Auth::user();

        // Tạo refresh token mới
        $refreshToken = Str::random(64);

        RefreshToken::updateOrCreate(
            ['user_id' => $user->id],
            [
                'token' => $refreshToken,
                'expires_at' => now()->addDays(7),
            ]
        );

        return [
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'role' => $user->role,
        ];
    }

    public function refreshAccessToken(string $refreshToken)
    {
        $record = RefreshToken::where('token', $refreshToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            throw new \Exception('Refresh token không hợp lệ hoặc đã hết hạn.');
        }

        $user = $record->user;
        $accessToken = JWTAuth::fromUser($user);

        return [
            'access_token' => $accessToken,
        ];
    }

    public function logout()
    {
        $user = Auth::user();
        JWTAuth::invalidate(JWTAuth::getToken());

        if ($user) {
            RefreshToken::where('user_id', $user->id)->delete(); // Xoá refresh token khi logout
        }
    }



    public function me()
    {
        return Auth::user();
    }

    // ======= Các hàm Reset Password =======
    public function createPasswordResetToken($email)
    {
        return PasswordReset::updateOrCreate(
            ['email' => $email],
            ['token' => Str::random(60)]
        );
    }

    public function findPasswordResetToken($token)
    {
        return PasswordReset::where('token', $token)->first();
    }

    public function deletePasswordResetToken($token)
    {
        PasswordReset::where('token', $token)->delete();
    }
}