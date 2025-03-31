<?php

namespace App\Http\Requests\ClassRoom;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassRoomRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|in:open,ongoing,completed,closed',
            'max_students' => 'sometimes|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'name.string' => 'Tên lớp học phải là một chuỗi ký tự.',
            'name.max' => 'Tên lớp học không được vượt quá 255 ký tự.',
            'start_date.date' => 'Ngày bắt đầu phải là một ngày hợp lệ.',
            'end_date.date' => 'Ngày kết thúc phải là một ngày hợp lệ.',
            'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
            'status.in' => 'Trạng thái lớp học chỉ có thể là: open, ongoing, completed, hoặc closed.',
            'max_students.integer' => 'Số lượng học viên tối đa phải là số nguyên.',
            'max_students.min' => 'Số lượng học viên tối thiểu phải là 1.',
        ];
    }
}