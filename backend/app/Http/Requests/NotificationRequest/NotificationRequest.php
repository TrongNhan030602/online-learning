<?php

namespace App\Http\Requests\NotificationRequest;

use Illuminate\Foundation\Http\FormRequest;

class NotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'nullable|string|in:Alert,Reminder,General', // Giới hạn loại thông báo
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'ID người dùng là bắt buộc.',
            'user_id.exists' => 'ID người dùng không tồn tại.',
            'title.required' => 'Tiêu đề thông báo là bắt buộc.',
            'title.string' => 'Tiêu đề thông báo phải là một chuỗi ký tự.',
            'title.max' => 'Tiêu đề thông báo không được vượt quá 255 ký tự.',
            'body.required' => 'Nội dung thông báo là bắt buộc.',
            'body.string' => 'Nội dung thông báo phải là một chuỗi ký tự.',
            'type.string' => 'Loại thông báo phải là một chuỗi ký tự.',
            'type.in' => 'Loại thông báo phải là một trong các giá trị: Alert, Reminder, General.', // Thông báo lỗi khi loại không hợp lệ
        ];
    }
}