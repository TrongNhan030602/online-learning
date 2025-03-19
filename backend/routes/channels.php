<?php

use App\Enums\RoleEnum;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId || $user->role === RoleEnum::Admin;
});