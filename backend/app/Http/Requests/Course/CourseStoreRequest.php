<?php

namespace App\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class CourseStoreRequest extends FormRequest
{
    public function authorize()
    {
        // Cho phép tất cả người dùng (hoặc kiểm tra quyền nếu cần)
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255|unique:courses,title',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Trường tiêu đề không được bỏ trống.',
            'title.string' => 'Trường tiêu đề phải là chuỗi.',
            'title.max' => 'Trường tiêu đề không được vượt quá 255 ký tự.',
            'title.unique' => 'Tên khóa học đã tồn tại, vui lòng chọn tên khác.',
            'description.string' => 'Trường mô tả phải là chuỗi.',
            'price.required' => 'Trường giá không được bỏ trống.',
            'price.numeric' => 'Trường giá phải là số.',
            'price.min' => 'Trường giá không được nhỏ hơn 0.',

        ];
    }
}