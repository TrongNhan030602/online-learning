<?php
namespace App\Repositories;

use App\Models\Score;
use App\Models\CourseResult;
use App\Models\LearningResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Interfaces\LearningResultRepositoryInterface;

class LearningResultRepository implements LearningResultRepositoryInterface
{
    public function all(array $filters = [])
    {
        return $this->getQuery($filters)->get();
    }
    public function getLearningResultsForLoggedInStudent(): array
    {
        $user = Auth::user();
        if (!$user) {
            return [];
        }

        $studentPrograms = $user->studentTrainingPrograms()->with('trainingProgram.semesters')->get();

        $results = [];

        foreach ($studentPrograms as $studentProgram) {
            $program = $studentProgram->trainingProgram;

            $learningResults = LearningResult::where('student_training_program_id', $studentProgram->id)
                ->where('program_id', $program->id)
                ->with('semester')
                ->orderBy('semester_id')
                ->get();

            foreach ($learningResults as $learningResult) {
                $hasSemesters = in_array($program->level, ['college', 'intermediate']);

                // Xác định điều kiện lấy courseResults
                if ($hasSemesters) {
                    if ($learningResult->semester_id !== null) {
                        // Lấy courseResults theo học kỳ
                        $courseResults = CourseResult::where('student_training_program_id', $studentProgram->id)
                            ->where('semester_id', $learningResult->semester_id)
                            ->with('course')
                            ->get();
                    } else {
                        // Đây là điểm tổng, lấy tất cả courseResults thuộc chương trình (ko theo học kỳ)
                        $courseResults = CourseResult::where('student_training_program_id', $studentProgram->id)
                            ->whereNull('semester_id')
                            ->with('course')
                            ->get();
                    }
                } else {
                    // Chương trình không có học kỳ (ví dụ chứng chỉ), lấy courseResults semester_id null
                    $courseResults = CourseResult::where('student_training_program_id', $studentProgram->id)
                        ->whereNull('semester_id')
                        ->with('course')
                        ->get();
                }

                // Lấy điểm chi tiết cho từng courseResult
                foreach ($courseResults as $courseResult) {
                    $scores = Score::where('student_training_program_id', $studentProgram->id)
                        ->where('course_id', $courseResult->course_id)
                        ->where('semester_id', $learningResult->semester_id) // null hoặc id học kỳ
                        ->where('is_accepted', true)
                        ->get()
                        ->groupBy('score_type');

                    $courseResult->scores_detail = [
                        'quiz' => $scores->has('quiz') ? round($scores['quiz']->avg('value'), 2) : null,
                        'midterm' => $scores->has('midterm') ? round($scores['midterm']->avg('value'), 2) : null,
                        'final' => $scores->has('final') ? round($scores['final']->avg('value'), 2) : null,
                    ];
                }

                $learningResult->setRelation('courseResults', $courseResults);
            }

            $results[] = [
                'student_training_program_id' => $studentProgram->id,
                'program' => $program,
                'learning_results' => $learningResults,
            ];
        }

        return $results;
    }





    public function find(int $id)
    {
        return LearningResult::findOrFail($id);
    }

    public function delete(int $id)
    {
        return $this->find($id)->delete();
    }

    public function findByStudentAndProgram(int $studentTrainingProgramId, int $programId, ?int $semesterId = null)
    {
        // Kiểm tra student_training_program có thuộc chương trình
        if (!$this->checkStudentTrainingProgramBelongsToProgram($studentTrainingProgramId, $programId)) {
            throw new \InvalidArgumentException('Sinh viên không thuộc chương trình đào tạo này.');
        }
        if (!$this->checkSemesterBelongsToProgram($programId, $semesterId)) {
            throw new \InvalidArgumentException('Học kỳ không thuộc chương trình đào tạo.');
        }

        return LearningResult::where([
            'student_training_program_id' => $studentTrainingProgramId,
            'program_id' => $programId,
            'semester_id' => $semesterId
        ])->first();
    }

