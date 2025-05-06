<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingProgramBanner extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_program_id',
        'title',
        'image_url',
        'description',
    ];

    public function trainingProgram()
    {
        return $this->belongsTo(TrainingProgram::class);
    }
}