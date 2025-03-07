<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LessonStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255|unique:lessons,title',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url',
            'order' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('lessons')->where(function ($query) {
                    return $query->where('course_id', $this->input('course_id'));
                }),
            ],
            'document' => 'nullable|mimes:pdf,mp4,avi,mov|max:10240',
        ];
    }

    public function messages()
    {
        return [
            'course_id.required' => 'Trường khóa học không được bỏ trống.',
            'course_id.exists' => 'Khóa học không tồn tại.',
            'title.required' => 'Trường tiêu đề không được bỏ trống.',
            'title.unique' => 'Tiêu đề bài học đã tồn tại, vui lòng chọn tiêu đề khác.',
            'order.required' => 'Trường thứ tự bài học không được bỏ trống.',
            'order.integer' => 'Thứ tự bài học phải là số nguyên.',
            'order.min' => 'Thứ tự bài học phải lớn hơn hoặc bằng 1.',
            'order.unique' => 'Thứ tự bài học đã tồn tại cho khóa học này. Vui lòng sử dụng thứ tự khác (ví dụ: 1, 2, 3, ...).',
            'document.mimes' => 'Tài liệu phải là file PDF, mp4, avi, hoặc mov.',
            'document.max' => 'Dung lượng tài liệu không được vượt quá 10MB.',
        ];
    }
}