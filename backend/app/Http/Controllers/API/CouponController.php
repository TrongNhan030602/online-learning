<?php

namespace App\Http\Controllers\API;

use App\Services\CouponService;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Controller;
use App\Http\Requests\CouPon\CouponRequest;
use App\Http\Requests\CouPon\CouponUpdateRequest;

class CouponController extends Controller
{
    protected $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    /**
     * Lấy danh sách mã giảm giá
     */
    public function index(): JsonResponse
    {
        try {
            $coupons = $this->couponService->getAllCoupons();
            return response()->json($coupons, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể lấy danh sách mã giảm giá.'], 500);
        }
    }

    /**
     * Lấy chi tiết mã giảm giá theo ID
     */
    public function show($id): JsonResponse
    {
        try {
            $coupon = $this->couponService->getCouponById($id);
            return response()->json($coupon, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không tìm thấy mã giảm giá.'], 404);
        }
    }

    /**
     * Tạo mới mã giảm giá
     */
    public function store(CouponRequest $request): JsonResponse
    {
        try {
            $coupon = $this->couponService->createCoupon($request->validated());
            return response()->json(['message' => 'Tạo mã giảm giá thành công!', 'data' => $coupon], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Lỗi khi tạo mã giảm giá.'], 500);
        }
    }

    /**
     * Cập nhật mã giảm giá
     */
    public function update(CouponUpdateRequest $request, $id): JsonResponse
    {
        try {
            $coupon = $this->couponService->updateCoupon($id, $request->validated());
            return response()->json(['message' => 'Cập nhật mã giảm giá thành công!', 'data' => $coupon], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Lỗi khi cập nhật mã giảm giá.'], 500);
        }
    }

    /**
     * Xóa mã giảm giá
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->couponService->deleteCoupon($id);
            return response()->json(['message' => 'Xóa mã giảm giá thành công!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể xóa mã giảm giá.'], 500);
        }
    }

    public function getActiveCoupons(): JsonResponse
    {
        try {
            $coupons = $this->couponService->getActiveCoupons();

            // Kiểm tra nếu dữ liệu rỗng
            if ($coupons->isEmpty()) {
                return response()->json(['error' => 'Không tìm thấy mã giảm giá. 999'], 404);
            }

            return response()->json($coupons, 200);
        } catch (\Exception $e) {
            \Log::error('Lỗi khi lấy danh sách mã giảm giá:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Không thể lấy danh sách mã giảm giá còn hạn.'], 500);
        }
    }


    public function applyCoupon($code): JsonResponse
    {
        try {
            $coupon = $this->couponService->applyCouponForOrder($code);
            return response()->json(['message' => 'Mã giảm giá hợp lệ!', 'data' => $coupon], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function resetUsage($id): JsonResponse
    {
        try {
            $this->couponService->resetUsage($id);
            return response()->json(['message' => 'Đã đặt lại số lần sử dụng mã giảm giá.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể đặt lại số lần sử dụng.'], 500);
        }
    }


}