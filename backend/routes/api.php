<?php
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\FaqController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\UserController;

use App\Http\Controllers\API\ScoreController;
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
use App\Http\Controllers\API\TrainingProgramBannerController;
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
Route::prefix('auth')->group(function () {
    // Không cần auth
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('/refresh-token', [AuthController::class, 'refreshAccessToken']);
    Route::post('reset-password', [AuthController::class, 'sendMail']);
    Route::put('reset-password/{token}', [AuthController::class, 'reset']);

    // Cần auth:api
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::get('personal-info', [UserController::class, 'personalInfo']);
    });
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
    Route::get('/role/{role}', [UserController::class, 'getUsersByRole'])->middleware('auth:api', 'role:admin');
    Route::get('/{id}/detail', [UserController::class, 'getUserFullInfoById'])->middleware('auth:api', 'role:admin');
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

    // Lấy danh sách học kỳ của chương trình đào tạo
    Route::get('/{id}/semesters', [TrainingProgramController::class, 'getSemesters']);
    // Route để lấy danh sách học viên chưa nhập điểm rèn luyện cho học kỳ cụ thể
    Route::get('/{id}/semesters/{semesterId}/students-without-scores', [TrainingProgramController::class, 'getStudentsWithoutScores']);

    // Route để lấy danh sách môn học chưa được gán vào học kỳ nào
    Route::get('/{trainingProgramId}/courses-not-in-semesters', [SemesterController::class, 'getUnassignedCourses']);
});


//API Training-Program  Banners
Route::prefix('training-program-banners')->group(function () {
    Route::get('/{programId}', [TrainingProgramBannerController::class, 'index']);
    Route::post('/', [TrainingProgramBannerController::class, 'store']);
    Route::post('/{id}', [TrainingProgramBannerController::class, 'update']); // Không dùng PUT vì có file
    Route::delete('/{id}', [TrainingProgramBannerController::class, 'destroy']);
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
    // Môn học của học kỳ
    Route::get('/{semesterId}/courses', [SemesterController::class, 'getCoursesBySemester']);

    // Gán môn học vào học kỳ
    Route::post('/{semesterId}/add-courses', [SemesterController::class, 'addCoursesToSemester']);
    // Xóa môn học khỏi học kỳ
    Route::post('/{semesterId}/remove-courses', [SemesterController::class, 'removeCoursesFromSemester']);

});


// API ProgramCourse
Route::prefix('program-courses')->group(function () {
    // Gán môn học vào chương trình (chỉ áp dụng cho loại không có học kỳ: certificate, specialized, software)
    Route::post('/assign', [ProgramCourseController::class, 'assign']);

    // Lấy danh sách môn học theo chương trình đào tạo
    Route::get('/training-programs/{trainingProgramId}', [ProgramCourseController::class, 'index']);

    // Lấy danh sách môn học mà chương trình chưa có
    Route::get('/available-courses/{trainingProgramId}', [ProgramCourseController::class, 'getAvailableCourses']);

    // Xóa môn học khỏi chương trình đào tạo
    Route::delete('/{id}', [ProgramCourseController::class, 'destroy']);
});


//  API Courses (môn học)
Route::prefix('courses')->group(function () {
    // Lấy danh sách môn học
    Route::get('/', [CourseController::class, 'index']);

    // Lấy chi tiết môn học
    Route::get('{id}', [CourseController::class, 'show']);
    Route::get('/{id}/full-detail', [CourseController::class, 'fullDetail']);
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
    Route::post('/{id}', [MaterialController::class, 'updateWithFile']); // Cập nhật file (POST nhưng vào id luôn)
    Route::delete('/{id}', [MaterialController::class, 'destroy']);
});

