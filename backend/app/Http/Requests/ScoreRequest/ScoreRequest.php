<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'student_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'value' => 'required|numeric|min:0|max:10',
            'score_type' => 'required|in:final,quiz,midterm,assignment',
        ];
    }

    public function messages()
    {
        return [
            'student_id.required' => 'Học viên là bắt buộc.',
            'course_id.required' => 'Môn học là bắt buộc.',
            'value.required' => 'Điểm là bắt buộc.',
            'score_type.required' => 'Loại điểm là bắt buộc.',
            'score_type.in' => 'Loại điểm chỉ được là final, quiz, midterm hoặc assignment.',
        ];
    }
}