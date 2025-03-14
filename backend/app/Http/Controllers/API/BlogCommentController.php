<?php
namespace App\Http\Controllers\API;

use App\Http\Requests\Blog\BlogCommentRequest;
use App\Http\Requests\Blog\UpdateBlogCommentRequest;
use App\Services\BlogCommentService;
use App\Http\Controllers\Controller;
use Exception;

class BlogCommentController extends Controller
{
    protected $blogCommentService;

    public function __construct(BlogCommentService $blogCommentService)
    {
        $this->blogCommentService = $blogCommentService;
    }

    // ✅ Lấy danh sách bình luận của một bài blog
    public function index($blogId)
    {
        try {
            $comments = $this->blogCommentService->getCommentsByBlogId($blogId);
            return response()->json($comments);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách bình luận.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Thêm bình luận mới
    public function store(BlogCommentRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id(); // Lấy user_id từ user đăng nhập

            $comment = $this->blogCommentService->createComment($data);

            return response()->json([
                'message' => 'Bình luận đã được thêm thành công.',
                'data' => $comment
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi thêm bình luận.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Chỉnh sửa bình luận
    public function update(UpdateBlogCommentRequest $request, $id)
    {
        try {
            $updatedComment = $this->blogCommentService->updateComment($id, $request->validated());

            if (!$updatedComment) {
                return response()->json(['message' => 'Không tìm thấy bình luận.'], 404);
            }

            return response()->json([
                'message' => 'Bình luận đã được cập nhật.',
                'data' => $updatedComment
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật bình luận.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Xóa bình luận
    public function destroy($id)
    {
        try {
            $deleted = $this->blogCommentService->deleteComment($id);

            if (!$deleted) {
                return response()->json(['message' => 'Không tìm thấy bình luận.'], 404);
            }

            return response()->json(['message' => 'Bình luận đã được xóa.']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa bình luận.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}