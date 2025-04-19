<?php
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\API\FaqController;
use App\Http\Controllers\ApiDataController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\CouponController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\LessonController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\ProgressController;
use App\Http\Controllers\API\ClassRoomController;
use App\Http\Controllers\API\AttendanceController;
use App\Http\Controllers\API\CourseFileController;
use App\Http\Controllers\API\EnrollmentController;
use App\Http\Controllers\API\BlogCommentController;
use App\Http\Controllers\API\UserProfileController;
use App\Http\Controllers\API\ClassSessionController;
use App\Http\Controllers\API\LandingSlideController;
use App\Http\Controllers\API\StudentClassController;
use App\Http\Controllers\API\TrainingProgramController;


// Truy cập ảnh


Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path("app/public/" . $path);

    if (!File::exists($filePath)) {
        abort(404, 'File not found.');
    }

    $file = File::get($filePath);
    $mimeType = File::mimeType($filePath);

    return response($file, 200)->header('Content-Type', $mimeType);
})->where('path', '.*');


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
    Route::post('/', [UserController::class, 'store'])->middleware('auth:api', 'role:admin');
    Route::get('/statistics', [UserController::class, 'statistics'])->middleware('auth:api', 'role:admin');
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::put('/{id}', [UserController::class, 'update'])->middleware('auth:api', 'role:admin');
    Route::delete('/{id}', [UserController::class, 'destroy'])->middleware('auth:api', 'role:admin');
    Route::post('/{id}/reset-password', [UserController::class, 'resetPassword'])->middleware('auth:api', 'role:admin');
});

Route::middleware(['auth:api'])->group(function () {
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserProfileController::class, 'show']);
        Route::put('/', [UserProfileController::class, 'update']);
        Route::post('/avatar', [UserProfileController::class, 'updateAvatar']);
        Route::post('/change-password', [UserProfileController::class, 'changePassword']);
    });
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
    Route::post('/{id}/update-image', [CourseController::class, 'updateImage'])
        ->middleware('auth:api', 'role:admin');
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
    // Endpoint để thêm tài liệu vào bài học
    Route::post('/{lessonId}/documents', [LessonController::class, 'addDocuments'])->middleware('auth:api', 'role:admin');
    // Endpoint riêng để gán file cho bài học
    Route::post('/{lessonId}/selected-files', [LessonController::class, 'assignFiles'])->middleware('auth:api', 'role:admin');
    Route::delete('/{lessonId}/documents/{documentId}', [LessonController::class, 'deleteDocument'])
        ->middleware('auth:api', 'role:admin');
});



// API quản lý chương trình đào tạo

Route::prefix('training-program')->group(function () {
    Route::get('/', [TrainingProgramController::class, 'getAll']);
    Route::get('/{id}', [TrainingProgramController::class, 'getById']);
    Route::get('/course/{courseId}', [TrainingProgramController::class, 'getByCourseId']);
    Route::post('/', [TrainingProgramController::class, 'create']);
    Route::delete('/{id}', [TrainingProgramController::class, 'delete']);
    Route::put('/{id}', [TrainingProgramController::class, 'update']);
});
// API quản lý slide (banner landing page)
Route::prefix('landing/slides')->group(function () {
    // Lấy danh sách slide
    Route::get('/', [LandingSlideController::class, 'index']);

    // Tạo mới slide
    Route::post('/', [LandingSlideController::class, 'store']);

    // Xoá slide
    Route::delete('/{id}', [LandingSlideController::class, 'destroy']);
});

// API quản lý lớp học
Route::prefix('classes')->group(function () {
    Route::get('/by-course/{courseId}', [ClassRoomController::class, 'getByCourseId']); // Đưa lên trên
    Route::get('/', [ClassRoomController::class, 'getAll']);
    Route::get('/{id}', [ClassRoomController::class, 'getById']);
    Route::post('/', [ClassRoomController::class, 'create']);
    Route::put('/{id}', [ClassRoomController::class, 'update']);
    Route::delete('/{id}', [ClassRoomController::class, 'delete']);
});


// API  quản lý ghi danh
Route::prefix('enrollments')->group(function () {
    Route::post('/enroll', [EnrollmentController::class, 'enroll']); // Ghi danh
    Route::get('/by-classroom/{classroomId}', [EnrollmentController::class, 'getByClassroom']); // Lấy danh sách học viên của lớp
    Route::get('/by-student/{userId}', [EnrollmentController::class, 'getByStudent']); // Lấy danh sách lớp của học viên
    Route::put('/approve/{id}', [EnrollmentController::class, 'approve']); // Duyệt ghi danh
    Route::put('/reject/{id}', [EnrollmentController::class, 'reject']); // Từ chối ghi danh
    Route::delete('/{id}', [EnrollmentController::class, 'remove']); // Xóa ghi danh
});


