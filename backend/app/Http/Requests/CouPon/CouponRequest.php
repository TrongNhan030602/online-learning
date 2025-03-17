<?php
namespace App\Http\Requests\CouPon;

use Illuminate\Foundation\Http\FormRequest;

class CouponRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Cho phép tất cả người dùng thực hiện request này
    }

    public function rules()
    {
        return [
            'code' => 'required|string|unique:coupons,code',
            'discount' => 'required|numeric|min:0|max:100',
            'expires_at' => 'required|date|after:today',
            'usage_limit' => 'required|integer|min:1', // Số lần sử dụng tối đa
            'usage_count' => 'integer|min:0', // Số lần đã sử dụng (mặc định là 0)
        ];
    }

    public function messages()
    {
        return [
            'code.required' => 'Vui lòng nhập mã giảm giá.',
            'code.unique' => 'Mã giảm giá đã tồn tại.',
            'discount.required' => 'Vui lòng nhập số tiền giảm giá.',
            'discount.numeric' => 'Giá trị giảm giá phải là số.',
            'discount.min' => 'Giảm giá không được nhỏ hơn 0%.',
            'discount.max' => 'Giảm giá không được vượt quá 100%.',
            'expires_at.required' => 'Vui lòng chọn ngày hết hạn.',
            'expires_at.date' => 'Ngày hết hạn không hợp lệ.',
            'expires_at.after' => 'Ngày hết hạn phải lớn hơn hôm nay.',
            'usage_limit.required' => 'Vui lòng nhập số lần sử dụng tối đa.',
            'usage_limit.integer' => 'Số lần sử dụng tối đa phải là số nguyên.',
            'usage_limit.min' => 'Số lần sử dụng tối đa phải lớn hơn 0.',
            'usage_count.integer' => 'Số lần sử dụng phải là số nguyên.',
            'usage_count.min' => 'Số lần sử dụng không thể nhỏ hơn 0.',
        ];
    }
}