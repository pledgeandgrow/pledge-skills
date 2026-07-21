# Subscriptions

Subscriptions are GraphQL operations for real-time data updates. They maintain a long-lived connection where the server pushes data to subscribed clients as it changes.

## Schema Definition

```graphql
type Subscription {
  reviewCreated: Review
  humanFriendsUpdated(id: ID!): Human
  messageAdded(roomId: ID!): Message
}
```

## Initiating a Subscription

```graphql
subscription NewReviewCreated {
  reviewCreated {
    rating
    commentary
  }
}
```

```graphql
subscription FriendListUpdated($id: ID!) {
  humanFriendsUpdated(id: $id) {
    name
    friends {
      name
    }
  }
}
```

## How Subscriptions Work

Subscriptions are typically backed by a pub/sub system:

```
┌──────────┐    publish     ┌───────────┐    notify     ┌──────────────┐
│ Mutation │───────────────▶│  Pub/Sub  │─────────────▶│ Subscription │
│ Resolver │                │  System   │               │  Resolver    │
└──────────┘                └───────────┘               └──────┬───────┘
                                                                │ push
                                                                ▼
                                                         ┌──────────────┐
                                                         │   Client     │
                                                         │ (subscribed) │
                                                         └──────────────┘
```

1. A client sends a subscription operation
2. The server sets up a listener on the pub/sub system
3. When a mutation publishes an event, the subscription resolver fires
4. The server pushes the result to the client

### Example: Publish on Mutation

```javascript
// Mutation resolver publishes event
const Mutation = {
  createReview(_obj, args, context, _info) {
    return context.db.createNewReview(args.episode, args.review)
      .then(review => {
        context.pubsub.publish('REVIEW_CREATED', { reviewCreated: review });
        return review;
      });
  },
};

// Subscription resolver listens for event
const Subscription = {
  reviewCreated: {
    subscribe: (_obj, _args, context, _info) =>
      context.pubsub.asyncIterator(['REVIEW_CREATED']),
  },
};
```

## Transport Protocols

GraphQL doesn't specify a transport protocol for subscriptions. Common implementations:

| Protocol | Direction | Notes |
|----------|-----------|-------|
| **WebSockets** | Bidirectional | Most common, full-duplex |
| **Server-Sent Events (SSE)** | Server → Client | Simpler, one-way |
| **graphql-sse** | Server → Client | SSE-based, community spec |
| **graphql-ws** | Bidirectional | WebSocket-based, community spec |

### WebSocket Protocol (graphql-ws)

```javascript
// Client-side with graphql-ws
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:4000/graphql',
});

client.subscribe({
  query: `subscription { reviewCreated { rating commentary } }`,
}, {
  next: (data) => console.log('New review:', data),
  error: (err) => console.error('Subscription error:', err),
  complete: () => console.log('Subscription closed'),
});
```

## Subscription Rules

### One Root Field Per Operation

Each subscription operation must have exactly **one root field**:

```graphql
# INVALID — two root fields
subscription {
  reviewCreated { rating commentary }
  humanFriendsUpdated { name friends { name } }
}
```

```graphql
# VALID — separate operations, each with one root field
subscription NewReviewCreated { reviewCreated { rating commentary } }
subscription FriendListUpdated($id: ID!) { humanFriendsUpdated(id: $id) { name friends { name } } }
```

When sending multiple subscription operations in one document:
- Each must be named
- The operation to execute must be specified in the request

## Using Subscriptions at Scale

### Challenges

- **Stateful connections**: Each client must be bound to a specific server instance
- **Horizontal scaling**: Requires shared pub/sub system (Redis, NATS, etc.)
- **Connection management**: Handle reconnection, timeouts, backpressure
- **Resource usage**: Long-lived connections consume memory and file descriptors

### Architecture for Scale

```
                    ┌──────────────────────────┐
                    │     Load Balancer         │
                    │   (sticky sessions)       │
                    └─────────┬─────┬──────────┘
                              │     │
                    ┌─────────┘     └─────────┐
                    ▼                         ▼
              ┌──────────┐             ┌──────────┐
              │ Server A │             │ Server B │
              │ (clients)│             │ (clients)│
              └────┬─────┘             └────┬─────┘
                   │                        │
                   └───────────┬────────────┘
                               ▼
                    ┌──────────────────┐
                    │   Redis Pub/Sub   │
                    │   (shared bus)    │
                    └──────────────────┘
```

### When to Use Subscriptions vs Polling

| Use Case | Recommended Approach |
|----------|---------------------|
| Chat/messaging | Subscriptions |
| Live scores/updates | Subscriptions |
| Notifications | Subscriptions or push |
| Infrequent changes | Polling |
| Mobile apps | Push notifications |
| Dashboard with periodic refresh | Polling or re-fetch on interaction |

### Best Practices

- Use subscriptions for **frequent, incremental** data changes
- Use **polling** for infrequent updates
- Implement **reconnection logic** on the client
- Handle **race conditions** between initial query and subscription updates
- Use a **shared pub/sub system** for horizontal scaling
- Consider **mobile push notifications** for disconnected clients
- Monitor **connection counts** and set limits
- **Clean up** subscriptions when clients disconnect

## Subscriptions vs Live Queries

Subscriptions are not the same as live queries:
- **Subscriptions**: Event-driven, server pushes specific events
- **Live queries**: Server re-executes a query whenever underlying data changes
- Live queries are not part of the GraphQL specification
- [Discussion on live queries spec](https://github.com/graphql/graphql-spec/issues/386)
