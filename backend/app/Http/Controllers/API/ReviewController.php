<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ReviewService;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function index()
    {
        return response()->json($this->reviewService->getAllReviews());
    }

    public function approve($id)
    {
        return response()->json($this->reviewService->approveReviewById($id));
    }

    public function destroy($id)
    {
        $this->reviewService->deleteReviewById($id);
        return response()->json(['message' => 'Review deleted successfully']);
    }
}