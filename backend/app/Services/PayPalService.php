<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class PayPalService
{
    private $client;
    private $baseUrl;
    private $clientId;
    private $clientSecret;

    public function __construct()
    {
        $this->client = new Client();
        $this->baseUrl = config('paypal.sandbox.base_url');  // Lấy base_url trực tiếp từ cấu hình
        $this->clientId = config('paypal.sandbox.client_id');  // Lấy client_id từ sandbox
        $this->clientSecret = config('paypal.sandbox.client_secret');  // Lấy client_secret từ sandbox

        // Kiểm tra baseUrl
        if (empty($this->baseUrl)) {
            Log::error("Base URL is empty!");
        } else {
            Log::info("Base URL: {$this->baseUrl}");
        }
    }

    // Tạo thanh toán PayPal
    public function createPayment($order)
    {
        try {
            // Lấy Access Token
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                Log::error("Access token not retrieved.");
                return null;
            }

            // Tỷ giá VND sang USD (1 USD = 25,619.94 VND)
            $vndToUsdRate = 1 / 25619.94;  // Chuyển tỷ giá thành hệ số chuyển đổi
            $priceInUsd = $order->total_price * $vndToUsdRate;  // Chuyển đổi từ VND sang USD

            // Debug request data
            Log::info("Create Payment request data: " . json_encode([
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'amount' => [
                            'currency_code' => 'USD',  // Thanh toán bằng USD
                            'value' => number_format($priceInUsd, 2, '.', '')  // Đảm bảo định dạng số đúng
                        ]
                    ]
                ]
            ]));

            $response = $this->client->post("{$this->baseUrl}/v2/checkout/orders", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    'intent' => 'CAPTURE',
                    'purchase_units' => [
                        [
                            'amount' => [
                                'currency_code' => 'USD',  // Thanh toán bằng USD
                                'value' => number_format($priceInUsd, 2, '.', '')  // Đảm bảo định dạng số đúng
                            ]
                        ]
                    ],
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            // Debug response
            Log::info("Create payment response: " . json_encode($data));

            return $data['links'][1]['href'] ?? null;
        } catch (\Exception $e) {
            Log::error('PayPal createPayment error: ' . $e->getMessage());
            return null;
        }
    }

    // Xác minh thanh toán PayPal
    public function verifyPayment($transactionId)
    {
        try {
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                Log::error("Access token not retrieved.");
                return false;
            }

            $response = $this->client->get("{$this->baseUrl}/v2/checkout/orders/{$transactionId}", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Content-Type' => 'application/json'
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            Log::info("Verify payment response: " . json_encode($data));

            return $data['status'] === 'COMPLETED';
        } catch (\Exception $e) {
            Log::error('PayPal verifyPayment error: ' . $e->getMessage());
            return false;
        }
    }

    // Lấy access token từ PayPal
    private function getAccessToken()
    {
        try {
            // Debug base URL for access token
            Log::info("Access token request URL: {$this->baseUrl}/v1/oauth2/token");

            // Gửi yêu cầu lấy access token
            $response = $this->client->post("{$this->baseUrl}/v1/oauth2/token", [
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode("{$this->clientId}:{$this->clientSecret}"),
                    'Content-Type' => 'application/x-www-form-urlencoded',
                ],
                'form_params' => [
                    'grant_type' => 'client_credentials'
                ]
            ]);

            // Debug response body
            $data = json_decode($response->getBody(), true);
            Log::info("Access token response: " . json_encode($data));

            return $data['access_token'] ?? null;
        } catch (\Exception $e) {
            Log::error('PayPal getAccessToken error: ' . $e->getMessage());
            return null;
        }
    }
}