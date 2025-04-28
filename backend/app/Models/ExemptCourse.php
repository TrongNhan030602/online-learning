<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExemptCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'course_id',
        'from_program_id',
        'to_program_id',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function fromProgram()
    {
        return $this->belongsTo(TrainingProgram::class, 'from_program_id');
    }

    public function toProgram()
    {
        return $this->belongsTo(TrainingProgram::class, 'to_program_id');
    }
}