// API student training-programs (thêm sinh viên vào CTĐT)
Route::prefix('student-training-programs')->group(function () {
    // Đăng ký học viên vào chương trình
    Route::post('/', [StudentTrainingProgramController::class, 'store']);

    // Lấy danh sách học viên trong chương trình đào tạo
    Route::get('/training-programs/{trainingProgramId}/students', [StudentTrainingProgramController::class, 'getStudents']);
    //Lấy danh sách học viên không có trong chương trình đào tạo
    Route::get('/training-programs/{trainingProgramId}/students/not-registered', [StudentTrainingProgramController::class, 'getStudentsNotInProgram']);
    Route::get('/{studentId}/previous', [StudentTrainingProgramController::class, 'getPreviousProgram']);

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


// API certificates (chứng chỉ/ bằng) ==> X
Route::prefix('certificates')->group(function () {
    Route::post('/', [CertificateController::class, 'store']);
    Route::get('/{id}', [CertificateController::class, 'show']);
    Route::get('/student/{studentId}', [CertificateController::class, 'studentCertificates']);
});

Route::prefix('exam-schedules')->group(function () {

    // ADMIN - Lấy tất cả lịch thi (có thể lọc theo các tham số)
    Route::get('/', [ExamScheduleController::class, 'index']);  // GET /api/exam-schedules

    // ADMIN - Lấy chi tiết lịch thi theo ID
    Route::get('{id}', [ExamScheduleController::class, 'show']);  // GET /api/exam-schedules/{id}

    // ADMIN - Tạo lịch thi mới
    Route::post('/', [ExamScheduleController::class, 'store']);  // POST /api/exam-schedules

    // ADMIN - Cập nhật lịch thi
    Route::put('{id}', [ExamScheduleController::class, 'update']);  // PUT /api/exam-schedules/{id}

    // ADMIN - Xóa lịch thi
    Route::delete('{id}', [ExamScheduleController::class, 'destroy']);  // DELETE /api/exam-schedules/{id}

    // STUDENT - Lịch thi cho học viên

    Route::get('student/{studentId}', [ExamScheduleController::class, 'studentSchedules']);  // GET /api/exam-schedules/student/{studentId}

    // STUDENT - Lịch thi sắp tới cho học viên (ví dụ trong 7 ngày tới)
    Route::get('student/{studentId}/upcoming', [ExamScheduleController::class, 'upcomingSchedules']);  // GET /api/exam-schedules/student/{studentId}/upcoming

    // STUDENT - Lịch thi cho môn học cụ thể của học viên
    Route::get('student/{studentId}/course/{courseId}', [ExamScheduleController::class, 'courseSchedule']);  // GET /api/exam-schedules/student/{studentId}/course/{courseId}

    // STUDENT - Lịch thi lại cho học viên
    Route::get('student/{studentId}/retake/{courseId}', [ExamScheduleController::class, 'retakeSchedule']);  // GET /api/exam-schedules/student/{studentId}/retake/{courseId}
// STUDENT - Lịch thi cho sinh viên đang đăng nhập (không cần truyền studentId)
    Route::middleware('auth:api', 'role:student')->get('me/schedules', [ExamScheduleController::class, 'mySchedules']);  // GET /api/exam-schedules/my-schedules
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

    Route::get('/student/points', [DisciplineScoreController::class, 'getByStudent']);
});

// API Điểm
Route::prefix('scores')->group(function () {
    //Danh sách điểm
    Route::get('/', [ScoreController::class, 'index']);
    // Tạo điểm mới (nhập điểm)
    Route::post('/', [ScoreController::class, 'store']);

    // Cập nhật điểm theo ID
    Route::put('/{id}', [ScoreController::class, 'update']);
    Route::patch('/{id}', [ScoreController::class, 'update']);
    Route::delete('/{id}', [ScoreController::class, 'destroy']);

    // Lấy bảng điểm của học viên theo studentId
    Route::get('/student/{studentId}', [ScoreController::class, 'getStudentScores']);
    Route::get('/me', [ScoreController::class, 'getMyScores']);

    // Lấy bảng điểm của môn học theo courseId
    Route::get('/course/{courseId}', [ScoreController::class, 'getCourseScores']);

    // Lấy bảng điểm của học viên theo học kỳ
    Route::get('/student/{studentId}/semester/{semesterId}', [ScoreController::class, 'getStudentScoresBySemester']);
});

//API KQHT

Route::prefix('learning-results')->group(function () {
    // Lấy danh sách kết quả học tập (có thể dùng filter: program_id, student_training_program_id, semester_id)
    Route::get('/', [LearningResultController::class, 'index']);

    // Lấy chi tiết kết quả học tập theo ID
    Route::get('/{id}', [LearningResultController::class, 'show']);

    // Tạo mới kết quả học tập
    Route::post('/', [LearningResultController::class, 'store']);

    // Cập nhật kết quả học tập
    Route::put('/{id}', [LearningResultController::class, 'update']);
    Route::patch('/{id}', [LearningResultController::class, 'update']); // Optional: dùng PATCH nếu cần

    // Xóa kết quả học tập
    Route::delete('/{id}', [LearningResultController::class, 'destroy']);

    // Lấy kết quả học tập theo học viên, chương trình và học kỳ
    Route::get('/by-student', [LearningResultController::class, 'getByStudent']);

    // Tính và cập nhật điểm trung bình
    Route::post('/calculate-average', [LearningResultController::class, 'calculateAverageScore']);

    // Báo cáo tổng hợp kết quả học tập
    Route::get('/report', [LearningResultController::class, 'report']);
});
// API thi lại

Route::prefix('re-exam-registrations')->group(function () {
    Route::get('/', [ReExamRegistrationController::class, 'index']);               // Lấy tất cả đăng ký thi lại (có quan hệ)
    Route::get('/me', [ReExamRegistrationController::class, 'getMyReExamRegistrations']); // ✅ Đặt trước
    Route::get('/{id}', [ReExamRegistrationController::class, 'show']);
    Route::post('/', [ReExamRegistrationController::class, 'store']);              // Tạo mới đăng ký thi lại
    Route::put('/{id}', [ReExamRegistrationController::class, 'update']);          // Cập nhật đăng ký thi lại
    Route::delete('/{id}', [ReExamRegistrationController::class, 'destroy']);      // Xóa đăng ký thi lại

    Route::get('/user/{userId}', [ReExamRegistrationController::class, 'getByUser']);  // Lấy đăng ký thi lại theo user (có quan hệ)
    Route::get('/status/{status}', [ReExamRegistrationController::class, 'getByStatus']);  // Lấy đăng ký thi lại theo trạng thái

    Route::patch('/{id}/status/{status}', [ReExamRegistrationController::class, 'changeStatus']);  // Thay đổi trạng thái đăng ký thi lại
});



// API Notifications
Route::prefix('notifications')->middleware('auth:api')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::post('/', [NotificationController::class, 'store']);
    Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::get('/statistics', [NotificationController::class, 'statistics']);
    Route::delete('/{id}', [NotificationController::class, 'delete']);
    Route::get('/training-program/{trainingProgramId}', [NotificationController::class, 'getByTrainingProgram']);
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


// Routes For Student

Route::prefix('student')->middleware('auth:api')->group(function () {
    // Lấy danh sách chương trình đào tạo mà học viên đang tham gia
    Route::get('/training-programs', [TrainingProgramController::class, 'getStudentPrograms']);
    Route::get('/training-programs/{id}/detail', [TrainingProgramController::class, 'detailed']);
    Route::get('/courses/{id}/learning', [CourseController::class, 'learningDetail']);
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