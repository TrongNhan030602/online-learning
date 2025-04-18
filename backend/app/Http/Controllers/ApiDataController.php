<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\ClassRoom;
use App\Models\ClassSession;
use Illuminate\Http\Request;
use App\Models\TrainingProgram;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ApiDataController extends Controller
{
    // ✅ GET /api/courses
    public function getCourses()
    {
        try {
            $courses = Course::all();

            if ($courses->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có khóa học nào.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $courses
            ]);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy khóa học: ' . $e->getMessage());
            return $this->serverError();
        }
    }

    // ✅ GET /api/training-programs/{courseId}
    public function getTrainingProgramsByCourse($courseId)
    {
        try {
            $programs = TrainingProgram::where('course_id', $courseId)->get();

            if ($programs->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có chương trình đào tạo cho khóa học ID: ' . $courseId,
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $programs
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy chương trình đào tạo: " . $e->getMessage());
            return $this->serverError();
        }
    }

    // ✅ GET /api/users
    public function getUsers()
    {
        try {
            // Lấy toàn bộ users kèm theo profile
            $users = User::with('profile')->get();

            if ($users->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có người dùng nào.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy danh sách người dùng: " . $e->getMessage());
            return $this->serverError();
        }
    }


    // ✅ GET /api/classes
    public function getClasses()
    {
        try {
            $classes = ClassRoom::all();

            if ($classes->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có lớp học nào.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $classes
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy danh sách lớp học: " . $e->getMessage());
            return $this->serverError();
        }
    }

    // ✅ GET /api/sessions/{classId}
    public function getSessionsByClass($classId)
    {
        try {
            $sessions = ClassSession::where('classroom_id', $classId)->get();

            if ($sessions->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có buổi học nào cho lớp ID: ' . $classId,
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $sessions
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy buổi học lớp $classId: " . $e->getMessage());
            return $this->serverError();
        }
    }
    // ✅ GET /api/students/all (Lấy tất cả học viên, đã  tham gia lớp học)
    public function getAllStudents()
    {
        try {
            // Chỉ lấy học viên đã ghi danh (có trong bảng enrollments)
            $students = DB::table('users')
                ->join('enrollments', 'users.id', '=', 'enrollments.user_id') // Đổi leftJoin -> join
                ->leftJoin('class_rooms', 'enrollments.classroom_id', '=', 'class_rooms.id')
                ->where('users.role', 'student')
                ->select(
                    'enrollments.id as student_id',
                    'users.id as user_id',
                    'users.name',
                    'users.email',
                    'enrollments.classroom_id',
                    'class_rooms.name as classroom_name'
                )
                ->get();

            if ($students->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có học viên nào đã ghi danh.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $students
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy danh sách học viên: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi server nội bộ. Vui lòng thử lại sau.'
            ], 500);
        }
    }

    // ✅ GET /api/students/{classId}
    public function getStudentsByClass($classId)
    {
        try {
            $class = ClassRoom::with('students')->find($classId);

            if (!$class) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy lớp học ID: ' . $classId,
                ], 404);
            }

            $students = $class->students;

            if ($students->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Lớp học không có học viên.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $students
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy học viên lớp $classId: " . $e->getMessage());
            return $this->serverError();
        }
    }
    public function getAllSessions()
    {
        try {
            $sessions = ClassSession::select('id', 'title', 'session_date', 'classroom_id')
                ->with([
                    'classroom' => function ($query) {
                        $query->select('id', 'name', 'course_id');
                    }
                ])
                ->orderBy('session_date', 'asc')
                ->get();

            if ($sessions->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không có buổi học nào được tìm thấy.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $sessions
            ]);
        } catch (\Exception $e) {
            \Log::error("Lỗi khi lấy danh sách buổi học: " . $e->getMessage());
            return $this->serverError();
        }
    }

    public function getAllTrainingPrograms()
    {
        try {
            $programs = TrainingProgram::select(
                'id',
                'course_id',
                'name',
                'description',
                'duration',
                'requirements',
                'objectives'
            )
                ->with(['course:id,title']) // nếu muốn kèm tên khóa học
                ->orderBy('course_id')
                ->get();

            if ($programs->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy chương trình đào tạo nào.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $programs,
            ]);
        } catch (\Exception $e) {
            \Log::error("Lỗi lấy chương trình đào tạo: " . $e->getMessage());
            return $this->serverError();
        }
    }


    // ✅ Hàm xử lý lỗi hệ thống chung
    private function serverError()
    {
        return response()->json([
            'status' => 'error',
            'message' => 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.'
        ], 500);
    }


}