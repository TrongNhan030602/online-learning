<?php
namespace App\Repositories;

use Exception;
use App\Models\Order;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\OrderItem;
use App\Models\Enrollment;
use App\Models\Transaction;
use App\Services\PayPalService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Interfaces\OrderRepositoryInterface;

class OrderRepository implements OrderRepositoryInterface
{
    protected $paypalBaseUrl;
    protected $clientId;
    protected $clientSecret;

    public function __construct()
    {
        $this->paypalBaseUrl = config('services.paypal.base_url');
        $this->clientId = config('services.paypal.client_id');
        $this->clientSecret = config('services.paypal.client_secret');
    }
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
    public function checkout($orderId)
    {
        $order = Order::findOrFail($orderId);

        if ($order->status !== 'pending') {
            return ['status' => 'error', 'message' => 'Đơn hàng không hợp lệ hoặc đã được xử lý.'];
        }

        try {
            // Gửi yêu cầu tạo thanh toán đến PayPal
            $paypalService = new PayPalService();
            $paymentUrl = $paypalService->createPayment($order);

            if ($paymentUrl) {
                // Lưu giao dịch ngay từ đầu
                Transaction::create([
                    'order_id' => $order->id,
                    'transaction_id' => null, // PayPal có thể chưa trả transaction ID
                    'payment_status' => 'pending',
                    'payment_provider' => 'paypal',
                ]);

                return ['status' => 'success', 'redirect_url' => $paymentUrl];
            }

            return ['status' => 'error', 'message' => 'Không thể tạo thanh toán PayPal.'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => 'Lỗi hệ thống: ' . $e->getMessage()];
        }
    }

    // **Xác nhận thanh toán**
    public function confirmPayment($orderId, $paymentData)
    {
        $order = Order::findOrFail($orderId);
        $transaction = Transaction::where('order_id', $order->id)->first();

        if (!$transaction || $transaction->payment_status !== 'pending') {
            return ['status' => 'error', 'message' => 'Giao dịch không hợp lệ hoặc đã được xử lý.'];
        }

        try {
            // Xác minh thanh toán với PayPal
            $paypalService = new PayPalService();
            $isValid = $paypalService->verifyPayment($paymentData['transaction_id']);

            if ($isValid) {
                DB::beginTransaction(); // 🔥 Bắt đầu transaction để đảm bảo tính nhất quán

                // ✅ Cập nhật đơn hàng
                $order->update([
                    'status' => 'completed',
                    'payment_method' => 'paypal',
                ]);

                // ✅ Cập nhật giao dịch
                $transaction->update([
                    'transaction_id' => $paymentData['transaction_id'],
                    'payment_status' => 'success',
                ]);

                // ✅ Lấy danh sách khóa học từ order_items và ghi danh học viên
                $orderItems = OrderItem::where('order_id', $order->id)->get();

                foreach ($orderItems as $item) {
                    Enrollment::create([
                        'user_id' => $order->user_id,
                        'course_id' => $item->course_id,
                        'order_id' => $order->id,
                    ]);
                }

                DB::commit(); // 🔥 Xác nhận transaction

                return ['status' => 'success', 'message' => 'Thanh toán thành công! Học viên đã được ghi danh vào các khóa học.'];
            } else {
                return $this->handlePaymentFailure($orderId);
            }
        } catch (\Exception $e) {
            DB::rollBack(); // 🔥 Hoàn tác nếu có lỗi
            return ['status' => 'error', 'message' => 'Lỗi hệ thống: ' . $e->getMessage()];
        }
    }

    // **Xử lý thanh toán thất bại**
    public function handlePaymentFailure($orderId)
    {
        try {
            $order = Order::findOrFail($orderId);
            $transaction = Transaction::where('order_id', $order->id)->first();

            DB::beginTransaction();

            if ($transaction) {
                $transaction->update([
                    'payment_status' => 'failed',
                ]);
            }

            $order->update([
                'status' => 'cancelled',
            ]);

            DB::commit();

            return ['status' => 'error', 'message' => 'Thanh toán thất bại. Đơn hàng đã bị hủy.'];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['status' => 'error', 'message' => 'Lỗi hệ thống: ' . $e->getMessage()];
        }
    }




}