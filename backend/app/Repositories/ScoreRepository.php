<?php

namespace App\Repositories;

use App\Models\Score;
use App\Models\Semester;
use App\Models\CourseResult;
use App\Models\ProgramCourse;
use App\Models\SemesterCourse;
use App\Models\TrainingProgram;
use App\Models\StudentTrainingProgram;
use App\Interfaces\ScoreRepositoryInterface;

class ScoreRepository implements ScoreRepositoryInterface
{
    public function getAllWithRelations($filters = [])
    {
        return Score::with([
            'user:id,name,email',
            'course:id,code,title',
            'semester:id,name',
            'studentTrainingProgram.trainingProgram:id,code,name'
        ])
            ->when(isset($filters['user_id']), fn($q) => $q->where('user_id', $filters['user_id']))
            ->when(isset($filters['course_id']), fn($q) => $q->where('course_id', $filters['course_id']))
            ->when(isset($filters['semester_id']), fn($q) => $q->where('semester_id', $filters['semester_id']))
            ->when(isset($filters['score_type']), fn($q) => $q->where('score_type', $filters['score_type']))
            ->when(isset($filters['is_accepted']), fn($q) => $q->where('is_accepted', $filters['is_accepted']))
            ->orderBy('created_at', 'desc')
            ->get();
    }

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
            $semesterBelongsToProgram = Semester::where('id', $data['semester_id'])
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
        // Kiểm tra điểm đã tồn tại chưa
        $exists = Score::where('student_training_program_id', $data['student_training_program_id'])
            ->where('course_id', $data['course_id'])
            ->where('score_type', $data['score_type'])
            ->where('attempt', $data['attempt'] ?? 1)
            ->when(!empty($data['semester_id']), function ($query) use ($data) {
                $query->where('semester_id', $data['semester_id']);
            })
            ->when(empty($data['semester_id']), function ($query) {
                $query->whereNull('semester_id');
            })
            ->exists();

        if ($exists) {
            throw new \Exception('Điểm đã tồn tại cho môn học, loại điểm và lần thi này đã có.');
        }
        // Nếu không có attempt thì gán mặc định = 1
        $data['attempt'] = $data['attempt'] ?? 1;
        $score = Score::create($data);

        // Tự động tính lại kết quả môn học sau khi thêm điểm
        $this->recalculateCourseResult(
            $data['student_training_program_id'],
            $data['course_id'],
            $data['semester_id'],
            $data['attempt']
        );

        return $score;

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
            $semesterBelongsToProgram = Semester::where('id', $data['semester_id'])
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
        // Kiểm tra điểm đã tồn tại chưa
        $exists = Score::where('student_training_program_id', $data['student_training_program_id'])
            ->where('course_id', $data['course_id'])
            ->where('score_type', $data['score_type'])
            ->where('attempt', $data['attempt'] ?? 1)
            ->when(!empty($data['semester_id']), function ($query) use ($data) {
                $query->where('semester_id', $data['semester_id']);
            })
            ->when(empty($data['semester_id']), function ($query) {
                $query->whereNull('semester_id');
            })
            ->where('id', '<>', $id)  // <-- loại trừ bản ghi hiện tại
            ->exists();

        if ($exists) {
            throw new \Exception('Điểm đã tồn tại cho môn học, loại điểm và lần thi này đã có.');
        }
        // Nếu không có attempt thì gán mặc định = 1
        $data['attempt'] = $data['attempt'] ?? 1;
        $score->update($data);

