<?php

namespace App\Repositories;

use App\Interfaces\ReviewRepositoryInterface;
use App\Models\Review;

class ReviewRepository implements ReviewRepositoryInterface
{
    public function getAllReviews()
    {
        return Review::all();
    }

    public function approveReview($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['approved' => true]);
        return $review;
    }

    public function deleteReview($id)
    {
        $review = Review::findOrFail($id);
        return $review->delete();
    }
}