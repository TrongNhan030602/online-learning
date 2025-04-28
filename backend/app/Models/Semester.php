<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;

    protected $fillable = ['training_program_id', 'name'];

    // Mỗi học kỳ thuộc về một chương trình đào tạo
    public function trainingProgram()
    {
        // Semester thuộc về TrainingProgram (chương trình đào tạo)
        return $this->belongsTo(TrainingProgram::class);
    }

    // Mỗi học kỳ có thể có nhiều môn học (courses)
    public function courses()
    {
        // Nhiều học kỳ có thể chứa nhiều môn học, thông qua bảng trung gian 'semester_courses'
        return $this->belongsToMany(Course::class, 'semester_courses');
    }
}