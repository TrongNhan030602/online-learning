<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\CertificateService;
use App\Http\Requests\CertificateRequest\CertificateRequest;

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
            ], 201); // Mã trạng thái HTTP: 201 Created
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi cấp bằng/chứng chỉ.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    // Xem chi tiết chứng chỉ
    public function show($id): JsonResponse
    {
        try {
            $certificate = $this->service->getCertificateDetail($id);

            if (!$certificate) {
                return response()->json([
                    'message' => 'Không tìm thấy chứng chỉ với ID ' . $id
                ], 404); // Không tìm thấy chứng chỉ, trả về 404 Not Found
            }

            return response()->json([
                'data' => $certificate
            ], 200); // Mã trạng thái HTTP: 200 OK
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy chi tiết chứng chỉ.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }

    // Xem danh sách chứng chỉ theo học viên
    public function studentCertificates($studentId): JsonResponse
    {
        try {
            $certificates = $this->service->getStudentCertificates($studentId);

            if ($certificates->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy chứng chỉ cho học viên với ID ' . $studentId
                ], 404); // Không tìm thấy chứng chỉ cho học viên, trả về 404 Not Found
            }

            return response()->json([
                'data' => $certificates
            ], 200); // Mã trạng thái HTTP: 200 OK
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi lấy danh sách chứng chỉ của học viên.',
                'error' => $e->getMessage()
            ], 500); // Mã trạng thái HTTP: 500 Internal Server Error
        }
    }
}