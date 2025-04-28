<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'description',
        'type',        // kiểu tài liệu: video, file, link
        'file_path',   // đường dẫn file hoặc URL
    ];

    // Mỗi tài liệu thuộc về một bài học
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}