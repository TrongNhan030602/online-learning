<?php
namespace App\Http\Requests\SemesterRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SemesterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // Kiểm tra kiểu HTTP request để quyết định khi nào yêu cầu training_program_id
        $rules = [
            'name' => 'required|string|max:255',
        ];

        // Nếu là PUT (cập nhật), không yêu cầu training_program_id
        if ($this->isMethod('post')) {
            $rules['training_program_id'] = 'required|exists:training_programs,id';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'training_program_id.required' => 'Chương trình đào tạo là bắt buộc.',
            'training_program_id.exists' => 'Chương trình đào tạo không tồn tại.',
            'name.required' => 'Tên học kỳ là bắt buộc.',
            'name.string' => 'Tên học kỳ phải là chuỗi.',
            'name.max' => 'Tên học kỳ không được vượt quá 255 ký tự.',
        ];
    }
}