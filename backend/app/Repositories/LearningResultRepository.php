<?php
namespace App\Repositories;

use App\Models\LearningResult;
use App\Interfaces\LearningResultRepositoryInterface;
use Illuminate\Support\Facades\DB;

class LearningResultRepository implements LearningResultRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = LearningResult::query();

        if (isset($filters['student_training_program_id'])) {
            $query->where('student_training_program_id', $filters['student_training_program_id']);
        }

        if (isset($filters['program_id'])) {
            $query->where('program_id', $filters['program_id']);
        }

        if (isset($filters['semester_id'])) {
            $query->where('semester_id', $filters['semester_id']);
        }

        if (isset($filters['classification'])) {
            $query->where('classification', $filters['classification']);
        }

        if (isset($filters['completion_status'])) {
            $query->where('completion_status', $filters['completion_status']);
        }

        return $query->get();
    }

    public function find($id)
    {
        return LearningResult::findOrFail($id);
    }

    public function create(array $data)
    {
        return LearningResult::create($data);
    }

    public function update($id, array $data)
    {
        $learningResult = LearningResult::findOrFail($id);
        $learningResult->update($data);
        return $learningResult;
    }

    public function delete($id)
    {
        $learningResult = LearningResult::findOrFail($id);
        return $learningResult->delete();
    }

    public function findByStudentAndProgram(int $studentTrainingProgramId, int $programId, ?int $semesterId = null)
    {
        $query = LearningResult::where('student_training_program_id', $studentTrainingProgramId)
            ->where('program_id', $programId);

        if (!is_null($semesterId)) {
            $query->where('semester_id', $semesterId);
        } else {
            $query->whereNull('semester_id');
        }

        return $query->first();
    }

    /**
     * Tính điểm trung bình và cập nhật vào bảng learning_results.
     * Logic: Lấy điểm final hoặc điểm trung bình từ bảng scores,
     * rồi cập nhật average_score và classification.
     */
    public function calculateAndUpdateAverageScore(int $studentTrainingProgramId, int $programId, ?int $semesterId = null)
    {
        // Lấy điểm final của học viên trong chương trình (và học kỳ nếu có)
        $query = DB::table('scores')
            ->where('student_training_program_id', $studentTrainingProgramId)
            ->where('course_id', function ($q) use ($programId) {
                // Lấy các course_id thuộc program (nếu cần lọc theo courses)
                // Ở đây giả sử lấy tất cả course trong chương trình
                $q->select('course_id')
                    ->from('program_courses')
                    ->where('training_program_id', $programId);
            })
            ->where('score_type', 'final');

        if ($semesterId !== null) {
            $query->where('semester_id', $semesterId);
        } else {
            $query->whereNull('semester_id');
        }

        $scores = $query->pluck('value');

        if ($scores->isEmpty()) {
            // Không có điểm, xóa hoặc trả về null
            return null;
        }

        $average = round($scores->avg(), 2);

        // Xác định phân loại
        $classification = $this->getClassificationByScore($average);

        // Tìm bản ghi learning_result đã có hoặc tạo mới
        $learningResult = $this->findByStudentAndProgram($studentTrainingProgramId, $programId, $semesterId);

        if (!$learningResult) {
            $learningResult = new LearningResult();
            $learningResult->student_training_program_id = $studentTrainingProgramId;
            $learningResult->program_id = $programId;
            $learningResult->semester_id = $semesterId;
            // Giả sử bạn cần truyền program_level nếu cần
            // $learningResult->program_level = '...';
        }

        $learningResult->average_score = $average;
        $learningResult->classification = $classification;
        $learningResult->completion_status = $average >= 5 ? 'completed' : 'incomplete'; // ví dụ logic
        $learningResult->save();

        return $learningResult;
    }

    /**
     * Quy tắc phân loại điểm
     */
    private function getClassificationByScore(float $score): string
    {
        if ($score >= 8)
            return 'excellent';
        if ($score >= 6.5)
            return 'good';
        if ($score >= 5)
            return 'average';
        return 'poor';
    }

    /**
     * Lấy báo cáo tổng hợp kết quả học tập
     */
    public function getReport(array $criteria = [])
    {
        $query = LearningResult::query();

        if (!empty($criteria['program_id'])) {
            $query->where('program_id', $criteria['program_id']);
        }

        if (!empty($criteria['semester_id'])) {
            $query->where('semester_id', $criteria['semester_id']);
        }

        if (!empty($criteria['classification'])) {
            $query->where('classification', $criteria['classification']);
        }

        if (!empty($criteria['completion_status'])) {
            $query->where('completion_status', $criteria['completion_status']);
        }

        // Thêm các điều kiện lọc khác nếu cần

        return $query->get();
    }
}