<?php
namespace App\Http\Controllers\API;

use Exception;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\TrainingProgramService;
use App\Http\Requests\TrainingProgramRequest\TrainingProgramRequest;

class TrainingProgramController extends Controller
{
    protected $service;

    public function __construct(TrainingProgramService $service)
    {
        $this->service = $service;
    }

    // Lấy tất cả chương trình đào tạo
    public function index(): JsonResponse
    {
        try {
            $programs = $this->service->getAll();

            if ($programs->isEmpty()) {
                return response()->json([
                    'message' => 'Không có chương trình đào tạo nào.',
                    'data' => []
                ], 200);
            }


            return response()->json([
                'message' => 'Danh sách chương trình đào tạo.',
                'data' => $programs
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết chương trình đào tạo
    public function show($id): JsonResponse
    {
        try {
            $program = $this->service->getById($id);

            if (!$program) {
                return response()->json([
                    'message' => 'Chương trình đào tạo không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết chương trình đào tạo.',
                'data' => $program
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy chi tiết chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo mới chương trình đào tạo
    public function store(TrainingProgramRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $program = $this->service->create($data);

            if (in_array($program->level, ['college', 'intermediate'])) {
                // Tạo học kỳ đầu tiên
                $semesters = [
                    'Học kỳ 01',
                    'Học kỳ 02',
                    'Học kỳ 03'
                ];

                foreach ($semesters as $semesterName) {
                    $semester = new Semester([
                        'name' => $semesterName,
                        'training_program_id' => $program->id
                    ]);
                    $semester->save();
                }
            }

            return response()->json([
                'message' => 'Tạo chương trình đào tạo thành công.',
                'data' => $program
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Cập nhật chương trình đào tạo
    public function update(TrainingProgramRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $program = $this->service->update($id, $data);

            if (!$program) {
                return response()->json([
                    'message' => 'Không tìm thấy chương trình đào tạo để cập nhật.'
                ], 404);
            }

            return response()->json([
                'message' => 'Cập nhật chương trình đào tạo thành công.',
                'data' => $program
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa chương trình đào tạo
    public function destroy($id): JsonResponse
    {
        try {
            $deleted = $this->service->delete($id);

            if (!$deleted) {
                return response()->json([
                    'message' => 'Không tìm thấy chương trình đào tạo để xóa.'
                ], 404); // Nếu không tìm thấy chương trình để xóa
            }

            return response()->json([
                'message' => 'Xóa chương trình đào tạo thành công.'
            ], 200); // Nếu xóa thành công

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500); // Xử lý lỗi server
        }
    }


    // Lọc chương trình đào tạo theo cấp bậc
    public function filterByLevel($level): JsonResponse
    {
        try {
            $programs = $this->service->getByLevel($level);

            if ($programs->isEmpty()) {
                return response()->json([
                    'message' => "Không có chương trình đào tạo nào với cấp bậc '{$level}'.",
                    'data' => []
                ], 200);
            }


            return response()->json([
                'message' => 'Danh sách chương trình đào tạo theo cấp bậc.',
                'data' => $programs
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lọc chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Phần cho Học viên
    public function getStudentPrograms(Request $request)
    {
        try {
            $user = $request->user(); // Lấy người dùng từ JWT token
            $programs = $user->trainingPrograms; // Lấy các chương trình đào tạo mà học viên đang tham gia

            if ($programs->isEmpty()) {
                return response()->json([
                    'message' => 'Bạn chưa đăng ký chương trình đào tạo nào.',
                    'data' => []
                ], 200);
            }


            return response()->json([
                'message' => 'Danh sách chương trình đào tạo bạn đang học.',
                'data' => $programs
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Lấy danh sách học kỳ theo chương trình đào tạo
    public function getSemesters($id)
    {
        try {
            // Gọi repo để lấy danh sách học kỳ
            $semestersData = $this->service->getSemestersByProgramId($id);

            // Kiểm tra nếu không có học kỳ nào
            if (empty($semestersData['semesters'])) {
                return response()->json([
                    'message' => 'Không có học kỳ nào trong chương trình đào tạo này.'
                ], 404);
            }

            // Trả về kết quả theo cấu trúc mong muốn
            return response()->json([
                'message' => 'Danh sách học kỳ theo chương trình đào tạo.',
                'data' => $semestersData
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách học kỳ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getStudentsWithoutScores($programId, $semesterId)
    {
        try {
            // Gọi phương thức từ service
            $students = $this->service->getStudentsWithoutScoresForSemester($programId, $semesterId);

            if ($students->isEmpty()) {
                return response()->json([
                    'message' => 'Không có học viên nào chưa nhập điểm rèn luyện cho học kỳ này.',
                    'data' => []
                ], 200);
            }


            return response()->json([
                'message' => 'Danh sách học viên chưa nhập điểm rèn luyện.',
                'data' => $students
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //For student
    public function detailed($id)
    {
        try {
            $program = $this->service->getDetailedById($id);

            if (!$program) {
                return response()->json([
                    'message' => 'Chương trình đào tạo không tồn tại.'
                ], 404);
            }

            // Tính tổng số tín chỉ và thời gian
            $totalCredits = 0;
            $totalHours = 0;
            $totalTheoryHours = 0;
            $totalPracticeHours = 0;
            $totalExamHours = 0;

            // Dữ liệu sẽ được trả về
            $data = [
                'id' => $program->id,
                'name' => $program->name,
                'code' => $program->code,
                'level' => $program->level,
                'note' => $program->note,
                'advisor' => $program->advisor,
                'semesters' => [],
                'program_courses' => [] // Để lưu các môn học không có học kỳ
            ];

            // Nếu chương trình có học kỳ
            if (!$program->semesters->isEmpty()) {
                $data['semesters'] = $program->semesters->map(function ($semester) use (&$totalCredits, &$totalHours, &$totalTheoryHours, &$totalPracticeHours, &$totalExamHours) {
                    return [
                        'id' => $semester->id,
                        'name' => $semester->name,
                        'courses' => $semester->courses->map(function ($course) use (&$totalCredits, &$totalHours, &$totalTheoryHours, &$totalPracticeHours, &$totalExamHours) {
                            // Cộng dồn tổng tín chỉ và thời gian
                            $totalCredits += $course->credits;
                            $totalHours += $course->total_hours;
                            $totalTheoryHours += $course->theory_hours;
                            $totalPracticeHours += $course->practice_hours;
                            $totalExamHours += $course->exam_hours;

                            return [
                                'id' => $course->id,
                                'code' => $course->code,
                                'name' => $course->title,
                                'credits' => $course->credits,
                                'total_hours' => $course->total_hours,
                                'theory_hours' => $course->theory_hours,
                                'practice_hours' => $course->practice_hours,
                                'exam_hours' => $course->exam_hours,
                            ];
                        })
                    ];
                });
            }

            // Nếu chương trình không có học kỳ, lấy các môn học từ programCourses
            if ($program->semesters->isEmpty()) {
                $data['program_courses'] = $program->programCourses->map(function ($programCourse) use (&$totalCredits, &$totalHours, &$totalTheoryHours, &$totalPracticeHours, &$totalExamHours) {
                    $course = $programCourse->course; // Lấy môn học từ quan hệ programCourses

                    // Cộng dồn tổng tín chỉ và thời gian
                    $totalCredits += $course->credits;
                    $totalHours += $course->total_hours;
                    $totalTheoryHours += $course->theory_hours;
                    $totalPracticeHours += $course->practice_hours;
                    $totalExamHours += $course->exam_hours;

                    return [
                        'id' => $course->id,
                        'code' => $course->code,
                        'name' => $course->title,
                        'credits' => $course->credits,
                        'total_hours' => $course->total_hours,
                        'theory_hours' => $course->theory_hours,
                        'practice_hours' => $course->practice_hours,
                        'exam_hours' => $course->exam_hours,
                    ];
                });
            }

            // Thêm tổng kết vào dữ liệu
            $data['summary'] = [
                'total_credits' => $totalCredits,
                'total_hours' => $totalHours,
                'total_theory_hours' => $totalTheoryHours,
                'total_practice_hours' => $totalPracticeHours,
                'total_exam_hours' => $totalExamHours,
            ];

            return response()->json([
                'message' => 'Chi tiết đầy đủ chương trình đào tạo.',
                'data' => $data
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy chi tiết chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



}