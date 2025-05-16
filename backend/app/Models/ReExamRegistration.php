<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReExamRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'student_training_program_id',
        'course_id',
        'exam_schedule_id',
        'registration_date',
        'reason',
        'status',//'pending', 'approved', 'rejected'
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function studentTrainingProgram()
    {
        return $this->belongsTo(StudentTrainingProgram::class, 'student_training_program_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function examSchedule()
    {
        return $this->belongsTo(ExamSchedule::class, 'exam_schedule_id');
    }
}