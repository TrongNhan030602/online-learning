<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;

Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');

    // Reset password routes
    Route::post('reset-password', [AuthController::class, 'sendMail']);
    Route::put('reset-password/{token}', [AuthController::class, 'reset']);

});



Route::get('/', function () {
    return "******************************** API ***********************";
});