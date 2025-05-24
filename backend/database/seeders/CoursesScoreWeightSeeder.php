<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CourseScoreWeight;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CoursesScoreWeightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courseIds = [2, 3, 4];

        foreach ($courseIds as $courseId) {
            CourseScoreWeight::insert([
                ['course_id' => $courseId, 'score_type' => 'quiz', 'weight' => 0.1],
                ['course_id' => $courseId, 'score_type' => 'midterm', 'weight' => 0.3],
                ['course_id' => $courseId, 'score_type' => 'final', 'weight' => 0.5],
                ['course_id' => $courseId, 'score_type' => 'assignment', 'weight' => 0.1],
            ]);
        }
    }
}