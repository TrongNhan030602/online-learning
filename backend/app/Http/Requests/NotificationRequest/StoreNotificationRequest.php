<?php

namespace App\Http\Requests\NotificationRequest;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Đảm bảo người dùng có quyền thực hiện hành động này
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'training_program_id' => 'required|exists:training_programs,id',
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'nullable|string|in:exam,announcement,reminder', // Giới hạn giá trị của type
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'training_program_id' => 'ID chương trình đào tạo',
            'title' => 'Tiêu đề',
            'body' => 'Nội dung',
            'type' => 'Loại thông báo',
        ];
    }

    /**
     * Get custom validation error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'training_program_id.required' => 'ID chương trình đào tạo là bắt buộc.',
            'training_program_id.exists' => 'Chương trình đào tạo không tồn tại.',
            'title.required' => 'Tiêu đề là bắt buộc.',
            'title.string' => 'Tiêu đề phải là một chuỗi văn bản.',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
            'body.required' => 'Nội dung là bắt buộc.',
            'body.string' => 'Nội dung phải là một chuỗi văn bản.',
            'type.string' => 'Loại thông báo phải là một chuỗi văn bản.',
            'type.in' => 'Loại thông báo không hợp lệ. Chỉ được chọn "exam", "announcement" hoặc "reminder".',
        ];
    }
}