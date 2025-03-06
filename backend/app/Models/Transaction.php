<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'transaction_id',
        'payment_status',
        'payment_provider',
    ];

    /**
     * Mối quan hệ 1 - 1: Giao dịch thuộc về một đơn hàng
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}