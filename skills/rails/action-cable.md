# Action Cable — WebSockets, Real-Time Features, Channels

## What is Action Cable?

Action Cable seamlessly integrates WebSockets with the rest of your Rails application. It allows real-time features using the same MVC pattern.

## Architecture

- **Connection** — base connection between client and server, authenticated per user
- **Channel** — a logical unit of work, scoped to a topic (like a controller)
- **Subscriber** — client-side subscription to a channel

## Connection Setup

### Server-Side Connection

```ruby
# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      logger.add_tags "ActionCable", "User #{current_user.id}"
    end

    def disconnect
      # cleanup
    end

    private

    def find_verified_user
      if verified_user = User.find_by(id: cookies.signed[:user_id])
        verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
```

### Client-Side Connection

```javascript
// app/javascript/channels/consumer.js
import { createConsumer } from "@rails/actioncable"

export default createConsumer()
```

## Channels

### Creating a Channel

```bash
$ bin/rails generate channel Chat
```

Creates:
- `app/channels/chat_channel.rb`
- `app/javascript/channels/chat_channel.js`

### Server-Side Channel

```ruby
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_#{params[:room]}"
    # or
    stream_for Room.find(params[:id])
  end

  def unsubscribed
    # cleanup
  end

  def speak(data)
    Message.create!(content: data["message"], user: current_user, room_id: params[:room])
  end
end
```

### Client-Side Channel

```javascript
// app/javascript/channels/chat_channel.js
import consumer from "./consumer"

consumer.subscriptions.create({ channel: "ChatChannel", room: "general" }, {
  connected() {
    console.log("Connected to chat")
  },

  disconnected() {
    console.log("Disconnected")
  },

  received(data) {
    console.log("Received:", data)
    document.getElementById("messages").insertAdjacentHTML("beforeend", data.html)
  },

  speak(message) {
    this.perform("speak", { message: message })
  }
})
```

### Streaming

```ruby
class ChatChannel < ApplicationCable::Channel
  def subscribed
    # Stream from a broadcasting name
    stream_from "chat:#{params[:room]}"

    # Stream for a model (generates a unique broadcasting name)
    stream_for Room.find(params[:id])

    # Reject subscription
    reject if params[:room].blank?
  end
end
```

## Broadcasting

### Server-Side Broadcasting

```ruby
# Broadcast to a channel
ActionCable.server.broadcast("chat:general", { body: "Hello!" })

# Broadcast to a model stream
ChatChannel.broadcast_to(@room, { body: "Hello!" })

# Broadcast from a model (via callbacks)
class Message < ApplicationRecord
  belongs_to :room

  after_create_commit :broadcast_message

  private

  def broadcast_message
    ChatChannel.broadcast_to(room, {
      html: ApplicationController.render(partial: "messages/message", locals: { message: self })
    })
  end
end
```

### Broadcasting HTML

```ruby
# Render partial and broadcast
ChatChannel.broadcast_to(@room, {
  html: render_to_string(partial: "messages/message", locals: { message: @message })
})

# Using Turbo Streams (Rails 8 + Hotwire)
Turbo::StreamsChannel.broadcast_replace_to @room, target: "message_#{@message.id}", partial: "messages/message", locals: { message: @message }
```

## Turbo Streams Integration (Rails 8)

Rails 8 uses Turbo Streams over Action Cable for real-time DOM updates:

```ruby
# Broadcast from model
class Comment < ApplicationRecord
  belongs_to :article

  after_create_commit -> { broadcast_append_to(article, partial: "comments/comment", target: "comments") }
  after_update_commit -> { broadcast_replace_to(article, partial: "comments/comment") }
  after_destroy_commit -> { broadcast_remove_to(article, target: "comment_#{id}")
end
```

```erb
<%# In view, subscribe to updates %>
<%= turbo_stream_from @article %>
<div id="comments">
  <%= render @article.comments %>
</div>
```

## Subscriptions

### Multiple Subscriptions

```javascript
// Subscribe to multiple channels
consumer.subscriptions.create({ channel: "ChatChannel", room: "general" }, { ... })
consumer.subscriptions.create({ channel: "NotificationChannel" }, { ... })
```

### Unsubscribing

```javascript
const subscription = consumer.subscriptions.create({ channel: "ChatChannel" }, { ... })
subscription.unsubscribe()
```

## Channel Callbacks

```ruby
class ChatChannel < ApplicationCable::Channel
  before_subscribe :check_access
  after_subscribe :log_subscription
  before_unsubscribe :log_unsubscribe

  def subscribed
    stream_from "chat:#{params[:room]}"
  end

  private

  def check_access
    reject unless current_user.can_access?(params[:room])
  end

  def log_subscription
    Rails.logger.info("#{current_user} subscribed to #{params[:room]}")
  end
end
```

## Connection Lifecycle Events

```ruby
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    def disconnect
      # Called when connection is closed
    end
  end
end
```

## Testing Channels

```ruby
require "test_helper"

class ChatChannelTest < ActionCable::Channel::TestCase
  test "subscribes to room" do
    user = users(:alice)
    stub_connection(current_user: user)

    subscribe room: "general"

    assert subscription.confirmed?
    assert_has_stream "chat:general"
  end

  test "speak creates a message" do
    user = users(:alice)
    stub_connection(current_user: user)
    subscribe room: "general"

    perform :speak, message: "Hello!"

    assert_equal 1, Message.count
    assert_equal "Hello!", Message.last.content
  end
end
```

### Testing Broadcasting

```ruby
test "broadcasts message" do
  assert_broadcasts("chat:general", 0)
  ActionCable.server.broadcast("chat:general", { body: "Hello" })
  assert_broadcasts("chat:general", 1)
  assert_broadcast_on("chat:general", { body: "Hello" })
end
```

## Configuration

### Rails 8 Default: Solid Cable

Rails 8 uses Solid Cable (database-backed pub/sub) instead of Redis:

```ruby
# config/environments/production.rb
config.action_cable.adapter = :solid_cable
config.action_cable.url = "/cable"  # same-origin
```

### Other Adapters

```ruby
# Redis
config.action_cable.adapter = :redis
config.action_cable.url = "redis://localhost:6379/1"

# PostgreSQL
config.action_cable.adapter = :postgresql

# Async (development)
config.action_cable.adapter = :async

# Test
config.action_cable.adapter = :test
```

### Allowed Request Origins

```ruby
# config/environments/production.rb
config.action_cable.allowed_request_origins = ["https://example.com"]

# Or allow all
config.action_cable.disable_request_forgery_protection = true
```

### Mounting

```ruby
# config/routes.rb
Rails.application.routes.draw do
  mount ActionCable.server => "/cable"
end
```

## Client-Side API

```javascript
import consumer from "./consumer"

// Create subscription
const sub = consumer.subscriptions.create("ChatChannel", {
  initialized() { },
  connected() { },
  disconnected() { },
  received(data) { },

  // Custom actions
  speak(message) {
    return this.perform("speak", { message })
  }
})

// Send data
sub.speak("Hello!")

// Unsubscribe
sub.unsubscribe()

// Connection state
consumer.connection.isOpen()  // true/false
consumer.connection.close()
consumer.connection.open()
```

## Best Practices

- Use `after_create_commit` (not `after_create`) for broadcasting — ensures DB transaction is committed
- Use Turbo Streams for DOM updates instead of manual JS
- Keep channels focused — one concern per channel
- Use `stream_for` with models for automatic broadcasting namespacing
- Reject unauthorized subscriptions explicitly
