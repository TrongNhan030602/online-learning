<?php

namespace App\Interfaces;

interface ProgressRepositoryInterface
{
    public function getAllProgress($filters);
    public function getProgressById($id);
    public function createProgress(array $data);
    public function updateProgress($id, array $data);
    public function markLessonComplete($id);
    public function getCompletedLessonsByUser($userId);
    public function calculateCourseCompletion($userId, $courseId);
    public function submitReview(array $data);
    public function checkUserHasProgress($userId, $courseId);
    public function checkUserHasCompletedCourse($userId, $courseId);
    public function getAllUserProgress();
}