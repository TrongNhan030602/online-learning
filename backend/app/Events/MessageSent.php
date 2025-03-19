<?php
namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return [new PrivateChannel('chat.' . $this->message->recipient_id)];
    }



    public function broadcastWith()
    {
        return [
            'id' => $this->message->id,
            'message' => $this->message->message,
            'created_at' => $this->message->created_at->format('H:i:s d/m/Y'),
            'user' => $this->message->user,
            'recipient' => $this->message->recipient
        ];
    }
}