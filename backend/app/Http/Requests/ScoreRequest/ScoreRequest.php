<?php

namespace App\Http\Requests\ScoreRequest;

use Illuminate\Foundation\Http\FormRequest;

class ScoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'user_id' => 'exists:users,id',
            'student_training_program_id' => 'exists:student_training_programs,id',
            'course_id' => 'exists:courses,id',
            'semester_id' => 'nullable|exists:semesters,id',
            'value' => 'numeric|min:0|max:10',
            'score_type' => 'in:final,quiz,midterm,assignment',
            'attempt' => 'nullable|integer|min:1',
            'is_accepted' => 'nullable|boolean',
        ];

        if ($this->isMethod('post')) {
            // Nếu là tạo mới thì các trường này bắt buộc
            $rules['user_id'] = 'required|exists:users,id';
            $rules['student_training_program_id'] = 'required|exists:student_training_programs,id';
            $rules['course_id'] = 'required|exists:courses,id';
            $rules['value'] = 'required|numeric|min:0|max:10';
            $rules['score_type'] = 'required|in:final,quiz,midterm,assignment';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'user_id.required' => 'Học viên là bắt buộc.',
            'user_id.exists' => 'Học viên không tồn tại.',
            'student_training_program_id.required' => 'Chương trình đào tạo là bắt buộc.',
            'student_training_program_id.exists' => 'Chương trình đào tạo không tồn tại.',
            'course_id.required' => 'Môn học là bắt buộc.',
            'course_id.exists' => 'Môn học không tồn tại.',
            'semester_id.exists' => 'Học kỳ không tồn tại.',
            'value.required' => 'Điểm là bắt buộc.',
            'value.numeric' => 'Điểm phải là số.',
            'value.min' => 'Điểm phải lớn hơn hoặc bằng 0.',
            'value.max' => 'Điểm không được vượt quá 10.',
            'score_type.required' => 'Loại điểm là bắt buộc.',
            'score_type.in' => 'Loại điểm chỉ được là final, quiz, midterm hoặc assignment.',
            'attempt.integer' => 'Lần thi phải là số nguyên.',
            'attempt.min' => 'Lần thi phải lớn hơn hoặc bằng 1.',
            'is_accepted.boolean' => 'Giá trị chấp nhận phải là true hoặc false.',
        ];
    }
}