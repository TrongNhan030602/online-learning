<?php

namespace App\Interfaces;

interface AuthRepositoryInterface
{
    public function register(array $data);
    public function login(array $credentials);
    public function logout();
    public function refreshAccessToken(string $refreshToken);
    public function me();
    public function createPasswordResetToken($email);
    public function findPasswordResetToken($token);
    public function deletePasswordResetToken($token);
}