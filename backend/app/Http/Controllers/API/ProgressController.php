<?php
namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Enums\ProgressStatus;
use App\Services\ProgressService;

use App\Http\Controllers\Controller;
use App\Http\Requests\Progress\SubmitReviewRequest;
use App\Http\Requests\Progress\StoreProgressRequest;
use App\Http\Requests\Progress\UpdateProgressRequest;

class ProgressController extends Controller
{
    protected $progressService;

    public function __construct(ProgressService $progressService)
    {
        $this->progressService = $progressService;
    }

    // Lấy danh sách tiến độ học viên (có thể lọc theo user_id, course_id)
    public function index(Request $request)
    {
        try {
            $filters = $request->only(['user_id', 'course_id']);
            $progress = $this->progressService->listProgress($filters);
            return response()->json($progress);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách tiến độ học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xem tiến độ của một học viên theo ID
    public function show($id)
    {
        try {
            $progress = $this->progressService->getProgressById($id);
            return response()->json($progress);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy tiến độ học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tạo mới tiến độ học (khi học viên bắt đầu khóa học)
    public function store(StoreProgressRequest $request)
    {
        try {
            $progress = $this->progressService->createProgress($request->validated());
            return response()->json([
                'message' => 'Tiến độ học đã được tạo thành công.',
                'data' => $progress
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi: Không thể tạo tiến độ học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật trạng thái tiến độ học (VD: "Đã hoàn thành", "Đang học")
    public function update(UpdateProgressRequest $request, $id)
    {
        try {
            $progress = $this->progressService->updateProgress($id, $request->validated());
            return response()->json([
                'message' => 'Tiến độ học đã được cập nhật.',
                'data' => $progress
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật tiến độ học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Đánh dấu một bài học đã hoàn thành
    public function markLessonComplete($id)
    {
        try {
            $progress = $this->progressService->updateProgress($id, [
                'status' => ProgressStatus::COMPLETED,
            ]);
            return response()->json([
                'message' => 'Bài học đã được đánh dấu hoàn thành.',
                'data' => $progress
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi đánh dấu bài học hoàn thành.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xem danh sách bài học đã hoàn thành của học viên
    public function getCompletedLessons($userId)
    {
        try {
            $completedLessons = $this->progressService->getCompletedLessonsByUser($userId);
            return response()->json($completedLessons);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách bài học hoàn thành.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Tính % hoàn thành khóa học của học viên
    public function calculateCourseCompletion($userId, $courseId)
    {
        try {
            $completionRate = $this->progressService->calculateCourseCompletion($userId, $courseId);
            return response()->json([
                'user_id' => $userId,
                'course_id' => $courseId,
                'completion_rate' => $completionRate
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tính phần trăm hoàn thành khóa học.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Gửi đánh giá khóa học
    public function submitReview(SubmitReviewRequest $request, $courseId)
    {
        try {
            $userId = auth()->id();
            if (!$userId) {
                return response()->json([
                    'message' => 'Bạn cần đăng nhập để đánh giá khóa học.'
                ], 401);
            }

            $review = $this->progressService->submitReview($courseId, $userId, $request->validated());

            return response()->json([
                'message' => 'Đánh giá đã được gửi thành công.',
                'data' => $review
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi gửi đánh giá khóa học.',
                'error' => $e->getMessage()
            ], 400);
        }
    }



    // Admin xem toàn bộ tiến độ học viên
    public function adminViewProgress()
    {
        try {
            $progressData = $this->progressService->getAllUserProgress();
            return response()->json($progressData);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy tiến độ học viên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}