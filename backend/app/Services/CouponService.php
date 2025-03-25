<?php

namespace App\Services;

use App\Interfaces\CouponRepositoryInterface;
use Carbon\Carbon;

class CouponService
{
    protected $couponRepository;

    public function __construct(CouponRepositoryInterface $couponRepository)
    {
        $this->couponRepository = $couponRepository;
    }

    public function getAllCoupons()
    {
        return $this->couponRepository->getAll();
    }

    public function getCouponById($id)
    {
        return $this->couponRepository->findById($id);
    }

    public function createCoupon($data)
    {
        return $this->couponRepository->create([
            'code' => $data['code'],
            'discount' => $data['discount'],
            'expires_at' => $data['expires_at'],
            'usage_limit' => $data['usage_limit'] ?? null, // Có thể null (vô hạn)
            'times_used' => 0 // Mới tạo -> chưa sử dụng
        ]);
    }

    public function updateCoupon($id, $data)
    {
        return $this->couponRepository->update($id, [
            'code' => $data['code'],
            'discount' => $data['discount'],
            'expires_at' => $data['expires_at'],
            'usage_limit' => $data['usage_limit'] ?? null,
        ]);
    }

    public function validateCoupon($code)
    {
        $coupon = $this->couponRepository->applyCoupon($code);

        if (!$coupon) {
            throw new \Exception('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        }

        return $coupon;
    }


    public function deleteCoupon($id)
    {
        return $this->couponRepository->delete($id);
    }

    public function getActiveCoupons()
    {
        $coupons = $this->couponRepository->getActiveCoupons();

        \Log::info('Dữ liệu mã giảm giá còn hạn:', ['coupons' => $coupons->toArray()]);

        return $coupons;
    }



    public function applyCouponForOrder($code)
    {
        $coupon = $this->couponRepository->applyCouponForOrder($code);

        if (!$coupon) {
            throw new \Exception('Mã giảm giá không hợp lệ, đã hết hạn hoặc đã đạt giới hạn sử dụng.');
        }

        return $coupon;
    }


    public function resetUsage($id)
    {
        return $this->couponRepository->resetUsage($id);
    }

}