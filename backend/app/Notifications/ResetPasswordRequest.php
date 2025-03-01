<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordRequest extends Notification implements ShouldQueue
{
    use Queueable;

    protected $token;
    protected $mailer;

    /**
     * Create a new notification instance.
     *
     * @param string $token
     * @param string $mailer
     */
    public function __construct($token, $mailer = 'smtp')
    {
        $this->token = $token;
        $this->mailer = $mailer; // Dynamic mailer selection
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {

        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        // Tạo URL reset password dùng frontend URL
        $url = $frontendUrl . '/reset-password/?token=' . $this->token;

        return (new MailMessage)
            ->mailer($this->mailer) // Specify which mailer to use
            ->from('admin@example.com', 'Online-Learning')
            ->line('Bạn đang nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.')
            ->action('Reset Password', $url)
            ->line('Nếu bạn không yêu cầu đặt lại mật khẩu, không cần hành động nào nữa.');
    }
}