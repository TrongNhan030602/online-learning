<?php
namespace App\Repositories;

use App\Models\Order;
use App\Models\Coupon;
use App\Interfaces\OrderRepositoryInterface;

class OrderRepository implements OrderRepositoryInterface
{
    public function getAll()
    {
        return Order::with(['user', 'orderItems.course', 'transaction'])->orderBy('created_at', 'desc')->get();
    }

    public function findById($id)
    {
        return Order::with(['user', 'orderItems.course', 'transaction'])->findOrFail($id);
    }
    public function applyCoupon($orderId, $couponCode)
    {
        $order = Order::findOrFail($orderId);
        $coupon = Coupon::where('code', $couponCode)->where('expires_at', '>=', now())->first();

        if (!$coupon) {
            return response()->json(['message' => 'Invalid or expired coupon'], 400);
        }

        // Kiểm tra nếu đã áp dụng mã giảm giá trước đó
        if ($order->coupon_id) {
            return response()->json(['message' => 'Coupon already applied'], 400);
        }

        // Tính toán giá sau khi giảm
        $discount = ($coupon->discount_type === 'percentage')
            ? ($order->total_price * $coupon->discount_value / 100)
            : $coupon->discount_value;

        $order->update([
            'coupon_id' => $coupon->id,
            'total_price' => max(0, $order->total_price - $discount),
        ]);

        return $order;
    }

    public function create(array $data)
    {
        return Order::create($data);
    }

    public function update($id, array $data)
    {
        $order = Order::findOrFail($id);
        $order->update($data);
        return $order;
    }

    public function delete($id)
    {
        return Order::destroy($id);
    }
}