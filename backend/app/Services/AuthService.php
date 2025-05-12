<?php

namespace App\Services;

use App\Mail\ResetPasswordMail;
use App\Interfaces\AuthRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function register(array $data)
    {
        return $this->authRepository->register($data);
    }
    public function login(array $credentials)
    {
        $data = $this->authRepository->login($credentials);

        return [
            'access_token' => $data['access_token'],
            'refresh_token' => $data['refresh_token'],
            'role' => $data['role'],
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ];
    }

    public function refreshAccessToken(string $refreshToken)
    {
        $data = $this->authRepository->refreshAccessToken($refreshToken);

        return [
            'access_token' => $data['access_token'],
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ];
    }




    public function logout()
    {
        $this->authRepository->logout();
        return ['message' => 'Đăng xuất thành công!'];
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