<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = ['course_session_id', 'title', 'content'];

    // Mỗi bài học thuộc về một buổi học
    public function courseSession()
    {
        return $this->belongsTo(CourseSession::class);
    }

    // Mỗi bài học có thể có nhiều tài liệu
    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}