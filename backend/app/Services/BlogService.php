<?php
namespace App\Services;

use App\Interfaces\BlogRepositoryInterface;
use Exception;

class BlogService
{
    protected $blogRepository;

    public function __construct(BlogRepositoryInterface $blogRepository)
    {
        $this->blogRepository = $blogRepository;
    }

    public function getAllBlogs()
    {
        return $this->blogRepository->getAllBlogs();
    }

    public function getBlogById($id)
    {
        return $this->blogRepository->getBlogById($id);
    }

    public function createBlog(array $data)
    {
        return $this->blogRepository->createBlog($data);
    }

    public function updateBlog($id, array $data)
    {
        return $this->blogRepository->updateBlog($id, $data);
    }

    public function deleteBlog($id)
    {
        return $this->blogRepository->deleteBlog($id);
    }
    public function getImages($id)
    {
        return $this->blogRepository->getImages($id);
    }

    public function uploadImages($id, $images)
    {
        return $this->blogRepository->uploadImages($id, $images);
    }

    public function deleteImage($imageId)
    {
        return $this->blogRepository->deleteImage($imageId);
    }
    public function updateImage($imageId, array $data)
    {
        return $this->blogRepository->updateImage($imageId, $data);
    }


}