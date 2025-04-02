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
        'order',
    ];
    /**
     * Mối quan hệ với bảng LessonDocuments.
     */
    public function documents()
    {
        return $this->hasMany(LessonDocument::class, 'lesson_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function progress()
    {
        return $this->hasMany(Progress::class);
    }

    // Quan hệ many-to-many: Bài học chọn các tài liệu từ khóa học
    public function selectedFiles()
    {
        return $this->belongsToMany(CourseFile::class, 'course_file_lesson', 'lesson_id', 'course_file_id')
            ->withTimestamps();
    }
}