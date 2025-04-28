<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReExamRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'registration_date' => 'required|date',
            'reason' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.required' => 'Học viên là trường bắt buộc.',
            'student_id.exists' => 'Học viên không tồn tại trong hệ thống.',
            'course_id.required' => 'Môn học là trường bắt buộc.',
            'course_id.exists' => 'Môn học không tồn tại trong hệ thống.',
            'registration_date.required' => 'Ngày đăng ký là trường bắt buộc.',
            'registration_date.date' => 'Ngày đăng ký phải là một ngày hợp lệ.',
            'reason.string' => 'Lý do phải là một chuỗi ký tự.',
            'reason.max' => 'Lý do không được vượt quá 1000 ký tự.',
        ];
    }
}