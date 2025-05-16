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
        'program_level',
        'semester_id',
        'average_score',
        'classification',//'excellent', 'good', 'average', 'poor'
        'completion_status',//'completed', 'incomplete'
        'notes',
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
}