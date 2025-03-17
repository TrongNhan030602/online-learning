<?php
namespace App\Services;

use App\Interfaces\OrderRepositoryInterface;

class OrderService
{
    protected $orderRepository;

    public function __construct(OrderRepositoryInterface $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    public function getAllOrders()
    {
        return $this->orderRepository->getAll();
    }
    public function applyCouponToOrder($orderId, $couponCode)
    {
        return $this->orderRepository->applyCoupon($orderId, $couponCode);
    }

    public function getOrderById($id)
    {
        return $this->orderRepository->findById($id);
    }

    public function createOrder($data)
    {
        return $this->orderRepository->create($data);
    }

    public function updateOrder($id, $data)
    {
        return $this->orderRepository->update($id, $data);
    }

    public function deleteOrder($id)
    {
        return $this->orderRepository->delete($id);
    }
}