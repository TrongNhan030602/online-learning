<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DisciplineScoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => 'required|exists:users,id',
            'semester_id' => 'nullable|exists:semesters,id',
            'score' => 'required|integer|min:0|max:100',
            'evaluation' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.required' => 'Trường học viên là bắt buộc.',
            'student_id.exists' => 'Học viên không tồn tại trong hệ thống.',
            'semester_id.exists' => 'Học kỳ không tồn tại.',
            'score.required' => 'Điểm là bắt buộc.',
            'score.integer' => 'Điểm phải là một số nguyên.',
            'score.min' => 'Điểm phải lớn hơn hoặc bằng 0.',
            'score.max' => 'Điểm phải nhỏ hơn hoặc bằng 100.',
            'evaluation.string' => 'Nhận xét phải là một chuỗi.',
            'evaluation.max' => 'Nhận xét không được vượt quá 1000 ký tự.',
        ];
    }
}