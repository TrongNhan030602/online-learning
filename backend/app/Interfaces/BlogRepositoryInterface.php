<?php
namespace App\Interfaces;

interface BlogRepositoryInterface
{
    public function getAllBlogs();
    public function getBlogById($id);
    public function createBlog(array $data);
    public function updateBlog($id, array $data);
    public function deleteBlog($id);
    public function uploadImages($id, $images);
    public function deleteImage($imageId);
    public function getImages($id);
    public function updateImage($imageId, array $data);
}