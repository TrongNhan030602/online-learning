<?php
namespace App\Services;

use App\Interfaces\SemesterRepositoryInterface;
use Exception;

class SemesterService
{
    protected $semesterRepository;

    public function __construct(SemesterRepositoryInterface $semesterRepository)
    {
        $this->semesterRepository = $semesterRepository;
    }

    public function createSemester(array $data)
    {
        try {
            return $this->semesterRepository->createSemester($data);
        } catch (Exception $e) {
            throw new Exception('Lỗi khi tạo học kỳ: ' . $e->getMessage());
        }
    }

    public function getAllSemesters()
    {
        return $this->semesterRepository->getAllSemesters();
    }

    public function getSemesterById($id)
    {
        return $this->semesterRepository->getSemesterById($id);
    }

    public function updateSemester($id, array $data)
    {
        return $this->semesterRepository->updateSemester($id, $data);
    }

    public function deleteSemester($id)
    {
        return $this->semesterRepository->deleteSemester($id);
    }

    public function addCoursesToSemester($semesterId, array $courseIds)
    {
        return $this->semesterRepository->addCoursesToSemester($semesterId, $courseIds);
    }
    public function removeCoursesFromSemester($semesterId, array $courseIds)
    {
        return $this->semesterRepository->removeCoursesFromSemester($semesterId, $courseIds);
    }

    public function getUnassignedCourses($trainingProgramId)
    {
        return $this->semesterRepository->getCoursesNotInAnySemester($trainingProgramId);
    }

}