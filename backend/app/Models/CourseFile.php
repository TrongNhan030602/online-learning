<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'type',
        'file_path',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}