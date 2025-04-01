<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClassRoom extends Model
{
    use HasFactory;

    protected $table = "class_rooms";

    protected $fillable = [
        'course_id',
        'name',
        'start_date',
        'end_date',
        'status',
        'max_students',
        'current_students'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // ✅ Một lớp học thuộc về một khóa học
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // ✅ Một lớp học có nhiều buổi học
    public function sessions()
    {
        return $this->hasMany(ClassSession::class, 'classroom_id');
    }

    // ✅ Một lớp học có nhiều học viên ghi danh (Enrollment)
    // Model ClassRoom
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'classroom_id');
    }



    // ✅ Lấy danh sách học viên từ bảng `users` thông qua bảng `enrollments`
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'classroom_id', 'user_id')
            ->withTimestamps();
    }

    // ✅ Một lớp học có nhiều bản ghi điểm danh thông qua buổi học
    public function attendances()
    {
        return $this->hasManyThrough(Attendance::class, ClassSession::class);
    }
}