<?php
namespace App\Http\Requests\UserProfile;


use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'phone' => 'nullable|string|regex:/^[0-9\-\+\s]+$/|min:10|max:15',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female,other',
            'position' => 'nullable|string|max:255',
            'info' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'first_name.max' => 'Họ không được vượt quá 100 ký tự.',
            'last_name.max' => 'Tên không được vượt quá 100 ký tự.',
            'phone.regex' => 'Số điện thoại không hợp lệ.',
            'phone.min' => 'Số điện thoại phải có ít nhất 10 số.',
            'phone.max' => 'Số điện thoại không được quá 15 số.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            'gender.in' => 'Giới tính chỉ có thể là Nam, Nữ hoặc Khác.',
            'position.max' => 'Chức vụ không được vượt quá 255 ký tự.',
            'info.max' => 'Giới thiệu bản thân không được quá 1000 ký tự.',
        ];
    }
}