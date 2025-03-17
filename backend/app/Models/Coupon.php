<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'discount', 'expires_at', 'usage_limit', 'times_used'];



    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',


        ];
    }
    public function isExpired()
    {
        return $this->expires_at->isPast();
    }
}