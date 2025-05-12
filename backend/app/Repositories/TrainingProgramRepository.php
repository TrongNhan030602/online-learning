<?php
namespace App\Repositories;

use App\Models\DisciplineScore;
use App\Models\TrainingProgram;
use App\Interfaces\TrainingProgramRepositoryInterface;

class TrainingProgramRepository implements TrainingProgramRepositoryInterface
{
    public function getAll()
    {
        return TrainingProgram::with(['advisor', 'semesters', 'programCourses.course', 'banners'])->get();
    }

    public function getById($id)
    {
        return TrainingProgram::with(['advisor', 'semesters', 'programCourses.course', 'banners'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return TrainingProgram::create($data);
    }

    public function update($id, array $data)
    {
        $program = TrainingProgram::findOrFail($id);
        $program->update($data);
        return $program->fresh();
    }

    public function delete($id)
    {
        // Thử tìm chương trình đào tạo theo ID
        $program = TrainingProgram::find($id);

        // Nếu không tìm thấy chương trình đào tạo
        if (!$program) {
            return false; // Trả về false nếu không tìm thấy chương trình đào tạo
        }

        // Xóa chương trình đào tạo
        $program->delete();

        return true; // Trả về true nếu xóa thành công
    }


    public function getByLevel($level)
    {
        return TrainingProgram::where('level', $level)->with(['advisor'])->get();
    }

    // For Student 
    public function getDetailedById($id)
    {
        // Lấy thông tin chương trình đào tạo theo ID
        $program = TrainingProgram::with([
            'advisor', // Cố vấn của chương trình
            'semesters.courses', // Các học kỳ và các môn học của học kỳ
            'programCourses.course' // Các môn học của chương trình không có học kỳ
        ])->find($id);

        // Kiểm tra nếu không có học kỳ (semesters)
        if ($program && $program->semesters->isEmpty()) {
            // Nếu không có học kỳ, lấy các môn học từ bảng programCourses
            $program->courses = $program->programCourses->map(function ($programCourse) {
                return $programCourse->course; // Trả về môn học tương ứng
            });
        }

        return $program;
    }

    public function getSemestersByProgramId($programId)
    {
        // Lấy chương trình đào tạo theo programId
        $program = TrainingProgram::findOrFail($programId);

        // Lấy danh sách học kỳ của chương trình đào tạo, sắp xếp theo id tăng dần
        $semesters = $program->semesters()
            ->orderBy('id')
            ->get(['id', 'name']);

        // Trả về mảng dữ liệu chứa thông tin về chương trình và học kỳ
        return [
            'program_name' => $program->name,
            'program_code' => $program->code,
            'semesters' => $semesters
        ];
    }



    public function getStudentsWithoutScoresForSemester($programId, $semesterId)
    {
        // Lấy chương trình đào tạo theo ID
        $program = TrainingProgram::findOrFail($programId);

        // Lấy học kỳ thuộc chương trình đào tạo
        $semester = $program->semesters()->find($semesterId);

        if (!$semester) {
            throw new \Exception('Học kỳ không tồn tại trong chương trình đào tạo này.');
        }

        // Lấy các bản ghi student_training_program kèm thông tin user
        $studentPrograms = $program->studentTrainingPrograms()->with('user')->get();

        // Lọc các sinh viên chưa có điểm rèn luyện cho học kỳ
        $studentsWithoutScores = $studentPrograms->filter(function ($studentProgram) use ($semester) {
            return !DisciplineScore::where('student_training_program_id', $studentProgram->id)
                ->where('semester_id', $semester->id)
                ->exists();
        });

        // Trả về dữ liệu dạng gọn
        return $studentsWithoutScores->map(function ($studentProgram) {
            return [
                'id' => $studentProgram->id, // ID của bảng student_training_programs
                'name' => $studentProgram->user->name ?? null,
                'email' => $studentProgram->user->email ?? null,
                'student_training_program_id' => $studentProgram->id,
            ];
        })->values();
    }


}