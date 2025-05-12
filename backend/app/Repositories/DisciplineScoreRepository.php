<?php

namespace App\Repositories;

use App\Models\Semester;
use App\Models\DisciplineScore;
use App\Models\StudentTrainingProgram;
use App\Interfaces\DisciplineScoreInterface;
use Exception;
class DisciplineScoreRepository implements DisciplineScoreInterface
{
    public function getAll()
    {
        return DisciplineScore::with([
            'studentTrainingProgram.user',
            'semester',
            'semester.trainingProgram'
        ])->get();
    }

    public function getById($id)
    {
        return DisciplineScore::with([
            'studentTrainingProgram.user',
            'semester'
        ])->findOrFail($id);
    }

    public function create(array $data)
    {
        $studentTrainingProgramId = $data['student_training_program_id'];
        $semesterId = $data['semester_id'];

        // Lấy thông tin về chương trình đào tạo và học kỳ
        $studentTrainingProgram = StudentTrainingProgram::findOrFail($studentTrainingProgramId);
        $semester = Semester::findOrFail($semesterId);

        // Kiểm tra nếu chương trình đào tạo của sinh viên và học kỳ thuộc về cùng một chương trình đào tạo
        if ($studentTrainingProgram->training_program_id != $semester->training_program_id) {
            throw new \Exception('Sinh viên không thuộc chương trình đào tạo có học kỳ này.');
        }

        // Kiểm tra nếu đã có điểm rèn luyện cho học kỳ này
        $alreadyExists = DisciplineScore::where('student_training_program_id', $studentTrainingProgramId)
            ->where('semester_id', $semesterId)
            ->exists();

        if ($alreadyExists) {
            throw new \Exception('Sinh viên đã có điểm rèn luyện cho học kỳ này.');
        }

        // Nếu không có trùng lặp, tạo mới điểm rèn luyện
        return DisciplineScore::create($data);
    }


    public function update($id, array $data)
    {
        $disciplineScore = DisciplineScore::findOrFail($id);
        $disciplineScore->update($data);
        return $disciplineScore;
    }

    public function delete($id)
    {
        $disciplineScore = DisciplineScore::findOrFail($id);
        return $disciplineScore->delete();
    }

    public function getByStudent($userId)
    {
        try {
            // Lấy tất cả các chương trình đào tạo của người dùng (cập nhật từ student_id → user_id)
            $studentTrainingPrograms = StudentTrainingProgram::with([
                'disciplineScores.semester',
                'disciplineScores.semester.trainingProgram'
            ])
                ->where('user_id', $userId)
                ->get();

            // Tạo danh sách điểm rèn luyện từ tất cả các chương trình đào tạo
            $disciplineScores = $studentTrainingPrograms->flatMap(function ($program) {
                return $program->disciplineScores->map(function ($score) use ($program) {
                    // Mỗi điểm rèn luyện sẽ có đầy đủ thông tin về tên chương trình, học kỳ, điểm và xếp loại
                    return [
                        'program_name' => $program->trainingProgram->name, // Tên chương trình đào tạo
                        'program_code' => $program->trainingProgram->code, // Mã chương trình đào tạo
                        'semester_name' => $score->semester->name, // Tên học kỳ
                        'score' => $score->score, // Điểm
                        'evaluation' => $score->evaluation, // Xếp loại
                        'semester_order' => (int) filter_var($score->semester->name, FILTER_SANITIZE_NUMBER_INT) // Thứ tự học kỳ
                    ];
                });
            });

            // Nhóm kết quả theo tên và mã chương trình đào tạo
            $groupedResults = $disciplineScores->groupBy(function ($item) {
                return $item['program_name'] . ' - ' . $item['program_code']; // Nhóm theo tên và mã chương trình đào tạo
            });

            // Sắp xếp các học kỳ trong mỗi nhóm theo thứ tự học kỳ
            $groupedResults = $groupedResults->map(function ($group) {
                return $group->sortBy('semester_order'); // Sắp xếp theo học kỳ
            });

            // Chuyển đổi kết quả thành định dạng phù hợp với frontend
            $formattedResults = $groupedResults->map(function ($group) {
                return $group->map(function ($item) {
                    return [
                        'semester' => $item['semester_name'], // Tên học kỳ
                        'totalScore' => $item['score'], // Tổng điểm
                        'rank' => $item['evaluation'], // Xếp loại
                    ];
                });
            });

            return $formattedResults;
        } catch (Exception $e) {
            // Xử lý lỗi nếu có
            throw new Exception('Lỗi khi lấy điểm rèn luyện: ' . $e->getMessage());
        }
    }


}