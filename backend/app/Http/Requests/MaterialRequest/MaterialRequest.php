<?php
namespace App\Http\Requests\MaterialRequest;

use Illuminate\Foundation\Http\FormRequest;

class MaterialRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'lesson_id' => 'required|exists:lessons,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:file,video,link',
            'file_path' => 'nullable|string',  // Lưu link hoặc đường dẫn file upload
        ];
    }

    public function messages()
    {
        return [
            'lesson_id.required' => 'Bài học là bắt buộc.',
            'lesson_id.exists' => 'Bài học không tồn tại.',
            'title.required' => 'Tiêu đề là bắt buộc.',
            'type.required' => 'Loại tài liệu là bắt buộc.',
            'type.in' => 'Loại tài liệu phải là file, video hoặc link.',
        ];
    }
}