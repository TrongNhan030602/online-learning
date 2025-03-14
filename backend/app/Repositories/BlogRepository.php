<?php
namespace App\Repositories;

use App\Models\Blog;
use App\Models\BlogImage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Interfaces\BlogRepositoryInterface;

class BlogRepository implements BlogRepositoryInterface
{
    public function getAllBlogs()
    {
        return Blog::with(['author', 'images'])->orderBy('created_at', 'desc')->get();
    }

    public function getBlogById($id)
    {
        return Blog::with(['author', 'comments.user', 'images'])->findOrFail($id);
    }

    public function createBlog(array $data)
    {
        return Blog::create($data);
    }

    public function updateBlog($id, array $data)
    {
        $blog = Blog::findOrFail($id);
        $blog->update($data);
        return $blog->load('images');
    }

    public function deleteBlog($id)
    {
        $blog = Blog::findOrFail($id);

        // Xóa tất cả ảnh liên quan trước khi xóa blog
        foreach ($blog->images as $image) {
            Storage::delete($image->image_path);
            $image->delete();
        }

        $blog->delete();
    }
    public function uploadImages($id, $images)
    {
        $blog = Blog::findOrFail($id);

        foreach ($images as $image) {
            // Kiểm tra file hợp lệ
            if (!$image->isValid()) {
                return response()->json(['message' => 'File không hợp lệ'], 400);
            }

            // Lấy tên gốc
            $originalName = $image->getClientOriginalName();

            // Lưu file vào storage/public/blog_images/ với tên gốc
            $filePath = $image->storeAs('blog_images', $originalName, 'public');

            // Kiểm tra file đã lưu chưa
            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json(['message' => 'Không thể lưu ảnh'], 500);
            }

            // Lưu vào database với đường dẫn "blog_images/tên-ảnh.jpg"
            BlogImage::create([
                'blog_id' => $id,
                'image' => $filePath
            ]);
        }

        return response()->json($blog->load('images'), 201);
    }
    public function getImages($id)
    {
        return BlogImage::where('blog_id', $id)->get();
    }

    public function deleteImage($imageId)
    {
        $image = BlogImage::findOrFail($imageId);

        // Xóa file từ storage
        Storage::disk('public')->delete($image->image);

        // Xóa bản ghi trong database
        $image->delete();
    }

}