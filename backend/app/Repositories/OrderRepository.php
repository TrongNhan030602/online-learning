<?php
namespace App\Repositories;

use Exception;
use App\Models\Order;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\OrderItem;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
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

    public function create($data)
    {
        DB::beginTransaction();
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!isset($data['user_id'], $data['items']) || !is_array($data['items']) || empty($data['items'])) {
                throw new Exception("Dữ liệu không hợp lệ.");
            }

            // Lặp qua danh sách khóa học và tính tổng giá
            $totalPrice = $this->calculateTotalPrice($data['items']);
            $itemsData = $this->getItemsData($data['items']);

            // Áp dụng giảm giá nếu có coupon
            $couponDiscount = 0;
            $couponId = null;

            if (!empty($data['coupon_id'])) {
                list($couponDiscount, $couponId) = $this->applyCoupon($data['coupon_id'], $totalPrice);
            }

            // Tính tổng giá sau giảm giá
            $finalPrice = $totalPrice - $couponDiscount;

            // Tạo đơn hàng
            $order = Order::create([
                'user_id' => $data['user_id'],
                'total_price' => $finalPrice,  // Lưu tổng giá trị đã giảm
                'status' => 'pending',
                'payment_method' => $data['payment_method'] ?? 'paypal',
                'coupon_id' => $couponId,
            ]);

            // Lặp qua danh sách khóa học và thêm vào order_items
            foreach ($itemsData as $item) {
                // Tính giảm giá cho từng item nếu có coupon
                $itemPrice = $item['price'];
                $itemDiscount = 0;

                if ($couponDiscount > 0) {
                    // Tính giảm giá cho từng khóa học dựa trên tỷ lệ giảm của coupon
                    $itemDiscount = ($couponDiscount * $itemPrice) / $totalPrice;
                    $itemPriceAfterDiscount = $itemPrice - $itemDiscount;
                } else {
                    $itemPriceAfterDiscount = $itemPrice;
                }

                // Đảm bảo làm tròn số tiền cho từng item và lưu
                $formattedItemPrice = number_format($itemPriceAfterDiscount, 2, '.', '');
                OrderItem::create([
                    'order_id' => $order->id,
                    'course_id' => $item['course_id'],
                    'price' => $formattedItemPrice,  // Làm tròn 2 chữ số sau dấu thập phân
                ]);
            }

            DB::commit();
            return $order;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Lỗi khi tạo đơn hàng: " . $e->getMessage());
        }
    }

    // Tính tổng giá trị các khóa học
    public function calculateTotalPrice($items)
    {
        $totalPrice = 0;
        foreach ($items as $item) {
            $course = Course::find($item['course_id']);
            if (!$course) {
                throw new Exception("Khóa học ID {$item['course_id']} không tồn tại.");
            }
            $totalPrice += $course->price;
        }
        return $totalPrice;
    }

    // Lấy dữ liệu các khóa học
    public function getItemsData($items)
    {
        $itemsData = [];
        foreach ($items as $item) {
            $course = Course::find($item['course_id']);
            $itemsData[] = ['course_id' => $course->id, 'price' => $course->price];
        }
        return $itemsData;
    }

    // Áp dụng mã giảm giá
    public function applyCoupon($couponId, $totalPrice)
    {
        $couponDiscount = 0;
        $coupon = Coupon::where('id', $couponId)
            ->where('expires_at', '>=', now()) // Kiểm tra xem mã giảm giá có còn hiệu lực không
            ->whereColumn('times_used', '<', 'usage_limit') // Kiểm tra xem mã giảm giá có còn lượt sử dụng không
            ->first();

        if ($coupon) {
            // Tính giảm giá
            $couponDiscount = ($totalPrice * $coupon->discount) / 100;
            $couponDiscount = min($couponDiscount, $totalPrice); // Đảm bảo giảm giá không vượt quá tổng giá trị đơn hàng

            // Cập nhật số lần sử dụng mã giảm giá
            $coupon->increment('times_used'); // Cập nhật số lần đã dùng
            return [$couponDiscount, $coupon->id];
        }

        return [$couponDiscount, null];
    }

    public function update($id, array $data)
    {
        $order = Order::findOrFail($id);
        $order->update($data);
        return $order;
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $order = Order::with(['orderItems', 'coupon', 'transaction'])->findOrFail($id);

            // Kiểm tra trạng thái đơn hàng
            if ($order->status === 'completed') {
                throw new Exception('Cannot delete a completed order.');
            }

            if ($order->status === 'processing') {
                throw new Exception('Cannot delete a processing order.');
            }

            // Nếu đơn hàng đang ở trạng thái 'pending' hoặc 'cancel', có thể xóa
            if ($order->status === 'pending') {
                // Trả lại số lần sử dụng mã giảm giá nếu có
                if ($order->coupon) {
                    $order->coupon->decrement('times_used');
                }

                // Xóa các mục trong OrderItem
                foreach ($order->orderItems as $orderItem) {
                    $orderItem->delete();
                }

                // Xóa giao dịch nếu có
                if ($order->transaction) {
                    $order->transaction->delete();
                }

                // Xóa đơn hàng
                $order->delete();
            } elseif ($order->status === 'cancel') {
                // Nếu đơn hàng đã hủy, có thể xóa
                // Xóa các mục trong OrderItem
                foreach ($order->orderItems as $orderItem) {
                    $orderItem->delete();
                }

                // Xóa giao dịch nếu có
                if ($order->transaction) {
                    $order->transaction->delete();
                }

                // Xóa đơn hàng
                $order->delete();
            }

            DB::commit();
            return true; // Đã xóa thành công
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception("Lỗi khi xóa đơn hàng: " . $e->getMessage());
        }
    }


    public function cancel($id)
    {
        $order = Order::findOrFail($id);
        if ($order->status === 'paid') {
            throw new Exception('Cannot cancel a paid order.');
        }
        $order->update(['status' => 'canceled']);
        return $order;
    }

    // **Xử lý thanh toán**
    public function checkout($id)
    {
        try {
            $order = Order::findOrFail($id);

            if ($order->status !== 'pending') {
                throw new Exception("Đơn hàng không hợp lệ để thanh toán.");
            }

            \Log::info("Bắt đầu thanh toán cho đơn hàng #{$order->id}");

            // Tạo transaction_id ngẫu nhiên
            $transactionId = 'TXN' . time() . rand(1000, 9999);

            // Tạo transaction
            $transaction = Transaction::create([
                'order_id' => $order->id,
                'transaction_id' => $transactionId, // BẮT BUỘC phải có
                'payment_provider' => $order->payment_method,
                'payment_status' => 'pending', // Mặc định trạng thái chờ
            ]);

            \Log::info("Tạo transaction thành công: ", ['transaction_id' => $transaction->transaction_id]);

            return [
                'message' => 'Đang xử lý thanh toán',
                'transaction_id' => $transaction->transaction_id
            ];

        } catch (Exception $e) {
            \Log::error("Checkout Error: " . $e->getMessage());
            throw $e;
        }
    }



    public function confirmPayment($id, $paymentData)
    {
        try {
            $order = Order::findOrFail($id);
            $transaction = Transaction::where('order_id', $id)
                ->where('transaction_id', $paymentData['transaction_id'])
                ->firstOrFail();

            if ($order->status !== 'pending') {
                throw new Exception("Đơn hàng đã được xử lý trước đó.");
            }

            // Cập nhật trạng thái giao dịch & đơn hàng
            $transaction->update(['payment_status' => 'success']);
            $order->update(['status' => 'completed']);

            return [
                'message' => 'Thanh toán thành công',
                'order' => $order
            ];
        } catch (Exception $e) {
            \Log::error("Lỗi xác nhận thanh toán: " . $e->getMessage());
            return response()->json([
                'error' => 'Lỗi hệ thống!',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function handlePaymentFailure($id)
    {
        $order = Order::findOrFail($id);
        $transaction = Transaction::where('order_id', $id)->firstOrFail();

        $transaction->update(['status' => 'failed']);
        $order->update(['status' => 'failed']);

        return ['message' => 'Thanh toán thất bại'];
    }
}