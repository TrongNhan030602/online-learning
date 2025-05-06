<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'title',
        'description',
        'is_active',
        'credits',
        'total_hours',
        'theory_hours',
        'practice_hours',
        'exam_hours'
    ];

    // Môn học có thể thuộc nhiều học kỳ
    public function semesters()
    {
        // Nhiều môn học có thể có mặt trong nhiều học kỳ, thông qua bảng trung gian 'semester_courses'
        return $this->belongsToMany(Semester::class, 'semester_courses');
    }

    // Môn học có thể thuộc nhiều chương trình đào tạo (training programs)
    public function trainingPrograms()
    {
        // Nhiều môn học có thể xuất hiện trong nhiều chương trình đào tạo, thông qua bảng trung gian 'program_courses'
        return $this->belongsToMany(TrainingProgram::class, 'program_courses');
    }

    // Môn học có thể có nhiều điểm số (scores)
    public function scores()
    {
        // Mỗi môn học có thể có nhiều điểm số cho sinh viên
        return $this->hasMany(Score::class);
    }
    // 
    public function reExamRegistrations()
    {
        return $this->hasMany(ReExamRegistration::class, 'course_id');
    }

    public function courseSessions()
    {
        return $this->hasMany(CourseSession::class);
    }
}