    /**
     * Tính điểm trung bình có trọng số tín chỉ
     */
    public function calculateAverageScore(int $studentTrainingProgramId, int $programId, ?int $semesterId = null): float
    {
        if (!$this->checkStudentTrainingProgramBelongsToProgram($studentTrainingProgramId, $programId)) {
            throw new \InvalidArgumentException('Sinh viên không thuộc chương trình đào tạo này.');
        }

        if (!$this->checkSemesterBelongsToProgram($programId, $semesterId)) {
            return 0.0;
        }

        $query = DB::table('course_results')
            ->join('courses', 'course_results.course_id', '=', 'courses.id')
            ->where('student_training_program_id', $studentTrainingProgramId)
            ->where('courses.credits', '>', 0);

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        $results = $query->select('course_results.average_score', 'courses.credits')->get();

        if ($results->isEmpty()) {
            return 0.0;
        }

        $totalScore = 0;
        $totalCredits = 0;

        foreach ($results as $result) {
            $totalScore += $result->average_score * $result->credits;
            $totalCredits += $result->credits;
        }

        return $totalCredits > 0 ? round($totalScore / $totalCredits, 2) : 0.0;
    }

    /**
     * Tính GPA theo điểm trung bình có trọng số tín chỉ
     */
    public function calculateGPA(int $studentTrainingProgramId, int $programId, ?int $semesterId = null): float
    {
        if (!$this->checkStudentTrainingProgramBelongsToProgram($studentTrainingProgramId, $programId)) {
            throw new \InvalidArgumentException('Sinh viên không thuộc chương trình đào tạo này.');
        }

        if (!$this->checkSemesterBelongsToProgram($programId, $semesterId)) {
            return 0.0;
        }

        $query = DB::table('course_results')
            ->join('courses', 'course_results.course_id', '=', 'courses.id')
            ->where('student_training_program_id', $studentTrainingProgramId)
            ->where('courses.credits', '>', 0);

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        $results = $query->select('course_results.average_score', 'courses.credits')->get();

        if ($results->isEmpty()) {
            return 0.0;
        }

        $totalPoints = 0;
        $totalCredits = 0;

        foreach ($results as $result) {
            $gpa = $this->convertScoreToGPA($result->average_score);
            $totalPoints += $gpa * $result->credits;
            $totalCredits += $result->credits;
        }

        return $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0.0;
    }

    public function updateLearningResult(
        int $studentTrainingProgramId,
        int $programId,
        ?int $semesterId,
        float $average,
        ?float $gpa = null
    ): bool {
        if (!$this->checkStudentTrainingProgramBelongsToProgram($studentTrainingProgramId, $programId)) {
            throw new \InvalidArgumentException('Sinh viên không thuộc chương trình đào tạo này.');
        }

        // ✅ CHỈ kiểm tra học kỳ nếu không phải tổng kết chương trình (tức semester_id khác null)
        if (!is_null($semesterId) && !$this->checkSemesterBelongsToProgram($programId, $semesterId)) {
            throw new \InvalidArgumentException('Học kỳ không thuộc chương trình đào tạo.');
        }

        $learningResult = $this->findByStudentAndProgram($studentTrainingProgramId, $programId, $semesterId);

        if (!$learningResult) {
            $learningResult = new LearningResult([
                'student_training_program_id' => $studentTrainingProgramId,
                'program_id' => $programId,
                'semester_id' => $semesterId
            ]);
        }

        $learningResult->average_score = $average;
        $learningResult->gpa = $gpa ?? $this->calculateGPA($studentTrainingProgramId, $programId, $semesterId);
        $learningResult->classification = $this->classify($average);
        $learningResult->completion_status = $average >= 5 ? 'completed' : 'incomplete';

        return $learningResult->save();
    }


    public function calculateAndUpdateAverageScore(
        int $studentTrainingProgramId,
        int $programId,
        ?int $semesterId = null
    ): array {
        // Kiểm tra student_training_program có thuộc program không
        if (!$this->checkStudentTrainingProgramBelongsToProgram($studentTrainingProgramId, $programId)) {
            throw new \InvalidArgumentException('Sinh viên không thuộc chương trình đào tạo này.');
        }

        // Kiểm tra program có semester, nếu có thì semesterId bắt buộc phải truyền
        $programHasSemesters = DB::table('semesters')
            ->where('training_program_id', $programId)
            ->exists();

        if ($programHasSemesters && is_null($semesterId)) {
            throw new \InvalidArgumentException('Bạn phải truyền semester_id vì chương trình này có học kỳ.');
        }

        // Kiểm tra semester có thuộc chương trình hay không
        if (!$this->checkSemesterBelongsToProgram($programId, $semesterId)) {
            throw new \InvalidArgumentException('Học kỳ không thuộc chương trình đào tạo.');
        }

        // Tính điểm trung bình, GPA, phân loại
        $average = $this->calculateAverageScore($studentTrainingProgramId, $programId, $semesterId);
        $gpa = $this->calculateGPA($studentTrainingProgramId, $programId, $semesterId);
        $classification = $this->classify($average);

        // Cập nhật vào csdl
        $this->updateLearningResult(
            $studentTrainingProgramId,
            $programId,
            $semesterId,
            $average,
            $gpa
        );

        return [
            'average_score' => $average,
            'gpa' => $gpa,
            'classification' => $classification,
        ];
    }

