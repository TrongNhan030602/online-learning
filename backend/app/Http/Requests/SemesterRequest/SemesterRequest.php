<?php
namespace App\Http\Requests\SemesterRequest;

use Illuminate\Foundation\Http\FormRequest;

class SemesterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'training_program_id' => 'required|exists:training_programs,id',
            'name' => 'required|string|max:255',
        ];
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