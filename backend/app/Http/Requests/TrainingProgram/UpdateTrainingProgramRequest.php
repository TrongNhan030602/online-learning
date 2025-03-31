<?php

namespace App\Http\Requests\TrainingProgram;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTrainingProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => 'sometimes|exists:courses,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'sometimes|integer|min:1',
            'requirements' => 'nullable|string',
            'objectives' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'course_id.exists' => 'Khóa học không tồn tại.',
            'name.string' => 'Tên chương trình đào tạo phải là chuỗi ký tự.',
            'name.max' => 'Tên chương trình đào tạo không được vượt quá 255 ký tự.',
            'duration.integer' => 'Thời lượng khóa học phải là số nguyên.',
            'duration.min' => 'Thời lượng khóa học phải ít nhất là 1.'
        ];
    }
}