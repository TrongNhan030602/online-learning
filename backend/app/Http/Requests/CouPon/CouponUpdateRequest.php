<?php

namespace App\Http\Requests\CouPon;

use Illuminate\Foundation\Http\FormRequest;

class CouponUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'code' => 'sometimes|string|unique:coupons,code,' . $this->route('id'),
            'discount' => 'sometimes|numeric|min:0|max:100',
            'expires_at' => 'sometimes|date|after:today',
            'usage_limit' => 'sometimes|integer|min:1',
            'usage_count' => 'sometimes|integer|min:0',
        ];
    }

    public function messages()
    {
        return [
            'code.unique' => 'Mã giảm giá đã tồn tại.',
            'discount.numeric' => 'Giá trị giảm giá phải là số.',
            'discount.min' => 'Giảm giá không được nhỏ hơn 0%.',
            'discount.max' => 'Giảm giá không được vượt quá 100%.',
            'expires_at.date' => 'Ngày hết hạn không hợp lệ.',
            'expires_at.after' => 'Ngày hết hạn phải lớn hơn hôm nay.',
            'usage_limit.integer' => 'Số lần sử dụng tối đa phải là số nguyên.',
            'usage_limit.min' => 'Số lần sử dụng tối đa phải lớn hơn 0.',
            'usage_count.integer' => 'Số lần sử dụng phải là số nguyên.',
            'usage_count.min' => 'Số lần sử dụng không thể nhỏ hơn 0.',
        ];
    }
}