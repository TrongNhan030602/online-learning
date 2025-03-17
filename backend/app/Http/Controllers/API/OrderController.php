<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index()
    {
        $orders = $this->orderService->getAllOrders();
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = $this->orderService->getOrderById($id);
        return response()->json($order);
    }
    public function applyCoupon(Request $request, $orderId)
    {
        $validator = Validator::make($request->all(), [
            'coupon_code' => 'required|string|exists:coupons,code',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = $this->orderService->applyCouponToOrder($orderId, $request->coupon_code);
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,cancelled',
            'payment_method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = $this->orderService->createOrder($request->all());
        return response()->json($order, 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'total_price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:pending,paid,cancelled',
            'payment_method' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = $this->orderService->updateOrder($id, $request->all());
        return response()->json($order);
    }

    public function destroy($id)
    {
        $this->orderService->deleteOrder($id);
        return response()->json(['message' => 'Order deleted successfully']);
    }
}