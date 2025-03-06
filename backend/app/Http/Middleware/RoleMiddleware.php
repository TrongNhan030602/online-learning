<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Enums\RoleEnum;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Chuyển đổi vai trò từ chuỗi thành enum
        $roleEnum = RoleEnum::from($role);

        // Lấy người dùng hiện tại
        $user = $request->user();

        // Kiểm tra vai trò
        if (!$user || $user->role->value !== $roleEnum->value) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}