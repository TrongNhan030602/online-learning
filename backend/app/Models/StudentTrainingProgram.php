<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentTrainingProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'training_program_id',
        'entry_type',
        'from_program_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function disciplineScores()
    {
        return $this->hasMany(DisciplineScore::class);
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