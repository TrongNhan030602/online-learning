<?php

namespace App\Interfaces;

interface ScoreRepositoryInterface
{
    public function create(array $data);
    public function update($id, array $data);
    public function getByStudent($studentId);
    public function getByCourse($courseId);
    public function getByStudentAndSemester($studentId, $semesterId);
    public function getById($id);
}