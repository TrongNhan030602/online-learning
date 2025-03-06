<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $table = 'courses';
    protected $fillable = [
        'title',
        'description',
        'price',
    ];

    /**
     * Mối quan hệ 1 - N: Một khóa học có nhiều bài học
     */
    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    /**
     * Mối quan hệ N - N: Một khóa học có nhiều học viên đăng ký
     */
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'user_id')
            ->withTimestamps();
    }

    /**
     * Mối quan hệ 1 - N: Một khóa học có nhiều đánh giá
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Mối quan hệ 1 - N: Một khóa học có thể thuộc nhiều đơn hàng
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function files()
    {
        return $this->hasMany(CourseFile::class);
    }
}