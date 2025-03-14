<?php
namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogCommentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'comment' => 'required|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'comment.required' => 'Nội dung bình luận không được để trống.',
            'comment.string' => 'Nội dung bình luận phải là chuỗi ký tự.',
            'comment.max' => 'Bình luận không được vượt quá 1000 ký tự.',
        ];
    }
}