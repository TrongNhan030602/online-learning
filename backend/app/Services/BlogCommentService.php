<?php
namespace App\Services;

use App\Interfaces\BlogCommentRepositoryInterface;
use Exception;

class BlogCommentService
{
    protected $blogCommentRepository;

    public function __construct(BlogCommentRepositoryInterface $blogCommentRepository)
    {
        $this->blogCommentRepository = $blogCommentRepository;
    }

    public function getCommentsByBlogId($blogId)
    {
        return $this->blogCommentRepository->getCommentsByBlogId($blogId);
    }

    public function createComment(array $data)
    {
        return $this->blogCommentRepository->createComment($data);
    }
    public function updateComment($id, array $data)
    {
        return $this->blogCommentRepository->updateComment($id, $data);
    }
    public function deleteComment($id)
    {
        return $this->blogCommentRepository->deleteComment($id);
    }

}