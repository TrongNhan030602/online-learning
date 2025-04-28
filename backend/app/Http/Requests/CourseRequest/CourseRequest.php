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
            'code' => 'required|string|max:255|unique:courses,code,' . $this->route('id'),
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ];
    }

    public function messages()
    {
        return [
            'code.required' => 'Mã môn học là bắt buộc.',
            'code.unique' => 'Mã môn học đã tồn tại.',
            'title.required' => 'Tên môn học là bắt buộc.',
            'is_active.required' => 'Trạng thái môn học là bắt buộc.',
        ];
    }
}