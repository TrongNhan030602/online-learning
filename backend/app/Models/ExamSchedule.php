<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'exam_date',
        'exam_time',
        'room',
        'exam_date_second',
        'exam_time_second',
        'exam_type',
        'duration_minutes',
        'location',
        'exam_term',
        'note',
        'program_id',
    ];

    public function program()
    {
        return $this->belongsTo(TrainingProgram::class, 'program_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}