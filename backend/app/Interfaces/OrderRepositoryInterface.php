<?php
namespace App\Interfaces;

interface OrderRepositoryInterface
{
    public function getAll();
    public function findById($id);
    public function update($id, array $data);
    public function delete($id);

    public function create($data);
    public function calculateTotalPrice($items);
    public function getItemsData($items);
    public function applyCoupon($couponId, $totalPrice);
    public function cancel($id);
    // Thanh toán
    public function checkout($id);
    public function confirmPayment($id, $paymentData);
    public function handlePaymentFailure($id);


}