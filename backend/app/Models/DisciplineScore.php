<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisciplineScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_training_program_id',  // Liên kết với chương trình đào tạo của sinh viên
        'semester_id',
        'score',
        'evaluation',
    ];

    public function studentTrainingProgram()
    {
        return $this->belongsTo(StudentTrainingProgram::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}