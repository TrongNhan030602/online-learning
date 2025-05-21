<?php
namespace App\Interfaces;

interface SemesterRepositoryInterface
{
    public function createSemester(array $data);
    public function getAllSemesters();
    public function getSemesterById($id);
    public function updateSemester($id, array $data);
    public function deleteSemester($id);
    public function addCoursesToSemester($semesterId, array $courseIds);
    public function getCoursesBySemester($semesterId);
    public function removeCoursesFromSemester($semesterId, array $courseIds);
    public function getCoursesNotInAnySemester($trainingProgramId);
}