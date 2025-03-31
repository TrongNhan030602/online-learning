<?php

namespace App\Http\Requests\ClassRoom;

use Illuminate\Foundation\Http\FormRequest;

class StoreClassRoomRequest extends FormRequest
{
    public function rules()
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:open,ongoing,completed,closed',
            'max_students' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'course_id.required' => 'Bạn phải chọn một khóa học.',
            'course_id.exists' => 'Khóa học không hợp lệ.',

            'name.required' => 'Tên lớp học không được để trống.',
            'name.string' => 'Tên lớp học phải là một chuỗi ký tự.',
            'name.max' => 'Tên lớp học không được vượt quá 255 ký tự.',

            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'start_date.date' => 'Ngày bắt đầu phải là một ngày hợp lệ.',

            'end_date.required' => 'Ngày kết thúc là bắt buộc.',
            'end_date.date' => 'Ngày kết thúc phải là một ngày hợp lệ.',
            'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',

            'status.required' => 'Trạng thái lớp học là bắt buộc.',
            'status.in' => 'Trạng thái lớp học chỉ có thể là: open, ongoing, completed, hoặc closed.',

            'max_students.required' => 'Số lượng học viên tối đa là bắt buộc.',
            'max_students.integer' => 'Số lượng học viên tối đa phải là số nguyên.',
            'max_students.min' => 'Số lượng học viên tối thiểu phải là 1.',
        ];
    }
}