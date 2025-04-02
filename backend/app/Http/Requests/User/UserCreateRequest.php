<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UserCreateRequest extends FormRequest
{
    public function authorize()
    {
        // Nếu cần kiểm tra quyền, bạn có thể thêm logic ở đây.
        return true;
    }

    public function rules()
    {
        return [
            // Các trường thông tin người dùng
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:admin,student',

            // Các trường hồ sơ người dùng
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female',
            'position' => 'nullable|string|max:255',
            'info' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Trường tên không được bỏ trống.',
            'email.required' => 'Trường email không được bỏ trống.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'password.required' => 'Trường mật khẩu không được bỏ trống.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
            'role.required' => 'Trường vai trò không được bỏ trống.',
            'first_name.required' => 'Trường tên đầu tiên không được bỏ trống.',
            'last_name.required' => 'Trường tên cuối cùng không được bỏ trống.',
            'phone.string' => 'Số điện thoại phải là chuỗi.',
            'phone.max' => 'Số điện thoại không được vượt quá 15 ký tự.',
            'avatar.image' => 'Ảnh đại diện phải là hình ảnh.',
            'avatar.mimes' => 'Ảnh đại diện phải có định dạng jpeg, png, jpg, gif, svg.',
            'avatar.max' => 'Ảnh đại diện không được vượt quá 2MB.',
        ];
    }
}