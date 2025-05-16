<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Score extends Model
{
    use HasFactory;

    protected $table = 'scores';

    protected $fillable = [
        'user_id',
        'student_training_program_id',
        'course_id',
        'semester_id',
        'score_type',
        'value',
        'attempt',
        'is_accepted',
    ];

    protected $casts = [
        'value' => 'float',
        'is_accepted' => 'boolean',
    ];


    // Quan hệ

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function studentTrainingProgram()
    {
        return $this->belongsTo(StudentTrainingProgram::class, 'student_training_program_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}