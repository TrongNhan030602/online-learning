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
        'image_url'
    ];
    public function files()
    {
        return $this->hasMany(CourseFile::class);
    }
    public function trainingPrograms()
    {
        return $this->hasMany(TrainingProgram::class);
    }
    /**
     * Mối quan hệ 1 - N: Một khóa học có nhiều bài học
     */
    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    // Một khóa học có nhiều lớp học
    public function classRooms()
    {
        return $this->hasMany(ClassRoom::class);
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


}