<?php

namespace App\Http\Requests\Faq;

use Illuminate\Foundation\Http\FormRequest;

class FaqUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'question' => 'sometimes|string',
            'answer' => 'sometimes|string',
            'category' => 'nullable|string',
            'status' => 'sometimes|integer|in:0,1',
            'priority' => 'nullable|integer',
        ];
    }

    public function messages()
    {
        return [
            'question.string' => 'Câu hỏi phải là chuỗi!',
            'answer.string' => 'Câu trả lời phải là chuỗi!',
            'category.string' => 'Danh mục phải là chuỗi!',
            'status.integer' => 'Trạng thái phải là số nguyên!',
            'status.in' => 'Trạng thái chỉ được là 0 (ẩn) hoặc 1 (hiển thị)!',
            'priority.integer' => 'Mức độ ưu tiên phải là số nguyên!',
        ];
    }
}