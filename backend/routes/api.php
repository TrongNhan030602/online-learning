<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\CourseFileController;

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

// API quản lý khóa học
Route::prefix('courses')->group(function () {
    Route::get('/', [CourseController::class, 'index']);
    Route::post('/', [CourseController::class, 'store'])->middleware('auth:api', 'role:admin');
    Route::put('/{id}', [CourseController::class, 'update'])->middleware('auth:api', 'role:admin');
    Route::delete('/{id}', [CourseController::class, 'destroy'])->middleware('auth:api', 'role:admin');
});
// API riêng dùng  để cập nhật file (image, document)
Route::prefix('courses/{courseId}/files')->group(function () {
    Route::get('/', [CourseFileController::class, 'index'])->middleware('auth:api', 'role:admin');
    Route::post('/', [CourseFileController::class, 'store'])->middleware('auth:api', 'role:admin');
    Route::delete('/{fileId}', [CourseFileController::class, 'destroy'])->middleware('auth:api', 'role:admin');
});


// API quản lý đánh giá khóa học
Route::prefix('reviews')->group(function () {
    Route::get('/', [ReviewController::class, 'index']);          // Lấy danh sách đánh giá
    Route::put('/{id}/approve', [ReviewController::class, 'approve']); // Duyệt đánh giá
    Route::delete('/{id}', [ReviewController::class, 'destroy']); // Xóa đánh giá
});











Route::get('/', function () {
    return "******************************** API ***********************";
});