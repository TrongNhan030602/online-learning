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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}