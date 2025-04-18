<?php
namespace App\Http\Requests\TrainingProgram;

use Illuminate\Foundation\Http\FormRequest;

class StoreTrainingProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'requirements' => 'nullable|string',
            'objectives' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'course_id.required' => 'Khóa học không được để trống.',
            'course_id.exists' => 'Khóa học không tồn tại.',
            'name.required' => 'Tên chương trình đào tạo không được để trống.',
            'name.string' => 'Tên chương trình đào tạo phải là chuỗi ký tự.',
            'name.max' => 'Tên chương trình đào tạo không được vượt quá 255 ký tự.',
            'duration.required' => 'Thời lượng khóa học không được để trống.',
            'duration.integer' => 'Thời lượng khóa học phải là số nguyên.',
            'duration.min' => 'Thời lượng khóa học phải ít nhất là 1.'
        ];
    }
}