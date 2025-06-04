<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'type' => 'sometimes|string|in:academy,industry,news,tutorial',
            'summary' => 'sometimes|string|max:800',
            'published_at' => 'sometimes|date',
            'status' => 'sometimes|string|in:draft,published'
        ];
    }

    public function messages()
    {
        return [
            'title.string' => 'Tiêu đề phải là chuỗi ký tự.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
            'content.string' => 'Nội dung phải là chuỗi ký tự.',
            'type.string' => 'Loại bài viết phải là chuỗi.',
            'type.in' => 'Loại bài viết không hợp lệ (industry, academy,news,tutorial).',
            'summary.string' => 'Tóm tắt phải là chuỗi.',
            'summary.max' => 'Tóm tắt không được vượt quá 800 ký tự.',
            'published_at.date' => 'Ngày xuất bản không đúng định dạng.',
            'status.string' => 'Trạng thái phải là chuỗi.',
            'status.in' => 'Trạng thái không hợp lệ (draft, published).',
        ];
    }
}