<?php

namespace App\Interfaces;

interface ScoreRepositoryInterface
{
    public function getAllWithRelations($filters = []);
    public function create(array $data);
    public function update($id, array $data);
    public function getByStudent($studentId);
    public function getByCourse($courseId);
    public function getByStudentAndSemester($studentId, $semesterId);
    public function getById($id);
    public function delete($id)
    ;
    // Mới thêm
    public function getAcceptedScoresByUser($userId);
    public function getLatestAttemptScore($userId, $courseId);
    public function saveBulkScoresAndCalculateResults(array $bulkScores, int $courseId, ?int $semesterId = null, int $attempt = 1);
    // API lấy điểm theo chương trình, môn, học kỳ (nullable), attempt
    public function getScoresByCourseAndProgram(int $trainingProgramId, int $courseId, ?int $semesterId = null, int $attempt = 1);
}