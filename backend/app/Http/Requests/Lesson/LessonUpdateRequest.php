<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LessonUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        // Lấy course_id từ request hoặc nếu không gửi, lấy từ bài học hiện tại nếu có thể (nếu bắt buộc, bạn có thể yêu cầu gửi course_id trong update)
        $courseId = $this->input('course_id') ?? $this->route('course_id');
        $lessonId = $this->route('id');

        return [
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('lessons')->ignore($lessonId)->where(function ($query) use ($courseId) {
                    return $query->where('course_id', $courseId);
                }),
            ],
            'content' => 'sometimes|nullable|string',
            'video_url' => 'sometimes|nullable|url',
            'order' => [
                'sometimes',
                'required',
                'integer',
                'min:1',
                Rule::unique('lessons')->ignore($lessonId)->where(function ($query) use ($courseId) {
                    return $query->where('course_id', $courseId);
                }),
            ],
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Trường tiêu đề không được bỏ trống khi cập nhật.',
            'title.unique' => 'Tiêu đề bài học đã tồn tại, vui lòng chọn tiêu đề khác.',
            'order.required' => 'Trường thứ tự bài học không được bỏ trống khi cập nhật.',
            'order.integer' => 'Thứ tự bài học phải là số nguyên.',
            'order.min' => 'Thứ tự bài học phải lớn hơn hoặc bằng 1.',
            'order.unique' => 'Thứ tự bài học đã tồn tại cho khóa học này. Vui lòng sử dụng thứ tự khác (ví dụ: 1, 2, 3, ...).',
        ];
    }
}