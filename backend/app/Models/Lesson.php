<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'content',
        'video_url',
    ];

    /**
     * Mối quan hệ N - 1: Bài học thuộc về một khóa học
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Mối quan hệ 1 - N: Tiến độ học của từng học viên
     */
    public function progress()
    {
        return $this->hasMany(Progress::class);
    }
}