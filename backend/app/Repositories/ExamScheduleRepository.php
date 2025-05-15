<?php

namespace App\Repositories;

use App\Models\ExamSchedule;
use App\Models\TrainingProgram;
use Illuminate\Support\Facades\DB;
use App\Interfaces\ExamScheduleInterface;

class ExamScheduleRepository implements ExamScheduleInterface
{
    // ADMIN - Quản lý lịch thi
    public function getAll(array $filters = [])
    {
        $query = ExamSchedule::query();

        $query
            ->when($filters['training_program_id'] ?? null, fn($q, $v) => $q->where('training_program_id', $v))
            ->when($filters['semester_id'] ?? null, fn($q, $v) => $q->where('semester_id', $v))
            ->when($filters['course_id'] ?? null, fn($q, $v) => $q->where('course_id', $v))
            ->when($filters['exam_type'] ?? null, fn($q, $v) => $q->where('exam_type', $v))
            ->when($filters['exam_date'] ?? null, fn($q, $v) => $q->whereDate('exam_date', $v));


        return $query->with(['course', 'semester', 'trainingProgram'])->get();
    }

    public function getById($id)
    {
        return ExamSchedule::with(['course', 'semester', 'trainingProgram'])->findOrFail($id);
    }

    public function create(array $data)
    {
        // Kiểm tra xem chương trình đào tạo có yêu cầu học kỳ hay không
        $trainingProgram = TrainingProgram::findOrFail($data['training_program_id']);



        if (in_array($trainingProgram->level, ['certificate', 'specialized', 'software'])) {
            // Nếu không có học kỳ, bỏ qua semester_id
            $data['semester_id'] = null;
        }

        return ExamSchedule::create($data);
    }

    public function update($id, array $data)
    {
        $examSchedule = ExamSchedule::findOrFail($id);

        // Giữ nguyên các giá trị hiện tại của course_id, semester_id, training_program_id
        $data['course_id'] = $examSchedule->course_id;
        $data['semester_id'] = $examSchedule->semester_id;
        $data['training_program_id'] = $examSchedule->training_program_id;

        // Cập nhật các trường còn lại
        $examSchedule->update($data);

        return $examSchedule;
    }



    public function delete($id)
    {
        $examSchedule = ExamSchedule::findOrFail($id);
        $examSchedule->delete();
        return true;
    }

    // STUDENT - Lấy lịch thi CHÍNH cho học viên
    public function getSchedulesForStudent($studentId)
    {
        $trainingProgramIds = DB::table('student_training_programs')
            ->where('user_id', $studentId)
            ->pluck('training_program_id');

        return ExamSchedule::whereIn('training_program_id', $trainingProgramIds)
            ->with(['course', 'semester', 'trainingProgram'])
            ->get();
    }

    // Lịch thi chính sắp tới trong 7 ngày
    public function getUpcomingForStudent($studentId)
    {
        $trainingProgramIds = DB::table('student_training_programs')
            ->where('user_id', $studentId)
            ->pluck('training_program_id');

        return ExamSchedule::whereIn('training_program_id', $trainingProgramIds)
            ->whereDate('exam_date', '>', now())
            ->whereDate('exam_date', '<=', now()->addDays(7))
            ->with(['course', 'semester', 'trainingProgram'])
            ->get();
    }

    // Lịch thi chính của môn học cụ thể
    public function getCourseScheduleForStudent($studentId, $courseId)
    {
        $trainingProgramIds = DB::table('student_training_programs')
            ->where('user_id', $studentId)
            ->pluck('training_program_id');

        return ExamSchedule::where('course_id', $courseId)
            ->whereIn('training_program_id', $trainingProgramIds)
            ->with(['course', 'semester', 'trainingProgram'])
            ->get();
    }

    // Lịch thi lại (dựa vào bảng đăng ký thi lại)
    public function getRetakeScheduleForStudent($studentId, $courseId)
    {
        return ExamSchedule::where('course_id', $courseId)
            ->whereHas('reExamRegistrations', function ($query) use ($studentId) {
                $query->where('student_id', $studentId);
            })
            ->with(['course', 'semester', 'trainingProgram'])
            ->get();
    }
}