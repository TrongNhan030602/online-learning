<?php
namespace App\Repositories;

use App\Models\Coupon;
use App\Interfaces\CouponRepositoryInterface;

class CouponRepository implements CouponRepositoryInterface
{
    public function getAll()
    {
        return Coupon::orderBy('created_at', 'desc')->get();
    }

    public function findById($id)
    {
        return Coupon::findOrFail($id);
    }

    public function create(array $data)
    {
        return Coupon::create($data);
    }

    public function update($id, array $data)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update($data);
        return $coupon;
    }
    public function applyCoupon($code)
    {
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return null;
        }

        // Kiểm tra ngày hết hạn
        if ($coupon->expires_at < now()) {
            return null;
        }

        // Kiểm tra giới hạn sử dụng
        if ($coupon->usage_limit !== null && $coupon->times_used >= $coupon->usage_limit) {
            return null;
        }

        // Cập nhật số lần sử dụng
        $coupon->increment('times_used');

        return $coupon;
    }


    public function delete($id)
    {
        return Coupon::destroy($id);
    }

    public function findByCode($code)
    {
        return Coupon::where('code', $code)->first();
    }
    public function getActiveCoupons()
    {
        $now = now();
        \Log::info('Thời gian hiện tại:', ['now' => $now]);

        $coupons = Coupon::where('expires_at', '>=', $now)->get();

        \Log::info('Danh sách mã giảm giá còn hạn:', ['coupons' => $coupons->toArray()]);

        return $coupons;
    }




    public function applyCouponForOrder($code)
    {
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon || $coupon->expires_at < now() || ($coupon->usage_limit !== null && $coupon->times_used >= $coupon->usage_limit)) {
            return null;  // Không áp dụng mã giảm giá
        }

        // Tăng số lần sử dụng mã giảm giá
        $coupon->increment('times_used');

        return $coupon;  // Trả về mã giảm giá hoặc một đối tượng đã xử lý nếu cần
    }


    public function resetUsage($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update(['times_used' => 0]);
        return $coupon;
    }

}