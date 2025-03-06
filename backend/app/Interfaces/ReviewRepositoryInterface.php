<?php

namespace App\Interfaces;

interface ReviewRepositoryInterface
{
    public function getAllReviews();
    public function approveReview($id);
    public function deleteReview($id);
}