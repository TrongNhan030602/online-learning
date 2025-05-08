<?php
namespace App\Http\Requests\CourseRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Bạn có thể thêm logic phân quyền ở đây nếu cần
    }

    public function rules()
    {
        return [
            'code' => 'required|string|max:255|unique:courses,code,' . $this->route('id') . ',id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
            'credits' => 'nullable|integer|min:1',
            'total_hours' => [
                'nullable',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) {
                    $theory_hours = $this->input('theory_hours', 0);
                    $practice_hours = $this->input('practice_hours', 0);
                    $exam_hours = $this->input('exam_hours', 0);
                    $expected_total_hours = $theory_hours + $practice_hours + $exam_hours;

                    if ($value !== $expected_total_hours) {
                        $fail('Tổng số giờ học phải bằng tổng của giờ lý thuyết, thực hành và thi.');
                    }
                },
            ],
            'theory_hours' => 'nullable|integer|min:0',
            'practice_hours' => 'nullable|integer|min:0',
            'exam_hours' => 'nullable|integer|min:0',
        ];
    }

    public function messages()
    {
        return [
            'code.required' => 'Mã môn học là bắt buộc.',
            'code.unique' => 'Mã môn học đã tồn tại.',
            'title.required' => 'Tên môn học là bắt buộc.',
            'is_active.required' => 'Trạng thái môn học là bắt buộc.',
            'credits.integer' => 'Số tín chỉ phải là số nguyên.',
            'credits.min' => 'Số tín chỉ phải lớn hơn hoặc bằng 1.',
            'total_hours.integer' => 'Tổng số giờ học phải là số nguyên.',
            'total_hours.min' => 'Tổng số giờ học phải lớn hơn hoặc bằng 1.',
            'theory_hours.integer' => 'Giờ lý thuyết phải là số nguyên.',
            'theory_hours.min' => 'Giờ lý thuyết phải lớn hơn hoặc bằng 0.',
            'practice_hours.integer' => 'Giờ thực hành phải là số nguyên.',
            'practice_hours.min' => 'Giờ thực hành phải lớn hơn hoặc bằng 0.',
            'exam_hours.integer' => 'Giờ thi phải là số nguyên.',
            'exam_hours.min' => 'Giờ thi phải lớn hơn hoặc bằng 0.',
        ];
    }
}