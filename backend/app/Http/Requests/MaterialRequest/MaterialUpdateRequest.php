<?php

namespace App\Http\Requests\MaterialRequest;

use Illuminate\Foundation\Http\FormRequest;

class MaterialUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function prepareForValidation()
    {
        if ($this->has('type')) {
            $this->merge([
                'type' => strtolower($this->type),
            ]);
        }
    }

    public function rules()
    {
        $rules = [
            'lesson_id' => ['sometimes', 'integer', 'exists:lessons,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'nullable'],
            'type' => ['sometimes', 'in:file,link,video'],
        ];

        // Nếu type là "link" thì bắt buộc phải có file_path đúng định dạng URL
        if ($this->input('type') === 'link') {
            $rules['file_path'] = ['required', 'url', 'max:500'];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'lesson_id.integer' => 'ID bài học không hợp lệ.',
            'lesson_id.exists' => 'Bài học không tồn tại.',

            'title.string' => 'Tiêu đề phải là chuỗi ký tự.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',

            'description.string' => 'Mô tả phải là chuỗi ký tự.',

            'type.in' => 'Loại tài liệu phải là file, link hoặc video.',

            'file_path.required' => 'Vui lòng nhập liên kết tài liệu.',
            'file_path.url' => 'Liên kết tài liệu phải là một URL hợp lệ.',
            'file_path.max' => 'Liên kết tài liệu không được vượt quá 500 ký tự.',
        ];
    }
}