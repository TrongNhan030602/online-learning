<?php return [
    'mode' => env('PAYPAL_MODE', 'sandbox'), // 'sandbox' hoặc 'live'
    'sandbox' => [
        'client_id' => env('PAYPAL_SANDBOX_CLIENT_ID'),
        'client_secret' => env('PAYPAL_SANDBOX_CLIENT_SECRET'),
        'base_url' => 'https://api.sandbox.paypal.com',
    ],
    'live' => [
        'client_id' => env('PAYPAL_LIVE_CLIENT_ID'),
        'client_secret' => env('PAYPAL_LIVE_CLIENT_SECRET'),
        'base_url' => 'https://api.paypal.com',
    ],
    'currency' => 'USD', // Đơn vị tiền tệ mặc định
];