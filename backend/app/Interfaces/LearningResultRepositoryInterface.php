<?php

namespace App\Interfaces;

interface LearningResultRepositoryInterface
{
    // Lấy tất cả kết quả học tập (hỗ trợ filter hoặc pagination nếu cần)
    public function all(array $filters = []);

    // Tìm kết quả học tập theo ID
    public function find(int $id);
    public function getLearningResultsForLoggedInStudent(): array;

    // Xóa kết quả học tập
    public function delete(int $id);

    // Tìm kết quả học tập theo học viên, chương trình, và học kỳ (nullable)
    public function findByStudentAndProgram(int $studentTrainingProgramId, int $programId, ?int $semesterId = null);

    // Tính điểm trung bình (chưa lưu vào DB)
    public function calculateAverageScore(int $studentTrainingProgramId, int $programId, ?int $semesterId = null): float;


    // Cập nhật hoặc tạo kết quả học tập (sau khi đã tính toán)
    public function updateLearningResult(
        int $studentTrainingProgramId,
        int $programId,
        ?int $semesterId,
        float $average,
        ?float $gpa = null
    ): bool;

    // Tính điểm GPA (ví dụ: quy đổi sang hệ 4.0)
    public function calculateGPA(int $studentTrainingProgramId, int $programId, ?int $semesterId = null): float;

    // Tính điểm trung bình và cập nhật luôn vào kết quả học tập
    public function calculateAndUpdateAverageScore(
        int $studentTrainingProgramId,
        int $programId,
        ?int $semesterId = null
    ): array;

    public function getByUserAndProgram(int $userId, int $programId, ?int $semesterId = null): ?array;
    // Lấy danh sách kết quả học tập theo chương trình, học kỳ, bộ lọc nâng cao (cho báo cáo, phân trang...)
    public function getByProgram(int $programId, ?int $semesterId = null, array $filters = []);

    // Tính lại toàn bộ kết quả học tập cho chương trình (và học kỳ nếu có)
    public function recalculateAllForProgram(int $programId, ?int $semesterId = null): void;

    // Phân loại học lực theo thang điểm trung bình (Excellent, Good, etc.)
    public function classify(float $averageScore): string;

    // Báo cáo tổng hợp theo tiêu chí
    public function getReport(array $criteria = []);
    public function recalculateOverallForProgram(int $programId): void;
    public function getByProgramAndUser(int $programId, int $userId);
}