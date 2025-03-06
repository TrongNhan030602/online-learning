<?php

namespace App\Services;

use App\Interfaces\ReviewRepositoryInterface;

class ReviewService
{
    protected $reviewRepository;

    public function __construct(ReviewRepositoryInterface $reviewRepository)
    {
        $this->reviewRepository = $reviewRepository;
    }

    public function getAllReviews()
    {
        return $this->reviewRepository->getAllReviews();
    }

    public function approveReviewById($id)
    {
        return $this->reviewRepository->approveReview($id);
    }

    public function deleteReviewById($id)
    {
        return $this->reviewRepository->deleteReview($id);
    }
}