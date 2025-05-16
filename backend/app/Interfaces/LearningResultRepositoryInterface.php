<?php
namespace App\Interfaces;

interface LearningResultRepositoryInterface
{
    // Lấy tất cả kết quả học tập (có thể pagination hoặc filter)
    public function all(array $filters = []);

    // Tìm kết quả học tập theo ID
    public function find(int $id);

    // Tạo mới kết quả học tập với dữ liệu truyền vào
    public function create(array $data);

    // Cập nhật kết quả học tập theo ID và dữ liệu
    public function update(int $id, array $data);

    // Xóa kết quả học tập theo ID
    public function delete(int $id);

    // Lấy kết quả học tập theo học viên và chương trình (và học kỳ tùy chọn)
    public function findByStudentAndProgram(int $studentTrainingProgramId, int $programId, ?int $semesterId = null);

    // Tính điểm trung bình và cập nhật kết quả học tập cho học viên theo chương trình / học kỳ
    public function calculateAndUpdateAverageScore(int $studentTrainingProgramId, int $programId, ?int $semesterId = null);

    // Lấy báo cáo tổng hợp kết quả học tập theo chương trình, học kỳ, phân loại, trạng thái hoàn thành
    public function getReport(array $criteria = []);
}