        // Tự động tính lại kết quả môn học sau khi cập nhật điểm
        $this->recalculateCourseResult(
            $data['student_training_program_id'],
            $data['course_id'],
            $data['semester_id'],
            $data['attempt']
        );

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
    public function delete($id)
    {
        $score = Score::findOrFail($id);
        return $score->delete();
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

    public function saveBulkScoresAndCalculateResults(array $bulkScores, int $courseId, ?int $semesterId = null, int $attempt = 1)
    {
        \DB::beginTransaction();

        try {
            foreach ($bulkScores as $scoreData) {
                $userId = $scoreData['user_id'];
                $studentTrainingProgramId = $scoreData['student_training_program_id'];
                $scores = $scoreData['scores'];

                // Lấy chương trình học viên để kiểm tra hợp lệ
                $studentProgram = StudentTrainingProgram::with('trainingProgram')->findOrFail($studentTrainingProgramId);
                $trainingProgram = $studentProgram->trainingProgram;

                // Kiểm tra môn học có thuộc chương trình hay không (giống create/update)
                $courseValid = false;
                if (in_array($trainingProgram->level, ['college', 'intermediate'])) {
                    $courseValid = SemesterCourse::whereHas('semester', function ($q) use ($trainingProgram) {
                        $q->where('training_program_id', $trainingProgram->id);
                    })->where('course_id', $courseId)->exists();
                } else {
                    $courseValid = ProgramCourse::where('training_program_id', $trainingProgram->id)
                        ->where('course_id', $courseId)->exists();
                }

                if (!$courseValid) {
                    throw new \Exception("Môn học không thuộc chương trình đào tạo của học viên user_id={$userId}.");
                }

                if (!empty($semesterId) && in_array($trainingProgram->level, ['college', 'intermediate'])) {
                    $semesterBelongsToProgram = Semester::where('id', $semesterId)
                        ->where('training_program_id', $trainingProgram->id)
                        ->exists();

                    if (!$semesterBelongsToProgram) {
                        throw new \Exception("Học kỳ không thuộc chương trình đào tạo của học viên user_id={$userId}.");
                    }
                }

                if (!in_array($trainingProgram->level, ['college', 'intermediate'])) {
                    $semesterId = null; // Xóa semester nếu không thuộc kiểu có học kỳ
                }

                // Lưu hoặc cập nhật điểm từng loại (score_type)
                foreach ($scores as $scoreType => $value) {
                    $existingScore = Score::where('student_training_program_id', $studentTrainingProgramId)
                        ->where('course_id', $courseId)
                        ->where('score_type', $scoreType)
                        ->where('attempt', $attempt)
                        ->when($semesterId, fn($q) => $q->where('semester_id', $semesterId))
                        ->when(!$semesterId, fn($q) => $q->whereNull('semester_id'))
                        ->first();

                    $data = [
                        'user_id' => $userId,
                        'student_training_program_id' => $studentTrainingProgramId,
                        'course_id' => $courseId,
                        'semester_id' => $semesterId,
                        'score_type' => $scoreType,
                        'value' => $value,
                        'attempt' => $attempt,
                        'is_accepted' => true,
                    ];

                    if ($existingScore) {
                        $existingScore->update($data);
                    } else {
                        Score::create($data);
                    }
                }

                // Lấy lại điểm đã lưu để tính trung bình theo công thức mới
                $acceptedScores = Score::where('student_training_program_id', $studentTrainingProgramId)
                    ->where('course_id', $courseId)
                    ->where('attempt', $attempt)
                    ->where('is_accepted', true)
                    ->when($semesterId, fn($q) => $q->where('semester_id', $semesterId))
                    ->when(!$semesterId, fn($q) => $q->whereNull('semester_id'))
                    ->get();

                // Lấy riêng từng loại điểm
                $quizScore = $acceptedScores->firstWhere('score_type', 'quiz')->value ?? 0;
                $midtermScore = $acceptedScores->firstWhere('score_type', 'midterm')->value ?? 0;
                $finalScore = $acceptedScores->firstWhere('score_type', 'final')->value ?? 0;

                // Tính điểm theo công thức của bạn
                $processScore = (($quizScore * 1 + $midtermScore * 2) / 3) * 0.4;
                $finalWeighted = $finalScore * 0.6;
                $average = $processScore + $finalWeighted;

                // Phân loại điểm
                $classification = $this->classifyScore($average);

                // Lưu hoặc cập nhật CourseResult
                CourseResult::updateOrCreate(
                    [
                        'student_training_program_id' => $studentTrainingProgramId,
                        'course_id' => $courseId,
                        'semester_id' => $semesterId,
                    ],
                    [
                        'average_score' => $average,
                        'classification' => $classification,
                    ]
                );
            }

            \DB::commit();
            return true;
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }
    }

    public function getScoresByCourseAndProgram(int $trainingProgramId, int $courseId, ?int $semesterId = null, int $attempt = 1)
    {
        // Lấy chương trình đào tạo để kiểm tra có học kỳ hay không
        $trainingProgram = TrainingProgram::findOrFail($trainingProgramId);

        // Lấy danh sách student_training_program thuộc chương trình này
        $studentPrograms = StudentTrainingProgram::where('training_program_id', $trainingProgramId)->pluck('id');

        $query = Score::whereIn('student_training_program_id', $studentPrograms)
            ->where('course_id', $courseId)
            ->where('attempt', $attempt)
            ->where('is_accepted', true);

        // Nếu chương trình có học kỳ (college, intermediate) thì dùng semesterId
        if (in_array($trainingProgram->level, ['college', 'intermediate'])) {
            if ($semesterId !== null) {
                $query->where('semester_id', $semesterId);
            } else {
                // Nếu ko truyền semesterId, lấy hết các semester thuộc chương trình
                $semesterIds = Semester::where('training_program_id', $trainingProgramId)->pluck('id');
                $query->whereIn('semester_id', $semesterIds);
            }
        } else {
            // Chương trình ko có học kỳ thì semester_id phải null
            $query->whereNull('semester_id');
        }

        return $query->with([
            'user:id,name,email',
            'studentTrainingProgram.trainingProgram:id,code,name,level',
            'semester:id,name',
            'course:id,code,title'
        ])->get();
    }


    /**
     * Phân loại điểm, bạn có thể điều chỉnh theo chuẩn của bạn
     */
    private function classifyScore(float $averageScore): string
    {
        if ($averageScore >= 8.5) {
            return 'Excellent';
        } elseif ($averageScore >= 7) {
            return 'Good';
        } elseif ($averageScore >= 5) {
            return 'Average';
        }
        return 'Poor';
    }
    private function recalculateCourseResult($studentTrainingProgramId, $courseId, $semesterId, $attempt = 1)
    {
        $scores = Score::where('student_training_program_id', $studentTrainingProgramId)
            ->where('course_id', $courseId)
            ->where('attempt', $attempt)
            ->where('is_accepted', true)
            ->when($semesterId, fn($q) => $q->where('semester_id', $semesterId))
            ->when(!$semesterId, fn($q) => $q->whereNull('semester_id'))
            ->get();

        $quizScore = $scores->firstWhere('score_type', 'quiz')->value ?? 0;
        $midtermScore = $scores->firstWhere('score_type', 'midterm')->value ?? 0;
        $finalScore = $scores->firstWhere('score_type', 'final')->value ?? 0;

        $processScore = (($quizScore * 1 + $midtermScore * 2) / 3) * 0.4;
        $finalWeighted = $finalScore * 0.6;
        $average = $processScore + $finalWeighted;

        $classification = $this->classifyScore($average);

        CourseResult::updateOrCreate(
            [
                'student_training_program_id' => $studentTrainingProgramId,
                'course_id' => $courseId,
                'semester_id' => $semesterId,
            ],
            [
                'average_score' => $average,
                'classification' => $classification,
            ]
        );
    }

}