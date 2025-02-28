<?php

namespace App\Repositories;

use App\Models\User;
use App\Interfaces\AuthInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

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
}