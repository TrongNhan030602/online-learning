<?php
namespace App\Repositories;

use App\Interfaces\BlogCommentRepositoryInterface;
use App\Models\BlogComment;

class BlogCommentRepository implements BlogCommentRepositoryInterface
{
    public function getCommentsByBlogId($blogId)
    {
        return BlogComment::with('user')->where('blog_id', $blogId)->orderBy('created_at', 'desc')->get();
    }

    public function createComment(array $data)
    {
        return BlogComment::create($data);
    }
    public function updateComment($id, array $data)
    {
        $comment = BlogComment::findOrFail($id);
        $comment->update($data);
        return $comment;
    }
    public function deleteComment($id)
    {
        $comment = BlogComment::find($id);

        if (!$comment) {
            return false; // Trả về false nếu không tìm thấy
        }

        $comment->delete();
        return true;
    }

}