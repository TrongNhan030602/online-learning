<?php

namespace App\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class CourseUpdateRequest extends FormRequest
{
    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        // Lấy ID của khóa học từ route (giả sử route parameter là 'id')
        $courseId = $this->route('id');

        return [
            'title' => 'sometimes|required|string|max:255|unique:courses,title,' . $courseId,
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|required|numeric|min:0'
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Trường tiêu đề không được bỏ trống khi cập nhật.',
            'title.string' => 'Trường tiêu đề phải là chuỗi.',
            'title.max' => 'Trường tiêu đề không được vượt quá 255 ký tự.',
            'title.unique' => 'Tên khóa học đã tồn tại, vui lòng chọn tên khác.',
            'description.string' => 'Trường mô tả phải là chuỗi.',
            'price.required' => 'Trường giá không được bỏ trống khi cập nhật.',
            'price.numeric' => 'Trường giá phải là số.',
            'price.min' => 'Trường giá không được nhỏ hơn 0.'
        ];
    }
}