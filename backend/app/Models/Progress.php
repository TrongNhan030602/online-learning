<?php

namespace App\Models;

use App\Enums\ProgressStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Progress extends Model
{
    use HasFactory;

    protected $table = 'progress'; // Xác định bảng đúng

    protected $fillable = [
        'user_id',
        'course_id',
        'lesson_id',
        'completed',
        'completed_at',
        'status',
        'last_accessed_at',
    ];

    public $timestamps = true; // Không sử dụng created_at, updated_at
    protected $casts = [
        'completed' => 'boolean', // Ép kiểu thành boolean
        'completed_at' => 'datetime',
        'status' => ProgressStatus::class,
    ];
    // Mối quan hệ với User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Mối quan hệ với Lesson
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    // Mối quan hệ với Course
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}