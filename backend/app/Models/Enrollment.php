<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
    ];

    public $timestamps = false; // Vì bảng này chỉ có enrolled_at nên không cần timestamps mặc định

    /**
     * Mối quan hệ N - 1: Đăng ký thuộc về một học viên
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mối quan hệ N - 1: Đăng ký thuộc về một khóa học
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}