<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
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
    // Lấy danh sách khóa học
    Route::get('/', [CourseController::class, 'index']);

    // Lấy chi tiết một khóa học
    Route::get('/{id}', [CourseController::class, 'show']);

    // Thêm khóa học mới (chỉ admin)
    Route::post('/', [CourseController::class, 'store'])->middleware('auth:api', 'role:admin');

    // Cập nhật thông tin khóa học (không cập nhật file) (chỉ admin)
    Route::put('/{id}', [CourseController::class, 'update'])->middleware('auth:api', 'role:admin');

    // Xóa khóa học (và xóa các file liên quan) (chỉ admin)
    Route::delete('/{id}', [CourseController::class, 'destroy'])->middleware('auth:api', 'role:admin');

});

// API riêng dùng  để cập nhật file (image, document) cho Course
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

// API quản lý người dùng
Route::prefix('users')->group(function () {
    Route::get('/statistics', [UserController::class, 'statistics'])->middleware('auth:api', 'role:admin');
    Route::get('/', [UserController::class, 'index'])->middleware('auth:api', 'role:admin');
    Route::get('/{id}', [UserController::class, 'show'])->middleware('auth:api', 'role:admin');
    Route::put('/{id}', [UserController::class, 'update'])->middleware('auth:api', 'role:admin');
    Route::delete('/{id}', [UserController::class, 'destroy'])->middleware('auth:api', 'role:admin');
    Route::post('/{id}/reset-password', [UserController::class, 'resetPassword'])->middleware('auth:api', 'role:admin');
});








Route::get('/', function () {
    return "******************************** API ***********************";
});