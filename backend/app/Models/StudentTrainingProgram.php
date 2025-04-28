<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentTrainingProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'training_program_id',
        'entry_type',
        'from_program_id',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function trainingProgram()
    {
        return $this->belongsTo(TrainingProgram::class);
    }

    public function fromProgram()
    {
        return $this->belongsTo(TrainingProgram::class, 'from_program_id');
    }
}