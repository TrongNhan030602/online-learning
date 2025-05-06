<?php

namespace App\Http\Requests\MaterialRequest;

use Illuminate\Foundation\Http\FormRequest;

class MaterialRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function prepareForValidation()
    {
        // Convert type to lowercase trước khi validate
        if ($this->has('type')) {
            $this->merge([
                'type' => strtolower($this->type),
            ]);
        }
    }

    public function rules()
    {
        $rules = [
            'lesson_id' => ['required', 'integer', 'exists:lessons,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'in:file,link,video'],
        ];

        if ($this->type === 'file') {
            // Cập nhật để chấp nhận các loại ảnh và tài liệu khác
            $rules['file_path'] = ['required', 'file', 'mimes:pdf,doc,docx,mp4,avi,mov,jpeg,jpg,png,gif', 'max:51200']; // 50MB
        } elseif (in_array($this->type, ['link', 'video'])) {
            $rules['file_path'] = ['required', 'url'];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'lesson_id.required' => 'Vui lòng chọn bài học.',
            'lesson_id.integer' => 'ID bài học không hợp lệ.',
            'lesson_id.exists' => 'Bài học không tồn tại.',

            'title.required' => 'Vui lòng nhập tiêu đề tài liệu.',
            'title.string' => 'Tiêu đề phải là chuỗi ký tự.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',

            'description.string' => 'Mô tả phải là chuỗi ký tự.',

            'type.required' => 'Vui lòng chọn loại tài liệu.',
            'type.in' => 'Loại tài liệu phải là file, link hoặc video.',

            'file_path.required' => 'Vui lòng chọn tệp tin hoặc nhập đường dẫn.',
            'file_path.file' => 'Tệp tin tải lên không hợp lệ.',
            'file_path.mimes' => 'Tệp phải là định dạng: pdf, doc, docx, mp4, avi, mov, jpeg, jpg, png hoặc gif.',
            'file_path.max' => 'Kích thước tệp tối đa 50MB.',
            'file_path.url' => 'Đường dẫn phải là một URL hợp lệ.',
        ];
    }
}