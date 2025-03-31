<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollments';

    protected $fillable = [
        'classroom_id',
        'user_id',
        'status'
    ];

    protected $casts = [
        'status' => 'string'
    ];

    // Một ghi danh thuộc về một lớp học
    public function classroom()
    {
        return $this->belongsTo(ClassRoom::class, 'classroom_id');
    }


    // Một ghi danh thuộc về một học viên (user)
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}