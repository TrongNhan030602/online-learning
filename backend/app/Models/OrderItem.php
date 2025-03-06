<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'course_id',
        'price',
    ];

    /**
     * Mối quan hệ N - 1: Chi tiết đơn hàng thuộc về một đơn hàng
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Mối quan hệ N - 1: Chi tiết đơn hàng thuộc về một khóa học
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}