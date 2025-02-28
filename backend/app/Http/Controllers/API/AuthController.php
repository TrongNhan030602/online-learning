<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        $user = $this->authService->register($request->validated());
        return response()->json(['message' => 'Đăng ký thành công!', 'user' => $user], 201);
    }

    public function login(LoginRequest $request)
    {
        $token = $this->authService->login($request->validated());
        return response()->json($token);
    }

    public function logout()
    {
        return response()->json($this->authService->logout());
    }

    public function refresh()
    {
        return response()->json($this->authService->refresh());
    }

    public function me()
    {
        return response()->json($this->authService->me());
    }
}