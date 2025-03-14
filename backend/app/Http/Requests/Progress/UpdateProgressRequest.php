<?php

namespace App\Http\Requests\Progress;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgressRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'status' => 'required|string',
            'last_accessed_at' => 'nullable|date'
        ];
    }

    public function messages()
    {
        return [
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.string' => 'Trạng thái phải là chuỗi ký tự.',

            'last_accessed_at.date' => 'Thời gian truy cập cuối phải là định dạng ngày hợp lệ.'
        ];
    }
}