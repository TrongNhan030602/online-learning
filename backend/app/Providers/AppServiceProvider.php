<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\AuthRepositoryInterface;
use App\Repositories\AuthRepository;
use App\Interfaces\CourseRepositoryInterface;
use App\Repositories\CourseRepository;
use App\Interfaces\ReviewRepositoryInterface;
use App\Repositories\ReviewRepository;
use App\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Interfaces\LessonRepositoryInterface;
use App\Repositories\LessonRepository;
use App\Interfaces\ProgressRepositoryInterface;
use App\Repositories\ProgressRepository;
use App\Interfaces\BlogRepositoryInterface;
use App\Repositories\BlogRepository;
use App\Interfaces\BlogCommentRepositoryInterface;
use App\Repositories\BlogCommentRepository;
use App\Interfaces\FaqRepositoryInterface;
use App\Repositories\FaqRepository;
use App\Interfaces\CouponRepositoryInterface;
use App\Repositories\CouponRepository;
use App\Interfaces\OrderRepositoryInterface;
use App\Repositories\OrderRepository;
use App\Interfaces\UserProfileRepositoryInterface;
use App\Repositories\UserProfileRepository;
use App\Interfaces\TrainingProgramRepositoryInterface;
use App\Repositories\TrainingProgramRepository;
use App\Interfaces\ClassRoomRepositoryInterface;
use App\Repositories\ClassRoomRepository;
use App\Interfaces\EnrollmentRepositoryInterface;
use App\Repositories\EnrollmentRepository;
use App\Interfaces\ClassSessionRepositoryInterface;
use App\Repositories\ClassSessionRepository;
use App\Interfaces\AttendanceRepositoryInterface;
use App\Repositories\AttendanceRepository;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(CourseRepositoryInterface::class, CourseRepository::class);
        $this->app->bind(ReviewRepositoryInterface::class, ReviewRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(LessonRepositoryInterface::class, LessonRepository::class);
        $this->app->bind(ProgressRepositoryInterface::class, ProgressRepository::class);
        $this->app->bind(BlogRepositoryInterface::class, BlogRepository::class);
        $this->app->bind(BlogCommentRepositoryInterface::class, BlogCommentRepository::class);
        $this->app->bind(FaqRepositoryInterface::class, FaqRepository::class);
        $this->app->bind(CouponRepositoryInterface::class, CouponRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        $this->app->bind(UserProfileRepositoryInterface::class, UserProfileRepository::class);
        $this->app->bind(TrainingProgramRepositoryInterface::class, TrainingProgramRepository::class);
        $this->app->bind(ClassRoomRepositoryInterface::class, ClassRoomRepository::class);
        $this->app->bind(EnrollmentRepositoryInterface::class, EnrollmentRepository::class);
        $this->app->bind(ClassSessionRepositoryInterface::class, ClassSessionRepository::class);
        $this->app->bind(AttendanceRepositoryInterface::class, AttendanceRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}