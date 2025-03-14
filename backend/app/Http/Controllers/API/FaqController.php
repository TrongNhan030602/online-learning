<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Faq\FaqRequest;
use App\Http\Requests\Faq\FaqUpdateRequest;
use App\Services\FaqService;
use Illuminate\Http\JsonResponse;
use Exception;

class FaqController extends Controller
{
    protected $faqService;

    public function __construct(FaqService $faqService)
    {
        $this->faqService = $faqService;
    }

    // Lấy danh sách tất cả câu hỏi thường gặp
    public function index(): JsonResponse
    {
        try {
            $faqs = $this->faqService->getAll();
            return response()->json(['data' => $faqs], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi khi lấy danh sách FAQ!', 'message' => $e->getMessage()], 500);
        }
    }
    // Lấy chi tiết một câu hỏi theo ID
    public function show($id): JsonResponse
    {
        try {
            $faq = $this->faqService->getById($id);

            if (!$faq) {
                return response()->json(['message' => 'Câu hỏi không tồn tại'], 404);
            }

            return response()->json(['data' => $faq], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi khi lấy chi tiết câu hỏi!', 'message' => $e->getMessage()], 500);
        }
    }

    // Lọc theo danh mục
    public function getByCategory(string $category): JsonResponse
    {
        try {
            $faqs = $this->faqService->getByCategory($category);
            return response()->json(['data' => $faqs], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi khi lọc FAQ theo danh mục!', 'message' => $e->getMessage()], 500);
        }
    }

    // Lọc theo trạng thái
    public function getByStatus(int $status): JsonResponse
    {
        try {
            $faqs = $this->faqService->getByStatus($status);
            return response()->json(['data' => $faqs], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi khi lọc FAQ theo trạng thái!', 'message' => $e->getMessage()], 500);
        }
    }

    // Tạo mới FAQ
    public function store(FaqRequest $request): JsonResponse
    {
        try {
            $faq = $this->faqService->createFaq($request->validated());
            return response()->json(['message' => 'FAQ đã được tạo!', 'faq' => $faq], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi khi tạo FAQ!', 'message' => $e->getMessage()], 500);
        }
    }

    // Cập nhật FAQ
    public function update(FaqUpdateRequest $request, int $id): JsonResponse
    {
        try {
            $faq = $this->faqService->updateFaq($id, $request->validated());
            return response()->json(['message' => 'FAQ đã được cập nhật!', 'faq' => $faq], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi khi cập nhật FAQ!', 'message' => $e->getMessage()], 500);
        }
    }

    // Xóa FAQ
    public function destroy(int $id): JsonResponse
    {
        try {
            if ($this->faqService->deleteFaq($id)) {
                return response()->json(['message' => 'FAQ đã bị xóa!'], 200);
            }
            return response()->json(['error' => 'Không tìm thấy FAQ!'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Lỗi khi xóa FAQ!', 'message' => $e->getMessage()], 500);
        }
    }
}