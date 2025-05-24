<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_training_program_id',
        'program_id',
        'semester_id', // Nullable
        'average_score',
        'gpa',
        'classification',//'excellent', 'good', 'average', 'poor'
        'completion_status',//'completed', 'incomplete'
    ];

    // Quan hệ đến học viên trong chương trình
    public function studentTrainingProgram()
    {
        return $this->belongsTo(StudentTrainingProgram::class, 'student_training_program_id');
    }

    // Quan hệ đến chương trình đào tạo
    public function program()
    {
        return $this->belongsTo(TrainingProgram::class, 'program_id');
    }

    // Quan hệ đến học kỳ (nullable)
    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    // Lấy tất cả course results theo học kỳ hoặc toàn bộ nếu semester_id null
    public function courseResults()
    {
        return $this->hasMany(CourseResult::class, 'student_training_program_id', 'student_training_program_id')
            ->when($this->semester_id === null, function ($query) {
                $query->whereNull('semester_id');
            }, function ($query) {
                $query->where('semester_id', $this->semester_id);
            });
    }
}