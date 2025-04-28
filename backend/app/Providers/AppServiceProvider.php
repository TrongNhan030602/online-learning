<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\AuthRepositoryInterface;
use App\Repositories\AuthRepository;
use App\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Interfaces\BlogRepositoryInterface;
use App\Repositories\BlogRepository;
use App\Interfaces\BlogCommentRepositoryInterface;
use App\Repositories\BlogCommentRepository;
use App\Interfaces\FaqRepositoryInterface;
use App\Repositories\FaqRepository;

use App\Interfaces\UserProfileRepositoryInterface;
use App\Repositories\UserProfileRepository;
use App\Interfaces\TrainingProgramRepositoryInterface;
use App\Repositories\TrainingProgramRepository;
use App\Interfaces\SemesterRepositoryInterface;
use App\Repositories\SemesterRepository;
use App\Interfaces\ProgramCourseInterface;
use App\Repositories\ProgramCourseRepository;
use App\Interfaces\CourseRepositoryInterface;
use App\Repositories\CourseRepository;
use App\Interfaces\CourseSessionRepositoryInterface;
use App\Repositories\CourseSessionRepository;
use App\Interfaces\LessonRepositoryInterface;
use App\Repositories\LessonRepository;
use App\Interfaces\MaterialRepositoryInterface;
use App\Repositories\MaterialRepository;
use App\Interfaces\StudentTrainingProgramRepositoryInterface;
use App\Repositories\StudentTrainingProgramRepository;
use App\Interfaces\ExemptCourseRepositoryInterface;
use App\Repositories\ExemptCourseRepository;
use App\Interfaces\ScoreRepositoryInterface;
use App\Repositories\ScoreRepository;
use App\Interfaces\CertificateRepositoryInterface;
use App\Repositories\CertificateRepository;
use App\Interfaces\NotificationRepositoryInterface;
use App\Repositories\NotificationRepository;
use App\Interfaces\ExamScheduleInterface;
use App\Repositories\ExamScheduleRepository;
use App\Interfaces\DisciplineScoreInterface;
use App\Repositories\DisciplineScoreRepository;
use App\Interfaces\LearningResultRepositoryInterface;
use App\Repositories\LearningResultRepository;
use App\Interfaces\ReExamRegistrationRepositoryInterface;
use App\Repositories\ReExamRegistrationRepository;

class AppServiceProvider extends ServiceProvider
{
    /** 
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(BlogRepositoryInterface::class, BlogRepository::class);
        $this->app->bind(BlogCommentRepositoryInterface::class, BlogCommentRepository::class);
        $this->app->bind(FaqRepositoryInterface::class, FaqRepository::class);
        $this->app->bind(UserProfileRepositoryInterface::class, UserProfileRepository::class);
        $this->app->bind(TrainingProgramRepositoryInterface::class, TrainingProgramRepository::class);
        $this->app->bind(SemesterRepositoryInterface::class, SemesterRepository::class);
        $this->app->bind(ProgramCourseInterface::class, ProgramCourseRepository::class);
        $this->app->bind(CourseRepositoryInterface::class, CourseRepository::class);
        $this->app->bind(CourseSessionRepositoryInterface::class, CourseSessionRepository::class);
        $this->app->bind(LessonRepositoryInterface::class, LessonRepository::class);
        $this->app->bind(MaterialRepositoryInterface::class, MaterialRepository::class);
        $this->app->bind(StudentTrainingProgramRepositoryInterface::class, StudentTrainingProgramRepository::class);
        $this->app->bind(ExemptCourseRepositoryInterface::class, ExemptCourseRepository::class);
        $this->app->bind(ScoreRepositoryInterface::class, ScoreRepository::class);
        $this->app->bind(CertificateRepositoryInterface::class, CertificateRepository::class);
        $this->app->bind(NotificationRepositoryInterface::class, NotificationRepository::class);
        $this->app->bind(ExamScheduleInterface::class, ExamScheduleRepository::class);
        $this->app->bind(DisciplineScoreInterface::class, DisciplineScoreRepository::class);
        $this->app->bind(LearningResultRepositoryInterface::class, LearningResultRepository::class);
        $this->app->bind(ReExamRegistrationRepositoryInterface::class, ReExamRegistrationRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}