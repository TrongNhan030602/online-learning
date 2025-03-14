<?php

namespace App\Http\Requests\Progress;

use App\Enums\ProgressStatus;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class StoreProgressRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'lesson_id' => 'required|exists:lessons,id',
            'status' => ['required', new Enum(ProgressStatus::class)],
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => 'Người dùng là bắt buộc.',
            'user_id.exists' => 'Người dùng không hợp lệ.',

            'course_id.required' => 'Khóa học là bắt buộc.',
            'course_id.exists' => 'Khóa học không hợp lệ.',

            'lesson_id.required' => 'Bài học là bắt buộc.',
            'lesson_id.exists' => 'Bài học không hợp lệ.',

            'status.required' => 'Trạng thái là bắt buộc.',
            'status.string' => 'Trạng thái phải là chuỗi ký tự.'
        ];
    }
}