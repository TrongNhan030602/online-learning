<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseScoreWeight extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'score_type',//'quiz','midterm','final','assignment'
        'weight',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}