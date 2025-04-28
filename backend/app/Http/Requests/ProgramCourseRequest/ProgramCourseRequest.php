<?php

namespace App\Http\Requests\ProgramCourseRequest;

use Illuminate\Foundation\Http\FormRequest;

class ProgramCourseRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'training_program_id' => 'required|exists:training_programs,id',
            'course_id' => 'required|exists:courses,id',
        ];
    }

    public function messages()
    {
        return [
            'training_program_id.required' => 'Chương trình đào tạo là bắt buộc.',
            'training_program_id.exists' => 'Chương trình đào tạo không tồn tại.',
            'course_id.required' => 'Môn học là bắt buộc.',
            'course_id.exists' => 'Môn học không tồn tại.',
        ];
    }
}