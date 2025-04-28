<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'level',
        'advisor_id',
        'note',
    ];

    // Một chương trình đào tạo có một cố vấn (advisor)
    public function advisor()
    {
        // TrainingProgram thuộc về User (cố vấn), một cố vấn có thể chỉ dẫn nhiều chương trình
        return $this->belongsTo(User::class, 'advisor_id');
    }

    // Một chương trình đào tạo có thể có nhiều học kỳ (semesters)
    public function semesters()
    {
        // Chương trình đào tạo có thể có nhiều học kỳ
        return $this->hasMany(Semester::class);
    }

    // Một chương trình đào tạo có thể có nhiều môn học (qua bảng ProgramCourse)
    public function programCourses()
    {
        // TrainingProgram và Course liên kết với nhau qua bảng ProgramCourse
        return $this->hasMany(ProgramCourse::class);
    }

    // Sinh viên có thể đăng ký nhiều chương trình đào tạo
    public function students()
    {
        // Mối quan hệ nhiều-nhiều giữa TrainingProgram và User (học viên)
        return $this->belongsToMany(User::class, 'student_training_programs', 'training_program_id', 'student_id');
    }
    public function learningResults()
    {
        return $this->hasMany(LearningResult::class, 'program_id');
    }

}