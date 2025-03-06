<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'completed',
        'completed_at',
    ];

    /**
     * Mối quan hệ N - 1: Tiến độ thuộc về một người dùng
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mối quan hệ N - 1: Tiến độ thuộc về một bài học
     */
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}