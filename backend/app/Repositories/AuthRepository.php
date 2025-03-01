<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Str;
use App\Models\PasswordReset;
use App\Interfaces\AuthInterface;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthRepository implements AuthInterface
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
        return Auth::attempt($credentials);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    public function refresh()
    {
        return JWTAuth::refresh(JWTAuth::getToken());
    }

    public function me()
    {
        return Auth::user();
    }

    // ======= Các hàm Reset Password =======
    public function createPasswordResetToken($email)
    {
        return PasswordReset::updateOrCreate(
            attributes: ['email' => $email],
            values: ['token' => Str::random(length: 60)]
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