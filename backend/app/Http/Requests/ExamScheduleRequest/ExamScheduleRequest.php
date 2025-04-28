<?php

namespace App\Http\Requests\ExamScheduleRequest;

use Illuminate\Foundation\Http\FormRequest;

class ExamScheduleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'exam_date' => 'required|date',
            'location' => 'required|string|max:255',
        ];
    }
}