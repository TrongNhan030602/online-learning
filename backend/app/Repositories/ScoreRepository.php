<?php

namespace App\Repositories;

use App\Models\Score;
use App\Interfaces\ScoreRepositoryInterface;

class ScoreRepository implements ScoreRepositoryInterface
{
    public function create(array $data)
    {
        return Score::create($data);
    }

    public function update($id, array $data)
    {
        $score = Score::findOrFail($id);
        $score->update($data);
        return $score;
    }

    public function getByStudent($studentId)
    {
        return Score::where('student_id', $studentId)->with('course')->get();
    }

    public function getByCourse($courseId)
    {
        return Score::where('course_id', $courseId)->with('student')->get();
    }

    public function getByStudentAndSemester($studentId, $semesterId)
    {
        return Score::where('student_id', $studentId)
            ->whereHas('course', function ($query) use ($semesterId) {
                $query->where('semester_id', $semesterId);
            })
            ->with('course')
            ->get();
    }

    public function getById($id)
    {
        return Score::findOrFail($id);
    }
}