// API quản lý buổi học của lớp
Route::prefix('classrooms')->group(function () {
    // Lấy danh sách buổi học của lớp học
    Route::get('/{classroomId}/sessions', [ClassSessionController::class, 'index']);

    // Thêm buổi học mới vào lớp học
    Route::post('/{classroomId}/sessions', [ClassSessionController::class, 'store']);

    // Cập nhật buổi học
    Route::put('/{classroomId}/sessions/{sessionId}', [ClassSessionController::class, 'update']);

    // Xóa buổi học
    Route::delete('/{classroomId}/sessions/{sessionId}', [ClassSessionController::class, 'destroy']);
    // Xủ lý Thêm , xóa bài học vào buổi học    
    // Lấy danh sách bài học chưa có cho buổi học
    Route::get('/sessions/{sessionId}/available-lessons', [ClassSessionController::class, 'availableLessons']);
    // Lấy danh sách bài học đang có cho buổi học
    Route::get('/sessions/{sessionId}/current-lessons', [ClassSessionController::class, 'currentLessons']);

    // Thêm bài học vào buổi học
    Route::post('/sessions/{sessionId}/lessons', [ClassSessionController::class, 'addLesson']);

    // Xóa bài học khỏi buổi học
    Route::delete('/sessions/{sessionId}/lessons/{lessonId}', [ClassSessionController::class, 'removeLesson']);
});


// API quản lý điểm danh
Route::prefix('attendance')->group(function () {
    Route::post('/', [AttendanceController::class, 'markAttendance']);  // Điểm danh
    Route::get('/session/{classSessionId}', [AttendanceController::class, 'getBySession']); // Lấy danh sách điểm danh theo buổi học
    Route::get('/student/{userId}', [AttendanceController::class, 'getByStudent']); // Lấy lịch sử điểm danh của học viên
    Route::put('/{id}', [AttendanceController::class, 'updateAttendance']); // Cập nhật điểm danh
    Route::delete('/{id}', [AttendanceController::class, 'deleteAttendance']); // Xóa điểm danh
});

// API xem tài liệu của học viên
Route::middleware(['auth:api'])->prefix('student')->group(function () {
    Route::get('/my-classes', [StudentClassController::class, 'getMyClasses']);
    Route::get('/my-classes/{classroom}/sessions-with-lessons', [StudentClassController::class, 'getSessionsWithLessons']);
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



Route::prefix('coupons')->group(function () {

    // 📌 Quản lý mã giảm giá (CRUD)
    Route::get('/', [CouponController::class, 'index']);  // ✅ Lấy danh sách mã giảm giá
    Route::post('/', [CouponController::class, 'store']);  // ✅ Tạo mới mã giảm giá
    Route::put('/{id}', [CouponController::class, 'update']);  // ✅ Cập nhật mã giảm giá
    Route::delete('/{id}', [CouponController::class, 'destroy']);  // ✅ Xóa mã giảm giá

    // 📌 Xử lý mã giảm giá
    Route::get('/active', [CouponController::class, 'getActiveCoupons']); // ✅ Lấy danh sách mã còn hạn
    Route::get('/{id}', [CouponController::class, 'show']); // ✅ Lấy chi tiết mã giảm giá
    Route::get('/apply/{code}', [CouponController::class, 'applyCoupon']); // ✅ Kiểm tra & áp dụng mã
    Route::post('/reset-usage/{id}', [CouponController::class, 'resetUsage']); // ✅ Reset số lần sử dụng

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

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);

    // **Tạo đơn hàng mới**
    Route::post('/', [OrderController::class, 'store']);

    // **Hủy đơn hàng**
    Route::post('/{orderId}/cancel', [OrderController::class, 'cancel']);

    // Tiến hành thanh toán
    Route::post('{id}/checkout', [OrderController::class, 'checkout']);

    // Xác nhận thanh toán
    Route::post('{id}/confirm-payment', [OrderController::class, 'confirmPayment']);

    // Xử lý lỗi thanh toán
    Route::post('{id}/payment-failure', [OrderController::class, 'handlePaymentFailure']);
});






// Chat
Route::middleware('auth:api')->group(function () {
    // Lấy tin nhắn của người dùng hiện tại
    Route::get('/messages', [ChatController::class, 'index']);

    // Gửi tin nhắn
    Route::post('/messages', [ChatController::class, 'sendMessage']);

    // Lấy danh sách học viên đã từng chat với Admin
    Route::get('/students', [ChatController::class, 'getStudentsWhoChatted']);
});



// API trả về phía mobile
Route::prefix('mobile')->group(function () {
    Route::get('/courses', [ApiDataController::class, 'getCourses']);
    Route::get('/training-programs/all', [ApiDataController::class, 'getAllTrainingPrograms']);
    Route::get('/training-programs/{courseId}', [ApiDataController::class, 'getTrainingProgramsByCourse']);
    Route::get('/students/all', [ApiDataController::class, 'getAllStudents']);
    Route::get('/users', [ApiDataController::class, 'getUsers']);


    Route::get('/classes', [ApiDataController::class, 'getClasses']);
    Route::get('/sessions/all', [ApiDataController::class, 'getAllSessions']);
    Route::get('/sessions/{classId}', [ApiDataController::class, 'getSessionsByClass']);
    Route::get('/students/{classId}', [ApiDataController::class, 'getStudentsByClass']);
});



Route::get('/', function () {
    return "******************************** API ***********************";
});