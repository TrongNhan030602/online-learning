<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Exceptions\ApiExceptionHandler;
use App\Http\Requests\Order\StoreOrderRequest;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Lấy danh sách tất cả các đơn hàng
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $orders = $this->orderService->getAllOrders();
            return response()->json($orders);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    /**
     * Lấy chi tiết đơn hàng
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $order = $this->orderService->getOrderById($id);
            return response()->json($order);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    /**
     * Cập nhật thông tin đơn hàng
     *
     * @param  Request  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $updatedOrder = $this->orderService->updateOrder($id, $request->all());
            return response()->json($updatedOrder);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    /**
     * Tạo đơn hàng mới
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        if (auth()->user()->role !== RoleEnum::Student) {
            throw new AccessDeniedHttpException("Chỉ học viên mới có thể đăng ký khóa học.");
        }

        try {
            // Lấy ID của người dùng đang đăng nhập
            $data = $request->validated();
            $data['user_id'] = auth()->id();

            $order = $this->orderService->createOrder($data);
            return response()->json($order->load('orderItems.course'), 201);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }


    /**
     * Xóa đơn hàng
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->orderService->deleteOrder($id);
            return response()->json(['message' => 'Xóa đơn hàng thành công!']);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }

    /**
     * Hủy đơn hàng
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function cancel($id): JsonResponse
    {
        try {
            $this->orderService->cancelOrder($id);
            return response()->json(['message' => 'Đơn hàng đã được hủy thành công!']);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }



    /**
     * Tiến hành thanh toán
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function checkout($id): JsonResponse
    {
        try {
            $checkout = $this->orderService->checkout($id);
            return response()->json($checkout);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }
    /**
     * Xác nhận thanh toán
     *
     * @param  Request  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function confirmPayment(Request $request, $id): JsonResponse
    {
        try {
            $paymentConfirmation = $this->orderService->confirmPayment($id, $request->all());
            return response()->json($paymentConfirmation);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }
    /**
     * Xử lý lỗi thanh toán
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function handlePaymentFailure($id): JsonResponse
    {
        try {
            $response = $this->orderService->handlePaymentFailure($id);
            return response()->json($response);
        } catch (Exception $e) {
            return ApiExceptionHandler::handle($e);
        }
    }
}