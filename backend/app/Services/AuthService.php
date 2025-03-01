<?php

namespace App\Services;

use App\Mail\ResetPasswordMail;
use App\Interfaces\AuthInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected $authRepository;

    public function __construct(AuthInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function register(array $data)
    {
        return $this->authRepository->register($data);
    }

    public function login(array $credentials)
    {
        if (!$token = $this->authRepository->login($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Thông tin đăng nhập không chính xác.'],
            ]);
        }

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }

    public function logout()
    {
        $this->authRepository->logout();
        return ['message' => 'Đăng xuất thành công!'];
    }

    public function refresh()
    {
        return [
            'access_token' => $this->authRepository->refresh(),
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }

    public function me()
    {
        return $this->authRepository->me();
    }

    public function createPasswordResetToken($email)
    {
        return $this->authRepository->createPasswordResetToken($email);
    }

    public function findPasswordResetToken($token)
    {
        return $this->authRepository->findPasswordResetToken($token);
    }

    public function deletePasswordResetToken($token)
    {
        return $this->authRepository->deletePasswordResetToken($token);
    }

}