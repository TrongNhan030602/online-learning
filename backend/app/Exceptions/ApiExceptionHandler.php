<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ApiExceptionHandler
{
    /**
     * Xử lý lỗi và trả về phản hồi JSON.
     *
     * @param  Exception  $e
     * @return JsonResponse
     */
    public static function handle(Exception $e): JsonResponse
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'error' => 'Lỗi xác thực dữ liệu!',
                'message' => $e->errors()
            ], 422);
        }

        if ($e instanceof ModelNotFoundException) {
            return response()->json([
                'error' => 'Không tìm thấy dữ liệu!',
                'message' => 'Dữ liệu bạn yêu cầu không tồn tại.'
            ], 404);
        }

        if ($e instanceof NotFoundHttpException) {
            return response()->json([
                'error' => 'Không tìm thấy trang!',
                'message' => 'Trang hoặc tài nguyên bạn yêu cầu không tồn tại.'
            ], 404);
        }

        return response()->json([
            'error' => 'Lỗi hệ thống!',
            'message' => 'Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại sau.'
        ], 500);
    }
}