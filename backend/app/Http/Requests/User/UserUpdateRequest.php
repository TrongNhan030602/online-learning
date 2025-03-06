<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize()
    {
        // Nếu cần kiểm tra quyền, bạn có thể thêm logic ở đây.
        return true;
    }

    public function rules()
    {
        // Lấy ID của người dùng từ route (giả sử route parameter là 'id')
        $userId = $this->route('id');

        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $userId,

            'role' => 'sometimes|required|in:admin,student',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Trường tên không được bỏ trống khi cập nhật.',
            'name.string' => 'Trường tên phải là chuỗi.',
            'name.max' => 'Trường tên không được vượt quá 255 ký tự.',
            'email.required' => 'Trường email không được bỏ trống khi cập nhật.',
            'email.email' => 'Trường email không hợp lệ.',
            'email.max' => 'Trường email không được vượt quá 255 ký tự.',
            'email.unique' => 'Email đã tồn tại, vui lòng chọn email khác.',
            'role.required' => 'Trường vai trò không được bỏ trống khi cập nhật.',
            'role.in' => 'Vai trò phải là admin hoặc student.',
        ];
    }
}