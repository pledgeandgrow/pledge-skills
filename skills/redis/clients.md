# Redis Client Libraries

Redis supports client libraries for all major programming languages.

---

## Python

### redis-py (Official)

```bash
pip install redis
```

```python
import redis

# Basic connection
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Connection pool
pool = redis.ConnectionPool(host='localhost', port=6379, max_connections=20)
r = redis.Redis(connection_pool=pool, decode_responses=True)

# Async client
import redis.asyncio as aioredis
r = aioredis.Redis(host='localhost', port=6379, decode_responses=True)
await r.set('key', 'value')
value = await r.get('key')

# Pub/Sub
pubsub = r.pubsub()
pubsub.subscribe('channel')
for msg in pubsub.listen():
    if msg['type'] == 'message':
        print(msg['data'])

# Pipeline (batch commands)
pipe = r.pipeline()
pipe.set('key1', 'val1')
pipe.set('key2', 'val2')
pipe.get('key1')
results = pipe.execute()  # [True, True, 'val1']

# Transaction
pipe = r.pipeline(transaction=True)
pipe.watch('key')
val = r.get('key')
pipe.multi()
pipe.set('key', 'new_val')
pipe.execute()

# Streams
r.xadd('events', {'type': 'click', 'user': 'abc'})
r.xread(count=10, streams={'events': '0'})

# Cluster
from redis.cluster import RedisCluster
rc = RedisCluster(host='localhost', port=7000, decode_responses=True)
rc.set('key', 'value')
```

### RedisOM (Object Mapping)

```bash
pip install redis-om
```

```python
from redis_om import HashModel, Field, get_redis_connection

r = get_redis_connection()

class Customer(HashModel):
    first_name: str
    last_name: str
    email: str = Field(index=True)
    age: int

customer = Customer(first_name="Alice", last_name="Smith", email="alice@example.com", age=30)
customer.save()

# Query by indexed field
found = Customer.find(Customer.email == "alice@example.com").first()
```

### RedisVL (Vector Search)

```bash
pip install redisvl
```

```python
from redisvl.index import SearchIndex
from redisvl.query import VectorQuery

schema = {
    "index": {"name": "docs", "prefix": "doc"},
    "fields": [
        {"name": "content", "type": "text"},
        {"name": "embedding", "type": "vector", "dims": 1536, "distance_metric": "cosine", "algorithm": "flat"}
    ]
}

index = SearchIndex.from_dict(schema, redis_url="redis://localhost:6379")
index.create(overwrite=True)

# Add data
data = [{"id": "doc1", "content": "Redis is fast", "embedding": [0.1, 0.2, ...]}]
index.load(data)

# Search
query = VectorQuery(vector=[0.1, 0.2, ...], vector_field_name="embedding", num_results=5)
results = index.search(query)
```

---

## JavaScript / Node.js

### node-redis (Official)

```bash
npm install redis
```

```js
import { createClient } from 'redis';

// Basic connection
const client = createClient({ url: 'redis://localhost:6379' });
client.on('error', (err) => console.error('Redis Client Error', err));
await client.connect();

// Strings
await client.set('key', 'value');
const value = await client.get('key');

// Hashes
await client.hSet('user:1', { name: 'Alice', age: 30 });
const user = await client.hGetAll('user:1');

// Lists
await client.lPush('queue', 'item1');
const item = await client.rPop('queue');

// Pipeline
const results = await client.multi()
  .set('key1', 'val1')
  .set('key2', 'val2')
  .get('key1')
  .exec();

// Pub/Sub
const subscriber = createClient();
await subscriber.connect();
await subscriber.subscribe('channel', (message) => {
  console.log('Received:', message);
});

await client.publish('channel', 'Hello');

// Cluster
import { createCluster } from 'redis';
const cluster = createCluster({
  rootNodes: [{ url: 'redis://localhost:7000' }, { url: 'redis://localhost:7001' }],
});
await cluster.connect();
```

### ioredis

```bash
npm install ioredis
```

```js
import Redis from 'ioredis';

const redis = new Redis(6379, 'localhost');

// Pipeline
const pipeline = redis.pipeline();
pipeline.set('key1', 'val1');
pipeline.set('key2', 'val2');
pipeline.get('key1');
const results = await pipeline.exec();

// Transaction
const multi = redis.multi();
multi.set('key', 'val');
multi.incr('counter');
const results = await multi.exec();

// Cluster
import RedisCluster from 'ioredis';
const cluster = new Redis.Cluster([
  { host: 'localhost', port: 7000 },
  { host: 'localhost', port: 7001 },
]);

// Streams
await redis.xadd('events', '*', 'type', 'click', 'user', 'abc');
const entries = await redis.xread('COUNT', 10, 'STREAMS', 'events', '0');
```

### RedisOM for JavaScript

```bash
npm install redis-om
```

```js
import { Repository, Schema, EntityId } from 'redis-om';

const schema = new Schema('user', {
  name: { type: 'string' },
  email: { type: 'string', indexed: true },
  age: { type: 'number', indexed: true },
});

const repository = client.fetchRepository(schema);
await repository.createIndex();

const user = await repository.createAndSave({
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
});

const found = await repository.search().where('email').equals('alice@example.com').first();
```

---

## Java

### Jedis

```xml
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>5.x</version>
</dependency>
```

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

// Basic
try (Jedis jedis = new Jedis("localhost", 6379)) {
    jedis.set("key", "value");
    String value = jedis.get("key");
}

