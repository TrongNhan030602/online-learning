<?php

namespace App\Http\Requests\Faq;

use Illuminate\Foundation\Http\FormRequest;

class FaqRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Cho phép tất cả user sử dụng request này
    }

    public function rules()
    {
        return [
            'question' => 'required|string',
            'answer' => 'required|string',
            'category' => 'nullable|string',
            'status' => 'required|integer|in:0,1',
            'priority' => 'nullable|integer',
        ];
    }

    public function messages()
    {
        return [
            'question.required' => 'Câu hỏi không được để trống!',
            'question.string' => 'Câu hỏi phải là chuỗi!',
            'answer.required' => 'Câu trả lời không được để trống!',
            'answer.string' => 'Câu trả lời phải là chuỗi!',
            'category.string' => 'Danh mục phải là chuỗi!',
            'status.required' => 'Trạng thái không được để trống!',
            'status.integer' => 'Trạng thái phải là số nguyên!',
            'status.in' => 'Trạng thái chỉ được là 0 (ẩn) hoặc 1 (hiển thị)!',
            'priority.integer' => 'Mức độ ưu tiên phải là số nguyên!',
        ];
    }
}