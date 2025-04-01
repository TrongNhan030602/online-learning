<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_session_id',
        'user_id',
        'status',
        'note'
    ];

    // Một bản ghi điểm danh thuộc về một buổi học
    public function session()
    {
        return $this->belongsTo(ClassSession::class, 'class_session_id');
    }

    // Một bản ghi điểm danh thuộc về một học viên
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}