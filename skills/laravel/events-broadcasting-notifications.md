# Events, Broadcasting, and Notifications

Event handling, real-time broadcasting, and multi-channel notifications.

## Events

### Generating Events and Listeners

```bash
php artisan make:event OrderShipped
php artisan make:listener SendShipmentNotification --event=OrderShipped

# Generate all at once based on event-listener mapping
php artisan event:generate
```

### Event Discovery

```php
// In bootstrap/app.php — automatic event discovery
->withEvents(shouldDiscoverEvents: true)
```

### Defining Events

```php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Order $order,
    ) {}

    public function broadcastOn(): Channel|array
    {
        return new PrivateChannel('orders.'.$this->order->user_id);
    }

    public function broadcastWith(): array
    {
        return ['id' => $this->order->id, 'status' => 'shipped'];
    }

    public function broadcastAs(): string
    {
        return 'order.shipped';
    }
}
```

### Defining Listeners

```php
namespace App\Listeners;

use App\Events\OrderShipped;

class SendShipmentNotification
{
    public function __construct() {}

    public function handle(OrderShipped $event): void
    {
        // Send notification
        $event->order->user->notify(new OrderShippedNotification($event->order));
    }

    // Stop propagation
    public function handle(OrderShipped $event): bool
    {
        return false; // Prevent subsequent listeners
    }
}
```

### Queued Event Listeners

```php
namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendShipmentNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(OrderShipped $event): void
    {
        // Process on queue
    }

    // Customize queue
    public $queue = 'notifications';
    public $delay = 60;

    // Decide if should queue
    public function shouldQueue(OrderShipped $event): bool
    {
        return $event->order->total > 100;
    }

    // Handle failure
    public function failed(OrderShipped $event, \Throwable $e): void
    {
        // Handle failure
    }
}
```

### Dispatching Events

```php
use App\Events\OrderShipped;

// Dispatch
OrderShipped::dispatch($order);

// Or
event(new OrderShipped($order));

// Dispatch after database transaction commits
OrderShipped::dispatch($order)->afterCommit();

// Dispatch only if condition
OrderShipped::dispatchIf($condition, $order);
OrderShipped::dispatchUnless($condition, $order);
```

### Event Subscribers

```bash
php artisan make:listener UserEventSubscriber
```

```php
namespace App\Listeners;

class UserEventSubscriber
{
    public function handleUserLogin($event): void { /* ... */ }
    public function handleUserLogout($event): void { /* ... */ }

    public function subscribe(): array
    {
        return [
            \Illuminate\Auth\Events\Login::class => 'handleUserLogin',
            \Illuminate\Auth\Events\Logout::class => 'handleUserLogout',
        ];
    }
}
```

### Testing Events

```php
use Illuminate\Support\Facades\Event;

public function test_order_shipped_event(): void
{
    Event::fake();

    // Perform action
    $order->ship();

    // Assert dispatched
    Event::assertDispatched(OrderShipped::class);
    Event::assertDispatched(OrderShipped::class, function ($event) use ($order) {
        return $event->order->id === $order->id;
    });

    // Assert not dispatched
    Event::assertNotDispatched(OrderFailed::class);

    // Assert dispatched with count
    Event::assertDispatched(OrderShipped::class, 2);
}
```

## Broadcasting

### Server Side Installation

```bash
# Reverb (Laravel's first-party WebSocket server)
composer require laravel/reverb

# Or Pusher
composer require pusher/pusher-php-server

# Or Ably
composer require ably/ably-php
```

### Client Side Installation

```bash
# Reverb client
npm install laravel-echo @reverb/js

# Pusher client
npm install laravel-echo pusher-js

# Ably client
npm install laravel-echo ably
```

```js
// resources/js/app.js
import Echo from 'laravel-echo';
import Reverb from '@reverb/js';

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
```

### Defining Broadcast Events

```php
class OrderShipped implements ShouldBroadcast
{
    public function broadcastOn(): Channel|array
    {
        // Public channel
        return new Channel('orders');

        // Private channel
        return new PrivateChannel('orders.'.$this->order->user_id);

        // Presence channel
        return new PresenceChannel('chat.'.$this->chatId);
    }

    public function broadcastWith(): array
    {
        return ['id' => $this->order->id, 'status' => 'shipped'];
    }

    public function broadcastAs(): string
    {
        return 'order.shipped';
    }

    public function broadcastWhen(): bool
    {
        return $this->order->total > 0;
    }
}
```

### Authorizing Channels

```php
// routes/channels.php
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders.{orderId}', function ($user, $orderId) {
    return $user->id === Order::find($orderId)->user_id;
});

// Using channel classes
Broadcast::channel('chat.{chatId}', ChatChannel::class);

class ChatChannel
{
    public function join(User $user, string $chatId): array|bool
    {
        if ($user->canJoinChat($chatId)) {
            return ['id' => $user->id, 'name' => $user->name];
        }
        return false;
    }
}
```

### Broadcasting Events

```php
// Broadcast to others (exclude current user)
broadcast(new OrderShipped($order))->toOthers();

// Custom connection
broadcast(new OrderShipped($order))->onConnection('redis');
```

