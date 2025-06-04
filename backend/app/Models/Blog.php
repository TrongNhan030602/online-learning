<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $table = 'blogs';

    protected $fillable = [
        'title',
        'content',
        'type',     // academy, industry
        'summary',       // tóm tắt
        'published_at',  // ngày xuất bản
        'status'         // trạng thái (draft, published)
    ];

    protected $dates = ['published_at']; // để tự động cast sang Carbon

    public function images()
    {
        return $this->hasMany(BlogImage::class);
    }
}