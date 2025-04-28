<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CertificateRequest;
use App\Services\CertificateService;
use Exception;
use Illuminate\Http\JsonResponse;

class CertificateController extends Controller
{
    protected $service;

    public function __construct(CertificateService $service)
    {
        $this->service = $service;
    }

    // Cấp bằng/chứng chỉ
    public function store(CertificateRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $certificate = $this->service->issueCertificate($data);

            return response()->json([
                'message' => 'Cấp bằng/chứng chỉ thành công',
                'data' => $certificate
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi cấp bằng/chứng chỉ.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xem chi tiết chứng chỉ
    public function show($id): JsonResponse
    {
        try {
            $certificate = $this->service->getCertificateDetail($id);

            return response()->json([
                'data' => $certificate
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy chứng chỉ.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Xem danh sách chứng chỉ theo học viên
    public function studentCertificates($studentId): JsonResponse
    {
        try {
            $certificates = $this->service->getStudentCertificates($studentId);

            return response()->json([
                'data' => $certificates
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy chứng chỉ.',
                'error' => $e->getMessage()
            ], 404);
        }
    }


}