### Receiving Broadcasts

```js
// Listen on public channel
Echo.channel('orders')
    .listen('OrderShipped', (e) => {
        console.log('Order shipped:', e.order);
    });

// Listen on private channel
Echo.private(`orders.${userId}`)
    .listen('OrderShipped', (e) => {
        console.log('Your order shipped:', e);
    });

// Listen on presence channel
Echo.join(`chat.${chatId}`)
    .here((users) => console.log('Users in room:', users))
    .joining((user) => console.log('User joined:', user))
    .leaving((user) => console.log('User left:', user))
    .listen('MessageSent', (e) => {
        console.log('New message:', e.message);
    })
    .error((error) => console.error(error));

// Stop listening
Echo.leave(`orders.${userId}`);
```

### Model Broadcasting

```php
class Post extends Model
{
    use BroadcastsEvents;

    public function broadcastOn(string $event): Channel|array
    {
        return match ($event) {
            'created' => new Channel('posts'),
            'updated' => new PrivateChannel("posts.{$this->id}"),
            default => [],
        };
    }
}
```

### Client Events

```js
// Send event to other clients (no server round-trip)
Echo.private(`chat.${chatId}`)
    .whisper('typing', {
        user: userId,
        typing: true,
    })
    .listenForWhisper('typing', (e) => {
        console.log('User typing:', e.user);
    });
```

### Notifications via Broadcasting

```php
// In notification
class OrderShipped extends Notification implements ShouldBroadcast
{
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'order_id' => $this->order->id,
        ]);
    }
}
```

## Notifications

### Creating Notifications

```bash
php artisan make:notification OrderShipped
```

```php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderShipped extends Notification
{
    use Queueable;

    public function __construct(
        public Order $order,
    ) {}

    // Delivery channels
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    // Mail channel
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Shipped')
            ->greeting('Hello ' . $notifiable->name)
            ->line('Your order has been shipped!')
            ->action('Track Order', url('/orders/' . $this->order->id))
            ->line('Thank you for your purchase!');
    }

    // Database channel
    public function toDatabase(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'amount' => $this->order->total,
        ];
    }

    // Broadcast channel
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'order_id' => $this->order->id,
        ]);
    }

    // SMS (Vonage)
    public function toVonage(object $notifiable): VonageMessage
    {
        return (new VonageMessage)
            ->content('Your order has been shipped!');
    }

    // Slack
    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->content('Order #' . $this->order->id . ' shipped!');
    }
}
```

### Sending Notifications

```php
use App\Notifications\OrderShipped;

// Via notifiable trait
$user->notify(new OrderShipped($order));

// Via Notification facade
Notification::send($users, new OrderShipped($order));
Notification::sendNow($users, new OrderShipped($order));

// On demand
Notification::route('mail', 'user@example.com')
    ->notify(new OrderShipped($order));

// Multiple channels on demand
Notification::route('mail', 'user@example.com')
    ->route('vonage', '5555555555')
    ->notify(new OrderShipped($order));
```

### Notification Channels

| Channel | Package |
|---------|---------|
| `mail` | Built-in |
| `database` | Built-in |
| `broadcast` | Built-in |
| `vonage` (SMS) | `laravel/vonage-notification-channel` |
| `slack` | Built-in |
| `telegram` | `laravel-notification-channels/telegram` |
| `discord` | `laravel-notification-channels/discord` |
| `webhook` | `laravel-notification-channels/webhook` |

### Reading Database Notifications

```php
// Get all notifications
$notifications = $user->notifications;

// Get unread notifications
$unread = $user->unreadNotifications;

// Mark as read
$notification->markAsRead();
$user->unreadNotifications->markAsRead();

// Mark all as read
$user->notifications()->update(['read_at' => now()]);

// Delete
$notification->delete();
```

### Customizing the Notifiable Entity

```php
class User extends Model implements Notifiable
{
    // Custom email routing
    public function routeNotificationForMail(): array|string
    {
        return [$this->email => $this->name];
    }

    // Custom Slack routing
    public function routeNotificationForSlack(): string
    {
        return config('services.slack.webhook_url');
    }

    // Custom Vonage routing
    public function routeNotificationForVonage(): string
    {
        return $this->phone_number;
    }
}
```

### Markdown Mail Templates

```php
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->markdown('mail.order.shipped', ['order' => $this->order]);
}
```

```blade
{{-- resources/views/mail/order/shipped.blade.php --}}
@component('mail::message')
# Order Shipped

Your order #{{ $order->id }} has been shipped!

@component('mail::button', ['url' => $url])
Track Order
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
```

## Best Practices

1. Use `ShouldBroadcast` interface for events that need real-time updates
2. Use private channels for user-specific data
3. Use presence channels for collaborative features
4. Implement `broadcastWhen()` to conditionally broadcast
5. Use queued listeners for slow operations (emails, API calls)
6. Use `Event::fake()` in tests to verify event dispatching
7. Use database notifications for persistent notifications
8. Use `toOthers()` to avoid echoing events back to the sender
9. Define channel authorization in `routes/channels.php`
10. Use Markdown mail templates for consistent email styling
