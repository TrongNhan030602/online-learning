<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\RoleEnum;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $table = "users";
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];
    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'user_id');
    }
    // Sinh viên có thể đăng ký nhiều chương trình đào tạo
    public function trainingPrograms()
    {
        // Mối quan hệ nhiều-nhiều giữa User (học viên) và TrainingProgram (chương trình đào tạo)
        return $this->belongsToMany(TrainingProgram::class, 'student_training_programs', 'student_id', 'training_program_id');
    }

    // Sinh viên có thể có nhiều môn học được miễn khi liên thông
    public function exemptCourses()
    {
        // Mỗi sinh viên có thể có nhiều môn học được miễn, thông qua bảng ExemptCourse
        return $this->hasMany(ExemptCourse::class, 'student_id');
    }

    // Sinh viên có thể có nhiều điểm số (scores)
    public function scores()
    {
        // Mỗi sinh viên có thể có nhiều điểm số cho các môn học
        return $this->hasMany(Score::class, 'student_id');
    }

    // Sinh viên có thể có nhiều chứng chỉ/bằng
    public function certificates()
    {
        // Mỗi sinh viên có thể có nhiều chứng chỉ
        return $this->hasMany(Certificate::class, 'student_id');
    }
    public function reExamRegistrations()
    {
        return $this->hasMany(ReExamRegistration::class, 'student_id');
    }
    public function learningResults()
    {
        return $this->hasMany(LearningResult::class, 'student_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function is_admin()
    {
        return $this->role === RoleEnum::Admin->value;  // Dùng .value để lấy giá trị của Enum
    }
    public function is_student()
    {
        return $this->role === RoleEnum::Student->value;
    }

    public function is_advisor()
    {
        return $this->role === RoleEnum::Advisor->value;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => RoleEnum::class,

        ];
    }
    /**
     * Get the identifier that will be stored in the JWT token.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }


    // Sử dụng model event để xóa các dữ liệu liên quan khi xóa user
    protected static function booted()
    {
        static::deleting(function ($user) {
            // Xóa enrollments, reviews, progress liên quan
            $user->enrollments()->delete();
            $user->reviews()->delete();
            $user->progress()->delete();
        });
    }
}