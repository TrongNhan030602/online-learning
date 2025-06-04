<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogImage extends Model
{
    use HasFactory;
    protected $table = 'blog_images';

    protected $fillable = ['blog_id', 'image', 'caption', 'order'];

    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }
}