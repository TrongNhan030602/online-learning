<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class BlogRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Có thể thêm kiểm tra quyền ở đây nếu cần
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'nullable|string|in:academy,industry,news,tutorial',
            'summary' => 'nullable|string|max:800',
            'published_at' => 'nullable|date',
            'status' => 'nullable|string|in:draft,published'
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Tiêu đề không được để trống.',
            'title.string' => 'Tiêu đề phải là chuỗi ký tự.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
            'content.required' => 'Nội dung không được để trống.',
            'content.string' => 'Nội dung phải là chuỗi.',
            'type.string' => 'Loại bài viết phải là chuỗi.',
            'type.in' => 'Loại bài viết không hợp lệ (academy, industry,tutorial,news).',
            'summary.string' => 'Tóm tắt phải là chuỗi.',
            'summary.max' => 'Tóm tắt không được vượt quá 500 ký tự.',
            'published_at.date' => 'Ngày xuất bản không đúng định dạng.',
            'status.string' => 'Trạng thái phải là chuỗi.',
            'status.in' => 'Trạng thái không hợp lệ (draft, published).',
        ];
    }
}