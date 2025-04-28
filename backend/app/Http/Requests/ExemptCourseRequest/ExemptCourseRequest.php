<?php

namespace App\Http\Requests\ExemptCourseRequest;

use Illuminate\Foundation\Http\FormRequest;

class ExemptCourseRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'student_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'from_program_id' => 'required|exists:training_programs,id',
            'to_program_id' => 'required|exists:training_programs,id',
        ];
    }

    public function messages()
    {
        return [
            'student_id.required' => 'Học viên là bắt buộc.',
            'course_id.required' => 'Môn học là bắt buộc.',
            'from_program_id.required' => 'Chương trình đào tạo từ là bắt buộc.',
            'to_program_id.required' => 'Chương trình đào tạo đến là bắt buộc.',
        ];
    }
}