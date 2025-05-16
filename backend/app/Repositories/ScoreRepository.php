<?php

namespace App\Repositories;

use App\Models\Score;
use App\Models\ProgramCourse;
use App\Models\SemesterCourse;
use App\Models\StudentTrainingProgram;
use App\Interfaces\ScoreRepositoryInterface;

class ScoreRepository implements ScoreRepositoryInterface
{
    public function create(array $data)
    {
        // Lấy chương trình học viên đăng ký
        $studentProgram = StudentTrainingProgram::with('trainingProgram')->findOrFail($data['student_training_program_id']);
        $trainingProgram = $studentProgram->trainingProgram;

        // Kiểm tra môn học có thuộc chương trình hay không
        $courseValid = false;
        if (in_array($trainingProgram->level, ['college', 'intermediate'])) {
            $courseValid = SemesterCourse::whereHas('semester', function ($q) use ($trainingProgram) {
                $q->where('training_program_id', $trainingProgram->id);
            })->where('course_id', $data['course_id'])->exists();
        } else {
            $courseValid = ProgramCourse::where('training_program_id', $trainingProgram->id)
                ->where('course_id', $data['course_id'])->exists();
        }

        if (!$courseValid) {
            throw new \Exception('Môn học không thuộc chương trình đào tạo.');
        }

        // Nếu có semester_id, kiểm tra xem học kỳ đó có thuộc chương trình không
        if (!empty($data['semester_id']) && in_array($trainingProgram->level, ['college', 'intermediate'])) {
            $semesterBelongsToProgram = \App\Models\Semester::where('id', $data['semester_id'])
                ->where('training_program_id', $trainingProgram->id)
                ->exists();

            if (!$semesterBelongsToProgram) {
                throw new \Exception('Học kỳ không thuộc chương trình đào tạo.');
            }
        }

        // Xóa semester_id nếu chương trình không có học kỳ
        if (!in_array($trainingProgram->level, ['college', 'intermediate'])) {
            $data['semester_id'] = null;
        }

        return Score::create($data);
    }


    public function update($id, array $data)
    {
        $score = Score::findOrFail($id);

        // Lấy chương trình học viên đăng ký
        $studentProgram = StudentTrainingProgram::with('trainingProgram')->findOrFail($data['student_training_program_id']);
        $trainingProgram = $studentProgram->trainingProgram;

        // Kiểm tra môn học có thuộc chương trình hay không
        $courseValid = false;
        if (in_array($trainingProgram->level, ['college', 'intermediate'])) {
            $courseValid = SemesterCourse::whereHas('semester', function ($q) use ($trainingProgram) {
                $q->where('training_program_id', $trainingProgram->id);
            })->where('course_id', $data['course_id'])->exists();
        } else {
            $courseValid = ProgramCourse::where('training_program_id', $trainingProgram->id)
                ->where('course_id', $data['course_id'])->exists();
        }

        if (!$courseValid) {
            throw new \Exception('Môn học không thuộc chương trình đào tạo.');
        }

        // Nếu có semester_id, kiểm tra xem học kỳ đó có thuộc chương trình không
        if (!empty($data['semester_id']) && in_array($trainingProgram->level, ['college', 'intermediate'])) {
            $semesterBelongsToProgram = \App\Models\Semester::where('id', $data['semester_id'])
                ->where('training_program_id', $trainingProgram->id)
                ->exists();

            if (!$semesterBelongsToProgram) {
                throw new \Exception('Học kỳ không thuộc chương trình đào tạo.');
            }
        }

        // Xóa semester_id nếu chương trình không có học kỳ
        if (!in_array($trainingProgram->level, ['college', 'intermediate'])) {
            $data['semester_id'] = null;
        }

        $score->update($data);
        return $score;
    }


    public function getByStudent($studentId)
    {
        return Score::where('user_id', $studentId)
            ->with([
                'course:id,code,title',
                'semester:id,name',
                'studentTrainingProgram.trainingProgram:id,code,name'
            ])
            ->get();

    }


    public function getByCourse($courseId)
    {
        return Score::where('course_id', $courseId)->with('user')->get();
    }

    public function getByStudentAndSemester($studentId, $semesterId)
    {
        return Score::where('user_id', $studentId)
            ->where('semester_id', $semesterId)
            ->with('course')
            ->get();
    }

    public function getById($id)
    {
        return Score::findOrFail($id);
    }

    // Mới thêm

    public function getAcceptedScoresByUser($userId)
    {
        return Score::where('user_id', $userId)
            ->where('is_accepted', true)
            ->get();
    }

    public function getLatestAttemptScore($userId, $courseId)
    {
        return Score::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->orderByDesc('attempt')
            ->first();
    }

    public function calculateAverageScore($userId)
    {
        return Score::where('user_id', $userId)
            ->where('is_accepted', true)
            ->avg('value');
    }
}