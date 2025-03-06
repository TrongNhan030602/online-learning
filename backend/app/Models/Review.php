<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'rating',
        'comment',
    ];

    /**
     * Mối quan hệ N - 1: Đánh giá thuộc về một học viên
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mối quan hệ N - 1: Đánh giá thuộc về một khóa học
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}