// Connection pool
try (JedisPool pool = new JedisPool("localhost", 6379);
     Jedis jedis = pool.getResource()) {
    jedis.hset("user:1", "name", "Alice");
    Map<String, String> user = jedis.hgetAll("user:1");
}

// Pipeline
try (Jedis jedis = new Jedis("localhost")) {
    Pipeline pipe = jedis.pipelined();
    pipe.set("key1", "val1");
    pipe.set("key2", "val2");
    Response<String> r = pipe.get("key1");
    pipe.sync();
    System.out.println(r.get());
}

// Transaction
try (Jedis jedis = new Jedis("localhost")) {
    Transaction t = jedis.multi();
    t.set("key", "val");
    t.incr("counter");
    t.exec();
}

// Cluster
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.HostAndPort;

Set<HostAndPort> nodes = Set.of(
    new HostAndPort("localhost", 7000),
    new HostAndPort("localhost", 7001)
);
try (JedisCluster cluster = new JedisCluster(nodes)) {
    cluster.set("key", "value");
}
```

### Lettuce

```xml
<dependency>
  <groupId>io.lettuce</groupId>
  <artifactId>lettuce-core</artifactId>
  <version>6.x</version>
</dependency>
```

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.api.async.RedisAsyncCommands;

// Sync
try (RedisClient client = RedisClient.create("redis://localhost:6379");
     StatefulRedisConnection<String, String> conn = client.connect()) {
    RedisCommands<String, String> sync = conn.sync();
    sync.set("key", "value");
    String value = sync.get("key");
}

// Async
RedisAsyncCommands<String, String> async = conn.async();
async.set("key", "value").thenAccept(ok -> {
    async.get("key").thenAccept(value -> System.out.println(value));
});

// Cluster
import io.lettuce.core.cluster.RedisClusterClient;
RedisClusterClient client = RedisClusterClient.create("redis://localhost:7000");
```

---

## C# / .NET

### StackExchange.Redis

```bash
dotnet add package StackExchange.Redis
```

```csharp
using StackExchange.Redis;

var redis = ConnectionMultiplexer.Connect("localhost:6379");
IDatabase db = redis.GetDatabase();

// Strings
db.StringSet("key", "value");
string value = db.StringGet("key");

// Hashes
db.HashSet("user:1", new HashEntry[] {
    new HashEntry("name", "Alice"),
    new HashEntry("age", 30)
});
HashEntry[] user = db.HashGetAll("user:1");

// Batch
var batch = db.CreateBatch();
batch.StringSetAsync("key1", "val1");
batch.StringSetAsync("key2", "val2");
var task = batch.StringGetAsync("key1");
batch.Execute();
string result = task.Result;

// Transaction
var trans = db.CreateTransaction();
trans.AddCondition(Condition.KeyExists("key"));
trans.StringSetAsync("key", "new_val");
bool committed = trans.Execute();

// Pub/Sub
var subscriber = redis.GetSubscriber();
subscriber.Subscribe("channel", (channel, message) => {
    Console.WriteLine(message);
});
subscriber.Publish("channel", "Hello");

// Cluster
var cluster = ConnectionMultiplexer.Connect("localhost:7000,localhost:7001");
```

### NRedisStack

```bash
dotnet add package NRedisStack
```

```csharp
using NRedisStack;
using NRedisStack.RedisStackCommands;

var redis = ConnectionMultiplexer.Connect("localhost").GetDatabase();
var json = redis.JSON();

json.Set("doc:1", "$", new { name = "Alice", age = 30 });
var result = json.Get("doc:1", "$.name");
```

---

## PHP

### predis

```bash
composer require predis/predis
```

```php
use Predis\Client;

$client = new Client([
    'scheme' => 'tcp',
    'host'   => 'localhost',
    'port'   => 6379,
]);

// Strings
$client->set('key', 'value');
$value = $client->get('key');

// Hashes
$client->hmset('user:1', ['name' => 'Alice', 'age' => 30]);
$user = $client->hgetall('user:1');

// Pipeline
$responses = $client->pipeline(function ($pipe) {
    $pipe->set('key1', 'val1');
    $pipe->set('key2', 'val2');
    $pipe->get('key1');
});

// Transaction
$responses = $client->transaction(function ($tx) {
    $tx->set('key', 'val');
    $tx->incr('counter');
});

// Pub/Sub
$pubsub = $client->pubsub();
$pubsub->subscribe('channel');
foreach ($pubsub as $message) {
    echo $message->payload . "\n";
}
```

### phpredis (C extension)

```bash
pecl install redis
```

```php
$redis = new Redis();
$redis->connect('localhost', 6379);

$redis->set('key', 'value');
$value = $redis->get('key');

$redis->hMSet('user:1', ['name' => 'Alice', 'age' => 30]);
$user = $redis->hGetAll('user:1');

// Pipeline
$redis->pipeline()
    ->set('key1', 'val1')
    ->set('key2', 'val2')
    ->get('key1')
    ->exec();

// Cluster
$redis = new RedisCluster(NULL, ['localhost:7000', 'localhost:7001']);
```

---

## Best Practices

- **Connection pooling**: Always use connection pools to avoid creating new connections per request
- **Pipelining**: Batch multiple commands to reduce round trips
- **Timeouts**: Set appropriate timeouts to prevent hanging
- **Error handling**: Handle connection errors and implement retry logic
- **Async clients**: Use async/await in high-concurrency scenarios
- **Cluster awareness**: Use cluster-aware clients for Redis Cluster deployments
