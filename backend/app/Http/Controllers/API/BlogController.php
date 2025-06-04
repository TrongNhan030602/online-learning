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

    // Lấy danh sách blog
    public function index()
    {
        return response()->json($this->blogService->getAllBlogs());
    }

    // Lấy thông tin blog theo ID
    public function show($id)
    {
        $blog = $this->blogService->getBlogById($id);
        if (!$blog) {
            return response()->json(['message' => 'Không tìm thấy bài blog.'], 404);
        }
        return response()->json($blog);
    }




    // Tạo blog mới
    public function store(BlogRequest $request)
    {
        try {
            $data = $request->validated();

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

    // Cập nhật blog
    public function update(UpdateBlogRequest $request, $id)
    {
        try {
            $data = $request->validated();

            if (isset($data['published_at'])) {
                // Chuyển ISO8601 -> 'Y-m-d H:i:s' để MySQL chấp nhận
                $data['published_at'] = date('Y-m-d H:i:s', strtotime($data['published_at']));
            }

            $blog = $this->blogService->updateBlog($id, $data);

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


    // Xóa blog
    public function destroy($id)
    {
        try {
            $this->blogService->deleteBlog($id);
            return response()->json(['message' => 'Xóa bài blog thành công.']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa bài blog.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    // Lấy danh sách ảnh của blog
    public function getImages($id)
    {
        try {
            $images = $this->blogService->getImages($id);
            if (empty($images)) {
                return response()->json(['message' => 'Không tìm thấy ảnh cho bài blog này.'], 404);
            }
            return response()->json($images);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi lấy danh sách ảnh.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Upload ảnh cho blog
    public function uploadImages(Request $request, $id)
    {
        try {
            $request->validate([
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            $uploadedImages = $this->blogService->uploadImages($id, $request->file('images'));

            return response()->json([
                'message' => 'Tải ảnh lên thành công.',
                'data' => $uploadedImages
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tải ảnh lên.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa ảnh
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
    public function updateImage(Request $request, $imageId)
    {
        try {
            // Validate trực tiếp tại đây
            $validated = $request->validate([
                'caption' => 'nullable|string|max:255',
                'order' => 'nullable|integer|min:0'
            ]);

            $image = $this->blogService->updateImage($imageId, $validated);

            return response()->json([
                'message' => 'Cập nhật thông tin ảnh thành công.',
                'data' => $image
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật ảnh.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}