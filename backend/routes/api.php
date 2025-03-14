<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\FaqController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\LessonController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\ProgressController;
use App\Http\Controllers\API\CourseFileController;
use App\Http\Controllers\API\BlogCommentController;

// Authentication routes
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

// API quản lý người dùng
Route::prefix('users')->group(function () {
    Route::get('/statistics', [UserController::class, 'statistics'])->middleware('auth:api', 'role:admin');
    Route::get('/', [UserController::class, 'index'])->middleware('auth:api', 'role:admin');
    Route::get('/{id}', [UserController::class, 'show'])->middleware('auth:api', 'role:admin');
    Route::put('/{id}', [UserController::class, 'update'])->middleware('auth:api', 'role:admin');
    Route::delete('/{id}', [UserController::class, 'destroy'])->middleware('auth:api', 'role:admin');
    Route::post('/{id}/reset-password', [UserController::class, 'resetPassword'])->middleware('auth:api', 'role:admin');
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

// API quản lý bài học
Route::prefix('lessons')->group(function () {
    Route::get('/', [LessonController::class, 'index']);
    Route::get('/{id}', [LessonController::class, 'show']);
    Route::post('/', [LessonController::class, 'store'])->middleware('auth:api', 'role:admin');
    Route::put('/{id}', [LessonController::class, 'update'])->middleware('auth:api', 'role:admin');
    Route::delete('/{id}', [LessonController::class, 'destroy'])->middleware('auth:api', 'role:admin');

    // Endpoint riêng để gán file cho bài học
    Route::post('/{lessonId}/selected-files', [LessonController::class, 'assignFiles'])->middleware('auth:api', 'role:admin');
});



// API quản lý tiến độ học viên
Route::prefix('progress')->middleware('auth:api')->group(function () {
    Route::get('/', [ProgressController::class, 'index']); // Lấy danh sách tiến độ
    Route::get('/{id}', [ProgressController::class, 'show']); // Lấy chi tiết tiến độ
    Route::post('/', [ProgressController::class, 'store']); // Tạo mới tiến độ
    Route::put('/{id}', [ProgressController::class, 'update'])->middleware('auth:api', 'role:admin'); // Cập nhật tiến độ
    Route::put('/{id}/complete', [ProgressController::class, 'markLessonComplete']); // Đánh dấu bài học hoàn thành
    Route::get('/user/{userId}/completed-lessons', [ProgressController::class, 'getCompletedLessons']); // Danh sách bài học hoàn thành
    Route::post('/{courseId}/review', [ProgressController::class, 'submitReview']); // Đánh giá khóa học
    Route::get('/admin/users-progress', [ProgressController::class, 'adminViewProgress'])->middleware('auth:api', 'role:admin'); // Admin xem tiến độ học viên
});




// API quản lý đánh giá khóa học
Route::prefix('reviews')->group(function () {
    Route::get('/', [ReviewController::class, 'index']);          // Lấy danh sách đánh giá
    Route::put('/{id}/approve', [ReviewController::class, 'approve']); // Duyệt đánh giá
    Route::delete('/{id}', [ReviewController::class, 'destroy']); // Xóa đánh giá
});

// API quản lý blog
Route::prefix('blogs')->group(function () {
    Route::get('/', [BlogController::class, 'index']); // Lấy danh sách blog
    Route::get('/{id}', [BlogController::class, 'show']); // Lấy blog theo ID
    Route::post('/', [BlogController::class, 'store']); // Tạo blog
    Route::put('/{id}', [BlogController::class, 'update']); // Cập nhật blog
    Route::delete('/{id}', [BlogController::class, 'destroy']); // Xóa blog

    // Routes quản lý ảnh
    Route::get('/{id}/images', [BlogController::class, 'getImages']); // Lấy danh sách ảnh của blog
    Route::post('/{id}/images', [BlogController::class, 'uploadImages']); // Upload ảnh cho blog
    Route::delete('/images/{imageId}', [BlogController::class, 'deleteImage']); // Xóa ảnh blog

});


Route::prefix('blog-comments')->group(function () {
    Route::get('/{blogId}', [BlogCommentController::class, 'index']); // Lấy danh sách bình luận theo blog
    Route::post('/', [BlogCommentController::class, 'store']); // Tạo bình luận mới
    Route::put('/{id}', [BlogCommentController::class, 'update']); // ✅ Chỉnh sửa bình luận
    Route::delete('/{id}', [BlogCommentController::class, 'destroy']); // Xóa bình luận
});


Route::prefix('faqs')->group(function () {
    Route::get('/', [FaqController::class, 'index']);
    Route::get('/{id}', [FaqController::class, 'show']);
    Route::get('/category/{category}', [FaqController::class, 'getByCategory']);
    Route::get('/status/{status}', [FaqController::class, 'getByStatus']);
    Route::post('/', [FaqController::class, 'store']);
    Route::put('/{id}', [FaqController::class, 'update']);
    Route::delete('/{id}', [FaqController::class, 'destroy']);
});










Route::get('/', function () {
    return "******************************** API ***********************";
});