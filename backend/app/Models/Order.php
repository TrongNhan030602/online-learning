<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_price',
        'status',
        'payment_method',
        'coupon_id'
    ];

    /**
     * Mối quan hệ N - 1: Đơn hàng thuộc về một người dùng
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mối quan hệ 1 - N: Đơn hàng có nhiều chi tiết đơn hàng (khóa học)
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Mối quan hệ 1 - 1: Đơn hàng có một giao dịch thanh toán
     */
    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

}