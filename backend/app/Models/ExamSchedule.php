<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'semester_id',
        'training_program_id',

        'exam_type', //'midterm','final'
        'exam_date',
        'start_time',
        'end_time',
        'duration_minutes',

        'retake_exam_date',
        'retake_start_time',
        'retake_end_time',

        'location',
        'note',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function trainingProgram()
    {
        return $this->belongsTo(TrainingProgram::class);
    }
    public function reExamRegistrations()
    {
        return $this->hasMany(ReExamRegistration::class);
    }
}