# Getting Started with Redis

Installation, connecting, and your first commands.

---

## Installation

### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### macOS

```bash
brew install redis
brew services start redis
```

### Docker

```bash
docker run --name my-redis -p 6379:6379 -d redis:latest

# With persistence
docker run --name my-redis -p 6379:6379 -v redis-data:/data -d redis:latest redis-server --appendonly yes
```

### From Source

```bash
wget https://download.redis.io/redis-stable.tar.gz
tar -xzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
```

### Redis Cloud (Managed)

Sign up at [redis.com/cloud](https://redis.com/cloud/) for a free managed instance.

---

## Connecting

### redis-cli

```bash
# Default localhost:6379
redis-cli

# Custom host/port
redis-cli -h myhost -p 6380

# With authentication
redis-cli -h myhost -p 6379 -a mypassword
redis-cli -h myhost -p 6379 --askpass

# With TLS
redis-cli -h myhost -p 6379 --tls --cert client.crt --key client.key --cacert ca.crt
```

### Python (redis-py)

```bash
pip install redis
```

```python
import redis

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

r.set('mykey', 'Hello')
print(r.get('mykey'))  # 'Hello'
```

### JavaScript (node-redis)

```bash
npm install redis
```

```js
import { createClient } from 'redis';

const client = createClient({ url: 'redis://localhost:6379' });
await client.connect();

await client.set('mykey', 'Hello');
const value = await client.get('mykey');
console.log(value); // 'Hello'
```

### Java (Jedis)

```xml
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>5.x</version>
</dependency>
```

```java
try (Jedis jedis = new Jedis("localhost", 6379)) {
    jedis.set("mykey", "Hello");
    System.out.println(jedis.get("mykey"));
}
```

### C# (StackExchange.Redis)

```bash
dotnet add package StackExchange.Redis
```

```csharp
using StackExchange.Redis;

var redis = ConnectionMultiplexer.Connect("localhost:6379");
IDatabase db = redis.GetDatabase();

db.StringSet("mykey", "Hello");
string value = db.StringGet("mykey");
Console.WriteLine(value);
```

---

## First Commands

### Strings

```bash
SET server:name "my-server"
GET server:name
DEL server:name

# Set with expiration (seconds)
SET session:abc123 "data" EX 3600

# Increment
INCR counter
INCRBY counter 10
DECR counter
```

### Hashes

```bash
HSET user:1 name "Alice" age 30 email "alice@example.com"
HGET user:1 name
HGETALL user:1
HDEL user:1 email
```

### Lists

```bash
LPUSH mylist "item1" "item2"
RPUSH mylist "item3"
LRANGE mylist 0 -1
LPOP mylist
RPOP mylist
LLEN mylist
```

### Sets

```bash
SADD myset "member1" "member2"
SMEMBERS myset
SISMEMBER myset "member1"
SREM myset "member2"
SCARD myset
```

### Sorted Sets

```bash
ZADD leaderboard 100 "Alice" 200 "Bob" 150 "Charlie"
ZRANGE leaderboard 0 -1 WITHSCORES
ZREVRANGE leaderboard 0 -1 WITHSCORES
ZSCORE leaderboard "Alice"
ZRANK leaderboard "Bob"
```

---

## Checking Server Status

```bash
# Ping
redis-cli ping
# PONG

# Server info
redis-cli info server
redis-cli info memory
redis-cli info clients
redis-cli info stats

# Connected clients
redis-cli client list

# Last save
redis-cli lastsave

# DB size
redis-cli dbsize
```

---

## Configuration

```bash
# View config
redis-cli config get maxmemory
redis-cli config get *

# Set config at runtime
redis-cli config set maxmemory 256mb
redis-cli config set maxmemory-policy allkeys-lru

# Rewrite config file
redis-cli config rewrite
```

### redis.conf Key Settings

```conf
bind 127.0.0.1
port 6379
maxmemory 256mb
maxmemory-policy allkeys-lru
appendonly yes
appendfsync everysec
save 900 1
save 300 10
save 60 10000
```

---

## Docker Compose

```yaml
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  redis-data:
```
