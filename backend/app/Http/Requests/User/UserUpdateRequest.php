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
            // Chỉ cho phép cập nhật 'name'
            'name' => 'sometimes|required|string|max:255|unique:users,name,' . $userId,


            // Không cần validate email, role và password
            'email' => 'nullable|email|max:255|unique:users,email,' . $userId,  // email chỉ kiểm tra nếu có thay đổi
            'password' => 'nullable|min:6', // mật khẩu có thể thay đổi, nhưng không bắt buộc
            'role' => 'nullable|in:admin,student,advisor', // không yêu cầu cập nhật role

            // Các trường hồ sơ người dùng
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female,other',
            'position' => 'nullable|string|max:255',
            'info' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Trường tên không được bỏ trống khi cập nhật.',
            'name.unique' => 'Tên đã tồn tại, vui lòng chọn tên khác.',
            'name.string' => 'Trường tên phải là chuỗi.',
            'name.max' => 'Trường tên không được vượt quá 255 ký tự.',
            'email.email' => 'Trường email không hợp lệ.',
            'email.max' => 'Trường email không được vượt quá 255 ký tự.',
            'email.unique' => 'Email đã tồn tại, vui lòng chọn email khác.',
            'role.in' => 'Vai trò phải là admin hoặc student.',

            // Các thông báo lỗi cho hồ sơ người dùng
            'first_name.required' => 'Trường tên đầu tiên không được bỏ trống.',
            'first_name.string' => 'Tên đầu tiên phải là chuỗi.',
            'first_name.max' => 'Tên đầu tiên không được vượt quá 255 ký tự.',
            'last_name.required' => 'Trường tên cuối cùng không được bỏ trống.',
            'last_name.string' => 'Tên cuối cùng phải là chuỗi.',
            'last_name.max' => 'Tên cuối cùng không được vượt quá 255 ký tự.',
            'phone.string' => 'Số điện thoại phải là chuỗi.',
            'phone.max' => 'Số điện thoại không được vượt quá 15 ký tự.',
            'address.string' => 'Địa chỉ phải là chuỗi.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            'gender.in' => 'Giới tính phải là male hoặc female.',
            'position.string' => 'Vị trí phải là chuỗi.',
            'position.max' => 'Vị trí không được vượt quá 255 ký tự.',
            'avatar.image' => 'Ảnh đại diện phải là hình ảnh.',
            'avatar.mimes' => 'Ảnh đại diện phải có định dạng jpeg, png, jpg, gif, svg.',
            'avatar.max' => 'Ảnh đại diện không được vượt quá 2MB.',
        ];
    }
}