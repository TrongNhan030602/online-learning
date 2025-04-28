<?php
namespace App\Http\Requests\StudentTrainingProgramRequest;

use Illuminate\Foundation\Http\FormRequest;

class StudentTrainingProgramRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'student_id' => 'required|exists:users,id', // Học viên phải tồn tại trong bảng users
            'training_program_id' => 'required|exists:training_programs,id', // Chương trình đào tạo phải tồn tại
            'entry_type' => 'required|in:default,lien_thong,van_bang_2', // Loại nhập học phải đúng
            'from_program_id' => 'nullable|exists:training_programs,id', // Chương trình học cũ, nếu có
        ];
    }

    public function messages()
    {
        return [
            'student_id.required' => 'Học viên là bắt buộc.',
            'training_program_id.required' => 'Chương trình đào tạo là bắt buộc.',
            'entry_type.required' => 'Loại nhập học là bắt buộc.',
        ];
    }
}