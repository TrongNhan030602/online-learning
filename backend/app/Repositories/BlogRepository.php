<?php
namespace App\Repositories;

use App\Models\Blog;
use App\Models\BlogImage;
use Illuminate\Support\Facades\Storage;
use App\Interfaces\BlogRepositoryInterface;

class BlogRepository implements BlogRepositoryInterface
{
    public function getAllBlogs()
    {
        // Chỉ load images vì model Blog không có author hay comments
        return Blog::with('images')->orderBy('created_at', 'desc')->get();
    }

    public function getBlogById($id)
    {
        return Blog::with('images')->findOrFail($id);
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
            Storage::disk('public')->delete($image->image);
            $image->delete();
        }

        $blog->delete();
    }

    public function uploadImages($id, $images)
    {
        $blog = Blog::findOrFail($id);

        foreach ($images as $image) {
            if (!$image->isValid()) {
                // Trả lỗi nên để controller xử lý, ở đây chỉ throw exception hoặc return false
                throw new \Exception('File không hợp lệ');
            }

            $originalName = $image->getClientOriginalName();
            $filePath = $image->storeAs('blog_images', $originalName, 'public');

            if (!Storage::disk('public')->exists($filePath)) {
                throw new \Exception('Không thể lưu ảnh');
            }

            BlogImage::create([
                'blog_id' => $id,
                'image' => $filePath
            ]);
        }

        return $blog->load('images');
    }

    public function getImages($id)
    {
        return BlogImage::where('blog_id', $id)->get();
    }

    public function deleteImage($imageId)
    {
        $image = BlogImage::findOrFail($imageId);

        Storage::disk('public')->delete($image->image);
        $image->delete();
    }

    public function updateImage($imageId, array $data)
    {
        $image = BlogImage::findOrFail($imageId);
        $image->update($data);

        return $image;
    }

}