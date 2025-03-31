<?php

namespace App\Http\Requests\ClassSession;


use Illuminate\Foundation\Http\FormRequest;

class UpdateClassSessionRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có quyền thực hiện yêu cầu này không.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;  // Cho phép tất cả người dùng, bạn có thể tùy chỉnh theo yêu cầu.
    }

    /**
     * Xác định các quy tắc validation.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'session_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ];
    }

    /**
     * Tùy chỉnh thông báo lỗi.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'title.required' => 'Vui lòng nhập tiêu đề buổi học.',
            'session_date.required' => 'Vui lòng chọn ngày buổi học.',
            'start_time.required' => 'Vui lòng nhập giờ bắt đầu buổi học.',
            'end_time.required' => 'Vui lòng nhập giờ kết thúc buổi học.',
            'end_time.after' => 'Giờ kết thúc phải sau giờ bắt đầu.',
        ];
    }
}