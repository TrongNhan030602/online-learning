<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingSlide extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_program_id',
        'image_url',
        'title',
        'description',
        'order',
        'is_active',
    ];

    public function trainingProgram()
    {
        return $this->belongsTo(TrainingProgram::class);
    }
}