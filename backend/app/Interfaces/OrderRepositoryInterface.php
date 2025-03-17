<?php
namespace App\Interfaces;

interface OrderRepositoryInterface
{
    public function getAll();
    public function findById($id);
    public function applyCoupon($orderId, $couponCode);

    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}