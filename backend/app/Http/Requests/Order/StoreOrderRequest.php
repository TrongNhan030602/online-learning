<?php

namespace App\Http\Requests\Order;

use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Auth\Access\AuthorizationException;

class StoreOrderRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có được phép gửi request này không.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === RoleEnum::Student;
    }



    /**
     * Quy tắc validation cho request.
     */
    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.course_id' => 'required|exists:courses,id|unique:enrollments,course_id,NULL,id,user_id,' . auth()->id(),
            'payment_method' => 'required|string|in:paypal,credit_card',
            'coupon_id' => 'nullable|exists:coupons,id',
        ];
    }

    /**
     * Tùy chỉnh thông báo lỗi.
     */
    public function messages(): array
    {
        return [
            'items.required' => 'Danh sách khóa học không được để trống.',
            'items.array' => 'Danh sách khóa học phải là một mảng.',
            'items.min' => 'Phải có ít nhất một khóa học.',
            'items.*.course_id.required' => 'Mỗi khóa học phải có một course_id.',
            'items.*.course_id.exists' => 'Khóa học không hợp lệ.',
            'items.*.course_id.unique' => 'Bạn đã đăng ký khóa học này rồi.',
            'payment_method.required' => 'Phương thức thanh toán là bắt buộc.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',
            'coupon_id.exists' => 'Mã giảm giá không hợp lệ.',
        ];
    }
}