<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProgramCourseRequest\ProgramCourseRequest;
use App\Services\ProgramCourseService;
use Exception;

class ProgramCourseController extends Controller
{
    protected $service;

    public function __construct(ProgramCourseService $service)
    {
        $this->service = $service;
    }

    // Lấy danh sách môn học trong chương trình đào tạo
    public function index($trainingProgramId)
    {
        try {
            $courses = $this->service->getCourses($trainingProgramId);

            if ($courses->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy môn học nào trong chương trình đào tạo này.'
                ], 404);
            }

            $program = $courses->first()->training_program_id;

            $formattedCourses = $courses->map(function ($programCourse) {
                return [
                    'id' => $programCourse->id,
                    'course_id' => $programCourse->course_id,
                    'course' => [
                        'id' => $programCourse->course->id,
                        'code' => $programCourse->course->code,
                        'title' => $programCourse->course->title,
                        'description' => $programCourse->course->description,
                        'credits' => $programCourse->course->credits,
                        'theory_hours' => $programCourse->course->theory_hours,
                        'practice_hours' => $programCourse->course->practice_hours,
                        'exam_hours' => $programCourse->course->exam_hours,
                        'total_hours' => $programCourse->course->total_hours,
                        'is_active' => $programCourse->course->is_active,
                    ]
                ];
            });

            return response()->json([
                'message' => 'Danh sách môn học trong chương trình đào tạo.',
                'data' => [
                    'training_program_id' => $program,
                    'courses' => $formattedCourses,
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Xóa môn học khỏi chương trình đào tạo
    public function destroy($id)
    {
        try {
            $deleted = $this->service->delete($id);

            if (!$deleted) {
                return response()->json([
                    'message' => 'Môn học không tồn tại trong chương trình đào tạo.'
                ], 404);
            }

            return response()->json([
                'message' => 'Môn học đã được xóa khỏi chương trình đào tạo.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa môn học khỏi chương trình đào tạo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Gán môn học vào chương trình đào tạo
    public function assign(ProgramCourseRequest $request)
    {
        try {
            $data = $request->validated();
            $programCourses = $this->service->assignCourse($data);

            return response()->json([
                'message' => 'Đã gán các môn học vào chương trình đào tạo.',
                'data' => $programCourses,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi gán môn học.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Lấy danh sách các môn học chưa được gán vào chương trình đào tạo
    public function getAvailableCourses($trainingProgramId)
    {
        try {
            $courses = $this->service->getAvailableCourses($trainingProgramId);

            if ($courses->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy môn học nào chưa được gán vào chương trình đào tạo này.'
                ], 404);
            }

            return response()->json([
                'message' => 'Danh sách môn học chưa được gán vào chương trình đào tạo.',
                'data' => $courses
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách môn học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }




}