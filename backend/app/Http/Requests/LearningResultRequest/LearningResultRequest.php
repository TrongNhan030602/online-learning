<?php

namespace App\Http\Requests\LearningResultRequest;

use Illuminate\Foundation\Http\FormRequest;

class LearningResultRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'student_training_program_id' => 'required|exists:student_training_programs,id',
            'program_id' => 'required|exists:training_programs,id',
            'program_level' => 'required|string|max:255',
            'semester_id' => 'nullable|exists:semesters,id',
            'average_score' => 'nullable|numeric|min:0|max:10',
            'classification' => 'nullable|string|in:excellent,good,average,poor',
            'completion_status' => 'nullable|string|in:completed,incomplete',
            'notes' => 'nullable|string',
        ];

        // Nếu là update thì bạn có thể thay đổi rule như sau:
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules = array_map(function ($rule) {
                return str_replace('required', 'sometimes', $rule);
            }, $rules);
        }

        return $rules;
    }


    public function messages(): array
    {
        return [
            'student_training_program_id.required' => 'Học viên trong chương trình là bắt buộc.',
            'student_training_program_id.exists' => 'Học viên không tồn tại trong chương trình đã chọn.',

            'program_id.required' => 'Chương trình đào tạo là bắt buộc.',
            'program_id.exists' => 'Chương trình đào tạo không hợp lệ.',

            'program_level.required' => 'Cấp chương trình là bắt buộc.',
            'program_level.max' => 'Cấp chương trình không được vượt quá 255 ký tự.',

            'semester_id.exists' => 'Học kỳ không hợp lệ.',

            'average_score.numeric' => 'Điểm trung bình phải là số.',
            'average_score.min' => 'Điểm trung bình không được nhỏ hơn 0.',
            'average_score.max' => 'Điểm trung bình không được lớn hơn 10.',

            'classification.in' => 'Xếp loại phải là một trong các giá trị: excellent, good, average, poor.',

            'completion_status.in' => 'Trạng thái hoàn thành phải là: completed hoặc incomplete.',

            'notes.string' => 'Ghi chú phải là chuỗi văn bản.',
        ];
    }
}