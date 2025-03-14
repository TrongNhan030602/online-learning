<?php
namespace App\Interfaces;

interface BlogCommentRepositoryInterface
{
    public function getCommentsByBlogId($blogId);
    public function createComment(array $data);
    public function updateComment($id, array $data);
    public function deleteComment($id);
}