<?php
namespace App\Interfaces;


interface CouponRepositoryInterface
{
    public function getAll();
    public function findById($id);
    public function findByCode($code);
    public function create(array $data);
    public function update($id, array $data);
    public function applyCoupon($code);
    public function delete($id);
    public function getActiveCoupons();
    public function applyCouponForOrder($code);
    public function resetUsage($id);

}