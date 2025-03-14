<?php
namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Services\BlogService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\BlogRequest;
use App\Http\Requests\Blog\UpdateBlogRequest;

class BlogController extends Controller
{
    protected $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    // ✅ Lấy danh sách blog
    public function index()
    {
        return response()->json($this->blogService->getAllBlogs());
    }

    // ✅ Lấy thông tin blog theo ID
    public function show($id)
    {
        return response()->json($this->blogService->getBlogById($id));
    }

    public function store(BlogRequest $request)
    {
        try {
            $adminId = auth()->id(); // Lấy ID admin từ session
            if (!$adminId) {
                return response()->json(['message' => 'Bạn cần đăng nhập để tạo blog.'], 401);
            }

            $data = $request->validated();
            $data['author_id'] = $adminId; // Gán author_id là admin đang đăng nhập

            $blog = $this->blogService->createBlog($data);

            return response()->json([
                'message' => 'Bài blog đã được tạo.',
                'data' => $blog
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo bài blog.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(UpdateBlogRequest $request, $id)
    {
        try {
            $blog = $this->blogService->updateBlog($id, $request->validated());
            if (!$blog) {
                return response()->json(['message' => 'Không tìm thấy bài blog.'], 404);
            }
            return response()->json([
                'message' => 'Cập nhật bài blog thành công.',
                'data' => $blog
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật bài blog.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // ✅ Xóa bài blog
    public function destroy($id)
    {
        $this->blogService->deleteBlog($id);
        return response()->json(['message' => 'Xóa bài blog thành công.']);
    }
    public function getImages($id)
    {
        try {
            $images = $this->blogService->getImages($id);
            return response()->json($images);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách ảnh.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadImages(Request $request, $id)
    {
        try {
            $request->validate([
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $result = $this->blogService->uploadImages($id, $request->file('images'));

            return response()->json([
                'message' => 'Tải ảnh lên thành công.',
                'data' => $result
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tải ảnh lên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteImage($imageId)
    {
        try {
            $this->blogService->deleteImage($imageId);

            return response()->json([
                'message' => 'Xóa ảnh thành công.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa ảnh.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}