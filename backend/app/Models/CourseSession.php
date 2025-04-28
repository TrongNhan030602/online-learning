<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'location',
    ];

    // Mỗi buổi học thuộc về một môn học
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // Mỗi buổi học có thể có nhiều bài học
    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}