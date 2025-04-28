<?php
namespace App\Services;

use App\Interfaces\StudentTrainingProgramRepositoryInterface;

class StudentTrainingProgramService
{
    protected $repository;

    public function __construct(StudentTrainingProgramRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    // Đăng ký học viên vào chương trình
    public function registerStudentToProgram(array $data)
    {
        return $this->repository->create($data);
    }

    // Lấy danh sách học viên trong chương trình đào tạo
    public function getStudentsInProgram(int $trainingProgramId)
    {
        return $this->repository->getStudentsByTrainingProgramId($trainingProgramId);
    }

    // Lấy thông tin học viên trong chương trình đào tạo
    public function getStudentInfo(int $id)
    {
        return $this->repository->getById($id);
    }
    public function removeStudentFromProgram(int $studentId, int $trainingProgramId)
    {

        return $this->repository->removeStudentFromProgram($studentId, $trainingProgramId);

    }
}