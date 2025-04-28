<?php
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\API\FaqController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\UserController;

use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\LessonController;
use App\Http\Controllers\API\MaterialController;
use App\Http\Controllers\API\SemesterController;
use App\Http\Controllers\API\BlogCommentController;
use App\Http\Controllers\API\CertificateController;
use App\Http\Controllers\API\UserProfileController;
use App\Http\Controllers\API\ExamScheduleController;
use App\Http\Controllers\API\ExemptCourseController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\CourseSessionController;
use App\Http\Controllers\API\ProgramCourseController;
use App\Http\Controllers\API\LearningResultController;
use App\Http\Controllers\API\DisciplineScoreController;
use App\Http\Controllers\API\TrainingProgramController;
use App\Http\Controllers\API\ReExamRegistrationController;
use App\Http\Controllers\API\StudentTrainingProgramController;



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


// API Training-Program
Route::prefix('training-programs')->group(function () {
    Route::get('/', [TrainingProgramController::class, 'index']);
    Route::get('/{id}', [TrainingProgramController::class, 'show']);
    Route::post('/', [TrainingProgramController::class, 'store']);
    Route::put('/{id}', [TrainingProgramController::class, 'update']);
    Route::delete('/{id}', [TrainingProgramController::class, 'destroy']);
    Route::get('/filter/{level}', [TrainingProgramController::class, 'filterByLevel']); // Lọc theo loại
});


// API Semesters

Route::prefix('semesters')->group(function () {
    // Lấy danh sách học kỳ
    Route::get('/', [SemesterController::class, 'index']);
    // Lấy chi tiết học kỳ
    Route::get('/{id}', [SemesterController::class, 'show']);
    // Tạo học kỳ
    Route::post('/', [SemesterController::class, 'store']);
    // Cập nhật học kỳ
    Route::put('/{id}', [SemesterController::class, 'update']);
    // Xóa học kỳ
    Route::delete('/{id}', [SemesterController::class, 'destroy']);

    // Gán môn học vào học kỳ
    Route::post('/{semesterId}/add-courses', [SemesterController::class, 'addCoursesToSemester']);
});


// API ProgramCourse
Route::prefix('program-courses')->group(function () {
    // Gán môn học vào chương trình (chỉ áp dụng cho loại không có học kỳ: certificate, specialized, software)
    Route::post('/assign', [ProgramCourseController::class, 'assign']);

    // Lấy danh sách môn học theo chương trình đào tạo
    Route::get('/training-programs/{trainingProgramId}', [ProgramCourseController::class, 'index']);

    // Xóa môn học khỏi chương trình đào tạo
    Route::delete('/{id}', [ProgramCourseController::class, 'destroy']);
});


//  API Courses (môn học)
Route::prefix('courses')->group(function () {
    // Lấy danh sách môn học
    Route::get('/', [CourseController::class, 'index']);

    // Lấy chi tiết môn học
    Route::get('{id}', [CourseController::class, 'show']);

    // Tạo môn học mới
    Route::post('/', [CourseController::class, 'store']);

    // Cập nhật môn học
    Route::put('{id}', [CourseController::class, 'update']);

    // Cập nhật trạng thái môn học (active/inactive)
    Route::put('{id}/status/{status}', [CourseController::class, 'updateStatus']);

    // Xóa môn học
    Route::delete('{id}', [CourseController::class, 'destroy']);
});


// API Course Sessions (buổi học của môn)

Route::prefix('course-sessions')->group(function () {
    // Lấy danh sách buổi học
    Route::get('/', [CourseSessionController::class, 'index']);

    // Lấy chi tiết buổi học
    Route::get('{id}', [CourseSessionController::class, 'show']);

    // Tạo buổi học mới
    Route::post('/', [CourseSessionController::class, 'store']);

    // Cập nhật buổi học
    Route::put('{id}', [CourseSessionController::class, 'update']);

    // Xóa buổi học
    Route::delete('{id}', [CourseSessionController::class, 'destroy']);
});


//  API Lessions
Route::prefix('lessons')->group(function () {
    // Route lấy danh sách bài học theo buổi học 
    Route::get('/course-session/{courseSessionId}', [LessonController::class, 'index']);

    // Route lấy chi tiết bài học theo ID (GET /lessons/{id})
    Route::get('/{id}', [LessonController::class, 'show']);

    // Route tạo mới bài học (POST /lessons/)
    Route::post('/', [LessonController::class, 'store']);

    // Route cập nhật bài học (PUT /lessons/{id})
    Route::put('/{id}', [LessonController::class, 'update']);

    // Route xóa bài học (DELETE /lessons/{id})
    Route::delete('/{id}', [LessonController::class, 'destroy']);
});


