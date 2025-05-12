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
        // Nếu entry_type là 'lien_thong', kiểm tra chương trình đào tạo trước đó
        if ($data['entry_type'] === 'lien_thong') {
            // Kiểm tra xem sinh viên đã tham gia chương trình đào tạo trước đó chưa
            $hasPreviousProgram = $this->repository->checkPreviousProgram($data['user_id'], $data['from_program_id']);
            if (!$hasPreviousProgram) {
                return null; // Nếu không có chương trình trước đó, trả về null để báo lỗi trong controller
            }
        }

        // Tiến hành tạo mới bản ghi nếu không có vấn đề gì
        return $this->repository->create($data);
    }
    public function getPreviousPrograms(int $studentId)
    {
        return $this->repository->getPreviousPrograms($studentId);
    }

    // Lấy danh sách học viên trong chương trình đào tạo
    public function getStudentsInProgram(int $trainingProgramId)
    {
        return $this->repository->getStudentsByTrainingProgramId($trainingProgramId);
    }

    public function getStudentsNotInProgram(int $trainingProgramId)
    {
        return $this->repository->getStudentsNotInProgram($trainingProgramId);
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