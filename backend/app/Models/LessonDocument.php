<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LessonDocument extends Model
{
    use HasFactory;
    protected $table = 'lesson_documents';

    protected $fillable = ['lesson_id', 'file_path', 'file_type'];

    /**
     * Mối quan hệ với bảng Lesson.
     */
    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id'); // Khóa ngoại 'lesson_id' trong bảng 'lesson_documents'
    }
}