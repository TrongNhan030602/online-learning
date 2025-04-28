<?php
namespace App\Http\Requests\ProgramCourseRequest;

use Illuminate\Foundation\Http\FormRequest;

class ProgramCourseRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Cho phép truy cập request
    }

    public function rules()
    {
        return [
            'training_program_id' => 'required|exists:training_programs,id',  // Kiểm tra sự tồn tại của chương trình đào tạo
            'courses' => 'required|array', // Kiểm tra mảng môn học
            'courses.*' => 'exists:courses,id',  // Mỗi môn học phải tồn tại trong bảng courses
        ];
    }

    public function messages()
    {
        return [
            'training_program_id.required' => 'Chương trình đào tạo là bắt buộc.',
            'training_program_id.exists' => 'Chương trình đào tạo với ID này không tồn tại.',
            'courses.required' => 'Danh sách môn học là bắt buộc.',
            'courses.array' => 'Môn học phải là một mảng.',
            'courses.*.exists' => 'Một hoặc nhiều môn học không tồn tại.',
        ];
    }
}