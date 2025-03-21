<?php
namespace App\Http\Requests\UserProfile;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function rules()
    {
        return [
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'max:32',
                'regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/',
                'confirmed',  // Thêm xác nhận mật khẩu mới
            ],
        ];
    }

    public function authorize()
    {
        return true;  // Cho phép tất cả các yêu cầu
    }

    public function messages()
    {
        return [
            'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại.',
            'new_password.required' => 'Mật khẩu mới không được để trống.',
            'new_password.string' => 'Mật khẩu mới phải là một chuỗi.',
            'new_password.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
            'new_password.max' => 'Mật khẩu mới không được vượt quá 32 ký tự.',
            'new_password.regex' => 'Mật khẩu mới phải chứa ít nhất một chữ in hoa, một số và một ký tự đặc biệt.',
            'new_password.confirmed' => 'Xác nhận mật khẩu mới không khớp.',
        ];
    }
}