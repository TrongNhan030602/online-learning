<?php

namespace App\Http\Requests\Lesson;

use Illuminate\Foundation\Http\FormRequest;

class AssignFilesRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'file_ids' => 'required|array',
            'file_ids.*' => 'exists:course_files,id',
        ];
    }

    public function messages()
    {
        return [
            'file_ids.required' => 'Vui lòng chọn ít nhất một tài liệu.',
            'file_ids.array' => 'File_ids phải là dạng mảng.',
            'file_ids.*.exists' => 'Một số tài liệu không tồn tại.',
        ];
    }
}