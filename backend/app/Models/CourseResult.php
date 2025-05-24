<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourseResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_training_program_id',
        'course_id',
        'semester_id',
        'average_score',
        'classification',
    ];

    // Quan hệ
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