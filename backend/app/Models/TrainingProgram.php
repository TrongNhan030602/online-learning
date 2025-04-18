<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingProgram extends Model
{
    use HasFactory;

    protected $table = 'training_programs';
    protected $fillable = [
        'course_id',
        'name',
        'description',
        'duration',
        'requirements',
        'objectives'
    ];

    // Quan hệ 1 - 1: Mỗi chương trình đào tạo thuộc một khóa học
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function slides()
    {
        return $this->hasMany(LandingSlide::class);
    }


}