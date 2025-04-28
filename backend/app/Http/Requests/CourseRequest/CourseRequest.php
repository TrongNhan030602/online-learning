<?php
namespace App\Http\Requests\CourseRequest;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Bạn có thể thêm logic phân quyền ở đây nếu cần
    }

    public function rules()
    {
        return [
            'code' => 'required|string|max:255|unique:courses,code,' . $this->route('id') . ',id',  // Đảm bảo không trùng mã khi cập nhật
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
            'credits' => 'nullable|integer|min:1',         // Số tín chỉ, tối thiểu là 1
            'total_hours' => 'nullable|integer|min:1',     // Tổng số giờ học, tối thiểu là 1
            'theory_hours' => 'nullable|integer|min:0',    // Giờ lý thuyết, tối thiểu là 0
            'practice_hours' => 'nullable|integer|min:0',  // Giờ thực hành/thực tập, tối thiểu là 0
            'exam_hours' => 'nullable|integer|min:0',      // Giờ thi/kiểm tra, tối thiểu là 0
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