// API Materials (tài liệu của buổi)
Route::prefix('materials')->group(function () {
    Route::get('/lesson/{lessonId}', [MaterialController::class, 'index']);
    Route::get('/{id}', [MaterialController::class, 'show']);
    Route::post('/', [MaterialController::class, 'store']); // Tạo mới
    Route::put('/{id}', [MaterialController::class, 'update']); // Cập nhật JSON
    Route::post('/{id}/update', [MaterialController::class, 'updateWithFile']); // Cập nhật có file
    Route::delete('/{id}', [MaterialController::class, 'destroy']);
});

// API student training-programs (thêm sinh viên vào CTĐT)
Route::prefix('student-training-programs')->group(function () {
    // Đăng ký học viên vào chương trình
    Route::post('/', [StudentTrainingProgramController::class, 'store']);

    // Lấy danh sách học viên trong chương trình đào tạo
    Route::get('/training-programs/{trainingProgramId}/students', [StudentTrainingProgramController::class, 'getStudents']);

    // Lấy thông tin học viên trong chương trình đào tạo
    Route::get('/{id}', [StudentTrainingProgramController::class, 'show']);

    // Bỏ học viên khỏi chương trình đào tạo
    Route::delete('/{studentId}/{trainingProgramId}', [StudentTrainingProgramController::class, 'removeStudent']);
});

//API exempt-courses (môn học miễn)
Route::prefix('exempt-courses')->group(function () {
    Route::post('/', [ExemptCourseController::class, 'store']); // Thêm môn miễn
    Route::get('/student/{studentId}', [ExemptCourseController::class, 'getExemptCourses']); // Lấy danh sách môn miễn của học viên
    Route::get('/check/{studentId}/{courseId}', [ExemptCourseController::class, 'checkExemption']); // Kiểm tra môn có được miễn không
});


// API certificates (chứng chỉ/ bằng)
Route::prefix('certificates')->group(function () {
    Route::post('/', [CertificateController::class, 'store']);
    Route::get('/{id}', [CertificateController::class, 'show']);
    Route::get('/student/{studentId}', [CertificateController::class, 'studentCertificates']);
});

// API exam-schedules (lịch thi)
Route::prefix('exam-schedules')->group(function () {
    Route::get('/', [ExamScheduleController::class, 'index']);
    Route::post('/', [ExamScheduleController::class, 'store']);
    Route::get('/{id}', [ExamScheduleController::class, 'show']);
    Route::put('/{id}', [ExamScheduleController::class, 'update']);
    Route::delete('/{id}', [ExamScheduleController::class, 'destroy']);
});

// API Điểm rèn luyện

Route::prefix('discipline-scores')->group(function () {
    // Lấy danh sách điểm rèn luyện
    Route::get('/', [DisciplineScoreController::class, 'index']);

    // Lấy chi tiết điểm rèn luyện
    Route::get('/{id}', [DisciplineScoreController::class, 'show']);

    // Tạo mới điểm rèn luyện
    Route::post('/', [DisciplineScoreController::class, 'store']);

    // Cập nhật điểm rèn luyện
    Route::put('/{id}', [DisciplineScoreController::class, 'update']);

    // Xóa điểm rèn luyện
    Route::delete('/{id}', [DisciplineScoreController::class, 'destroy']);
});

//API KQHT

Route::prefix('learning-results')->group(function () {
    // Lấy tất cả kết quả học tập
    Route::get('/', [LearningResultController::class, 'index']);

    // Lấy kết quả học tập theo ID
    Route::get('/{id}', [LearningResultController::class, 'show']);

    // Tạo mới kết quả học tập
    Route::post('/', [LearningResultController::class, 'store']);

    // Cập nhật kết quả học tập
    Route::put('/{id}', [LearningResultController::class, 'update']);

    // Xóa kết quả học tập
    Route::delete('/{id}', [LearningResultController::class, 'destroy']);
});

// API thi lại

Route::prefix('re-exam-registrations')->group(function () {
    // Lấy tất cả đăng ký thi lại
    Route::get('/docker-compose.yml', [ReExamRegistrationController::class, 'index']);

    // Lấy đăng ký thi lại theo ID
    Route::get('/{id}', [ReExamRegistrationController::class, 'show']);

    // Tạo mới đăng ký thi lại
    Route::post('/', [ReExamRegistrationController::class, 'store']);

    // Cập nhật đăng ký thi lại
    Route::put('/{id}', [ReExamRegistrationController::class, 'update']);

    // Xóa đăng ký thi lại
    Route::delete('/{id}', [ReExamRegistrationController::class, 'destroy']);
});



// API Notifications
Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::post('/', [NotificationController::class, 'store']);
    Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/{id}', [NotificationController::class, 'destroy']);
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








// Chat
Route::middleware('auth:api')->group(function () {
    // Lấy tin nhắn của người dùng hiện tại
    Route::get('/messages', [ChatController::class, 'index']);

    // Gửi tin nhắn
    Route::post('/messages', [ChatController::class, 'sendMessage']);

    // Lấy danh sách học viên đã từng chat với Admin
    Route::get('/students', [ChatController::class, 'getStudentsWhoChatted']);
});





Route::get('/', function () {
    return "******************************** API ***********************";
});