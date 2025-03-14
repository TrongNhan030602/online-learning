<?php
namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class BlogCommentRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Có thể kiểm tra quyền tại đây nếu cần
    }

    public function rules()
    {
        return [
            'blog_id' => 'required|exists:blogs,id',
            'comment' => 'required|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'blog_id.required' => 'Bài blog không được để trống.',
            'blog_id.exists' => 'Bài blog không tồn tại.',
            'comment.required' => 'Nội dung bình luận không được để trống.',
            'comment.string' => 'Nội dung bình luận phải là chuỗi ký tự.',
            'comment.max' => 'Bình luận không được vượt quá 1000 ký tự.',
        ];
    }
}