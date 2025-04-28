<?php
namespace App\Http\Requests\LessonRequest;

use Illuminate\Foundation\Http\FormRequest;

class LessonRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'course_session_id' => 'required|exists:course_sessions,id',  // Buổi học phải tồn tại
            'title' => 'required|string|max:255',  // Tiêu đề bài học
            'content' => 'nullable|string',  // Nội dung bài học
        ];
    }

    public function messages()
    {
        return [
            'course_session_id.required' => 'Buổi học là trường bắt buộc.',
            'course_session_id.exists' => 'Buổi học không tồn tại.',
            'title.required' => 'Tiêu đề là trường bắt buộc.',
        ];
    }
}