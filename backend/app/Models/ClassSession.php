<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'classroom_id',
        'title',
        'session_date',
        'start_time',
        'end_time'
    ];

    // Một buổi học thuộc về một lớp học
    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class, 'classroom_id');
    }

    // Một buổi học có nhiều lượt điểm danh
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}