    public function getByProgram(int $programId, ?int $semesterId = null, array $filters = [])
    {
        $query = LearningResult::where('program_id', $programId);

        if (!is_null($semesterId)) {
            if (!$this->checkSemesterBelongsToProgram($programId, $semesterId)) {
                throw new \InvalidArgumentException('Học kỳ không thuộc chương trình đào tạo.');
            }
            $query->where('semester_id', $semesterId);
        }

        if (isset($filters['classification'])) {
            $query->where('classification', $filters['classification']);
        }

        if (isset($filters['completion_status'])) {
            $query->where('completion_status', $filters['completion_status']);
        }

        return $query->get();
    }

    public function recalculateAllForProgram(int $programId, ?int $semesterId = null): void
    {
        if (!is_null($semesterId) && !$this->checkSemesterBelongsToProgram($programId, $semesterId)) {
            throw new \InvalidArgumentException('Học kỳ không thuộc chương trình đào tạo.');
        }

        $studentPrograms = DB::table('student_training_programs')
            ->where('training_program_id', $programId)
            ->pluck('id');

        foreach ($studentPrograms as $studentTrainingProgramId) {
            $this->calculateAndUpdateAverageScore($studentTrainingProgramId, $programId, $semesterId);
        }
    }

    public function classify(float $averageScore): string
    {
        if ($averageScore >= 8)
            return 'excellent';
        if ($averageScore >= 6.5)
            return 'good';
        if ($averageScore >= 5)
            return 'average';
        return 'poor';
    }

    public function getReport(array $criteria = [])
    {
        return $this->getQuery($criteria)->get();
    }

    // ==============================
    // Helper Methods
    // ==============================
    protected function checkSemesterBelongsToProgram(int $programId, ?int $semesterId): bool
    {
        if (is_null($semesterId))
            return true;

        return DB::table('semesters')
            ->where('id', $semesterId)
            ->where('training_program_id', $programId)
            ->exists();
    }

    protected function checkStudentTrainingProgramBelongsToProgram(int $studentTrainingProgramId, int $programId): bool
    {
        return DB::table('student_training_programs')
            ->where('id', $studentTrainingProgramId)
            ->where('training_program_id', $programId)
            ->exists();
    }

    private function convertScoreToGPA(float $score): float
    {
        return match (true) {
            $score >= 9 => 4.0,
            $score >= 8 => 3.5,
            $score >= 7 => 3.0,
            $score >= 6 => 2.5,
            $score >= 5 => 2.0,
            $score >= 4 => 1.0,
            default => 0.0,
        };
    }

    private function getQuery(array $filters = [])
    {
        $query = LearningResult::query();

        if (!empty($filters['student_training_program_id'])) {
            $query->where('student_training_program_id', $filters['student_training_program_id']);
        }

        if (!empty($filters['program_id'])) {
            $query->where('program_id', $filters['program_id']);
        }

        if (!empty($filters['semester_id'])) {
            $query->where('semester_id', $filters['semester_id']);
        }

        if (!empty($filters['classification'])) {
            $query->where('classification', $filters['classification']);
        }

        if (!empty($filters['completion_status'])) {
            $query->where('completion_status', $filters['completion_status']);
        }

        return $query;
    }

