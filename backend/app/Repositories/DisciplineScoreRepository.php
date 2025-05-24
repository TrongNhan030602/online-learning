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
            $studentTrainingPrograms = StudentTrainingProgram::with([
                'disciplineScores.semester',
                'disciplineScores.semester.trainingProgram'
            ])
                ->where('user_id', $userId)
                ->get();

            $disciplineScores = $studentTrainingPrograms->flatMap(function ($program) {
                return $program->disciplineScores->map(function ($score) use ($program) {
                    return [
                        'program_name' => $program->trainingProgram->name,
                        'program_code' => $program->trainingProgram->code,
                        'semester_name' => $score->semester->name,
                        'score' => $score->score,
                        'evaluation' => $score->evaluation,
                        'semester_order' => (int) filter_var($score->semester->name, FILTER_SANITIZE_NUMBER_INT)
                    ];
                });
            });

            $groupedResults = $disciplineScores->groupBy(function ($item) {
                return $item['program_name'] . ' - ' . $item['program_code'];
            });

            $groupedResults = $groupedResults->map(function ($group) {
                return $group->sortBy('semester_order');
            });

            $formattedResults = $groupedResults->map(function ($group) {
                $data = $group->map(function ($item) {
                    return [
                        'semester' => $item['semester_name'],
                        'totalScore' => $item['score'],
                        'rank' => $item['evaluation'],
                    ];
                });

                $average = $group->avg('score');

                return [
                    'averageScore' => round($average, 2),
                    'overallRank' => $this->getDisciplineRank($average),
                    'semesters' => $data
                ];
            });

            return $formattedResults;

        } catch (Exception $e) {
            throw new Exception('Lỗi khi lấy điểm rèn luyện: ' . $e->getMessage());
        }
    }

    /**
     * Xếp loại theo điểm rèn luyện trung bình toàn khóa
     */
    private function getDisciplineRank($average)
    {
        if ($average >= 90)
            return 'Xuất sắc';
        if ($average >= 80)
            return 'Tốt';
        if ($average >= 65)
            return 'Khá';
        if ($average >= 50)
            return 'Trung bình';
        return 'Yếu';
    }




}