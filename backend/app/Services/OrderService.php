<?php
namespace App\Services;

use App\Interfaces\OrderRepositoryInterface;
use Exception;

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

    public function cancelOrder($id)
    {
        return $this->orderRepository->cancel($id);
    }

    public function checkout($id)
    {
        return $this->orderRepository->checkout($id);
    }

    public function confirmPayment($id, $paymentData)
    {
        return $this->orderRepository->confirmPayment($id, $paymentData);
    }

    public function handlePaymentFailure($id)
    {
        return $this->orderRepository->handlePaymentFailure($id);
    }



}