    public function getByUserAndProgram(int $userId, int $programId, ?int $semesterId = null): ?array
    {
        // Tìm student_program
        $studentProgram = DB::table('student_training_programs')
            ->where('user_id', $userId)
            ->where('training_program_id', $programId)
            ->first();

        if (!$studentProgram) {
            return null;
        }

        // Nếu chương trình có học kỳ → kiểm tra semester có hợp lệ
        if (!is_null($semesterId)) {
            $valid = DB::table('semesters')
                ->where('id', $semesterId)
                ->where('training_program_id', $programId)
                ->exists();

            if (!$valid) {
                throw new \InvalidArgumentException('Học kỳ không thuộc chương trình.');
            }
        }

        // Lấy kết quả học tập (theo học kỳ hoặc toàn bộ)
        $learningResult = LearningResult::where('student_training_program_id', $studentProgram->id)
            ->where('program_id', $programId)
            ->where('semester_id', $semesterId) // null => tổng kết chương trình
            ->first();

        if (!$learningResult) {
            return null;
        }

        return [
            'student_training_program_id' => $learningResult->student_training_program_id,
            'program_id' => $learningResult->program_id,
            'semester_id' => $learningResult->semester_id,
            'average_score' => $learningResult->average_score,
            'gpa' => $learningResult->gpa,
            'classification' => $learningResult->classification,
            'completion_status' => $learningResult->completion_status,
        ];
    }
    /**
     * Tính và cập nhật tổng kết tích lũy (không phân học kỳ) cho 1 sinh viên trong chương trình
     */
    protected function updateOverallLearningResult(int $studentTrainingProgramId, int $programId): bool
    {
        if (!$this->checkStudentTrainingProgramBelongsToProgram($studentTrainingProgramId, $programId)) {
            throw new \InvalidArgumentException('Sinh viên không thuộc chương trình đào tạo này.');
        }
        // 🟢 Tính và lưu kết quả từng học kỳ
        $semesterIds = DB::table('semesters')
            ->where('training_program_id', $programId)
            ->pluck('id');

        foreach ($semesterIds as $semesterId) {
            // Tính và cập nhật cho học kỳ
            $this->calculateAndUpdateAverageScore($studentTrainingProgramId, $programId, $semesterId);
        }
        // Tính điểm trung bình tích lũy (không phân học kỳ)
        $average = $this->calculateAverageScore($studentTrainingProgramId, $programId, null);
        $gpa = $this->calculateGPA($studentTrainingProgramId, $programId, null);
        $classification = $this->classify($average);

        // Cập nhật vào bảng learning_results với semester_id = null (tổng kết chương trình)
        return $this->updateLearningResult(
            $studentTrainingProgramId,
            $programId,
            null,
            $average,
            $gpa
        );
    }

    /**
     * Tính và cập nhật tổng kết tích lũy cho tất cả sinh viên trong chương trình (không phân học kỳ)
     */
    public function recalculateOverallForProgram(int $programId): void
    {
        $studentPrograms = DB::table('student_training_programs')
            ->where('training_program_id', $programId)
            ->pluck('id');

        foreach ($studentPrograms as $studentTrainingProgramId) {
            $this->updateOverallLearningResult($studentTrainingProgramId, $programId);
        }
    }

    public function getByProgramAndUser(int $programId, int $userId)
    {
        // Lấy tất cả LearningResult của user theo chương trình
        $results = LearningResult::with([
            'studentTrainingProgram.user.profile',
            'program',
            'semester',
        ])
            ->where('program_id', $programId)
            ->whereHas('studentTrainingProgram', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->get();

        return $results->map(function ($lr) {
            $user = $lr->studentTrainingProgram->user;
            $profile = $user->profile;

            // Lọc courseResults theo semester_id của từng LearningResult
            $filteredCourseResults = $lr->courseResults->filter(function ($cr) use ($lr) {
                // Nếu semester_id của LearningResult là null thì lấy courseResults có semester_id null
                if ($lr->semester_id === null) {
                    return $cr->semester_id === null;
                }
                // Nếu không null thì filter đúng semester_id
                return $cr->semester_id === $lr->semester_id;
            });

            return [
                'learning_result_id' => $lr->id,
                'student_code' => $user->name,
                'email' => $user->email,
                'full_name' => trim(($profile->first_name ?? '') . ' ' . ($profile->last_name ?? '')),
                'program' => [
                    'id' => $lr->program->id,
                    'name' => $lr->program->name,
                    'level' => $lr->program->level,
                    'code' => $lr->program->code,
                ],
                'semester' => $lr->semester ? [
                    'id' => $lr->semester->id,
                    'name' => $lr->semester->name,
                ] : null,
                'average_score' => $lr->average_score,
                'gpa' => $lr->gpa,
                'classification' => $lr->classification,
                'completion_status' => $lr->completion_status,

            ];
        });
    }


}