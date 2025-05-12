<?php

namespace App\Http\Requests\DisciplineScoreRequest;

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
            'student_training_program_id' => 'required|exists:student_training_programs,id', // Validate `student_training_program_id`
            'semester_id' => 'required|exists:semesters,id', // Validate `semester_id`
            'score' => 'required|integer|min:0|max:100', // Validate `score`
            'evaluation' => 'nullable|string|max:1000', // Validate `evaluation`
        ];
    }

    public function messages(): array
    {
        return [
            'student_training_program_id.required' => 'Trường chương trình đào tạo sinh viên là bắt buộc.',
            'student_training_program_id.exists' => 'Chương trình đào tạo sinh viên không tồn tại.',
            'semester_id.required' => 'Trường học kỳ là bắt buộc.',
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