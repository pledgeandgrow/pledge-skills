# Redis Commands Reference

Complete command reference organized by category.

---

## String Commands

| Command | Description | Complexity |
|---------|-------------|------------|
| `SET key value [EX\|PX\|EXAT\|PXAT] [NX\|XX] [GET]` | Set string value | O(1) |
| `GET key` | Get string value | O(1) |
| `DEL key [key ...]` | Delete keys | O(N) |
| `MSET key val [key val ...]` | Set multiple keys | O(N) |
| `MGET key [key ...]` | Get multiple keys | O(N) |
| `INCR key` | Increment by 1 | O(1) |
| `DECR key` | Decrement by 1 | O(1) |
| `INCRBY key n` | Increment by n | O(1) |
| `DECRBY key n` | Decrement by n | O(1) |
| `INCRBYFLOAT key n` | Increment float | O(1) |
| `APPEND key val` | Append to string | O(1) |
| `STRLEN key` | String length | O(1) |
| `GETRANGE key start end` | Substring | O(N) |
| `SETRANGE key offset val` | Overwrite at offset | O(1) |
| `GETDEL key` | Get and delete | O(1) |
| `GETSET key val` | Get and set | O(1) |
| `SETBIT key bit val` | Set bit | O(1) |
| `GETBIT key bit` | Get bit | O(1) |
| `BITCOUNT key [start end]` | Count set bits | O(N) |
| `BITOP op dest key [key ...]` | Bitwise ops | O(N) |
| `BITPOS key bit [start end]` | Find first bit | O(N) |
| `BITFIELD key ...` | Bitfield operations | O(1) per sub-cmd |

## Hash Commands

| Command | Description | Complexity |
|---------|-------------|------------|
| `HSET key field val [field val ...]` | Set field(s) | O(1) per field |
| `HGET key field` | Get field | O(1) |
| `HMGET key field [field ...]` | Get multiple fields | O(N) |
| `HGETALL key` | Get all fields and values | O(N) |
| `HDEL key field [field ...]` | Delete field(s) | O(N) |
| `HLEN key` | Field count | O(1) |
| `HEXISTS key field` | Field exists | O(1) |
| `HKEYS key` | All field names | O(N) |
| `HVALS key` | All values | O(N) |
| `HINCRBY key field n` | Increment field | O(1) |
| `HINCRBYFLOAT key field n` | Increment float field | O(1) |
| `HSETNX key field val` | Set if not exists | O(1) |
| `HSTRLEN key field` | Field value length | O(1) |
| `HSCAN key cursor [MATCH pat] [COUNT n]` | Scan fields | O(1) per call |
| `HRANDFIELD key [count] [WITHVALUES]` | Random field | O(N) |
| `HEXPIRE key secs FIELDS n field` | Expire field | O(1) |
| `HPEXPIRE key ms FIELDS n field` | Expire field (ms) | O(1) |
| `HTTL key FIELDS n field` | Field TTL | O(1) |

## List Commands

| Command | Description | Complexity |
|---------|-------------|------------|
| `LPUSH key val [val ...]` | Push to head | O(1) |
| `RPUSH key val [val ...]` | Push to tail | O(1) |
| `LPUSHX key val [val ...]` | Push to head if exists | O(1) |
| `RPUSHX key val [val ...]` | Push to tail if exists | O(1) |
| `LPOP key [count]` | Pop from head | O(N) |
| `RPOP key [count]` | Pop from tail | O(N) |
| `LLEN key` | List length | O(1) |
| `LRANGE key start stop` | Get range | O(S+N) |
| `LINDEX key index` | Get by index | O(N) |
| `LSET key index val` | Set by index | O(N) |
| `LINSERT key BEFORE\|AFTER pivot val` | Insert relative | O(N) |
| `LREM key count val` | Remove elements | O(N) |
| `LTRIM key start stop` | Trim to range | O(N) |
| `LMOVE src dest LEFT\|RIGHT LEFT\|RIGHT` | Move between lists | O(1) |
| `BLPOP key [key ...] timeout` | Blocking pop left | O(1) |
| `BRPOP key [key ...] timeout` | Blocking pop right | O(1) |
| `BLMOVE src dest from to timeout` | Blocking move | O(1) |
| `LMPOP numkeys key [key ...] LEFT\|RIGHT [COUNT n]` | Multi-pop | O(N) |
| `BLMPOP timeout numkeys key ... LEFT\|RIGHT [COUNT n]` | Blocking multi-pop | O(N) |
| `LPOS key val [RANK rank] [COUNT count] [MAXLEN len]` | Find position | O(N) |

## Set Commands

| Command | Description | Complexity |
|---------|-------------|------------|
| `SADD key member [member ...]` | Add members | O(N) |
| `SREM key member [member ...]` | Remove members | O(N) |
| `SMEMBERS key` | All members | O(N) |
| `SISMEMBER key member` | Check membership | O(1) |
| `SMISMEMBER key member [member ...]` | Check multiple | O(N) |
| `SCARD key` | Member count | O(1) |
| `SINTER key [key ...]` | Intersection | O(N*M) |
| `SINTERSTORE dest key [key ...]` | Store intersection | O(N*M) |
| `SINTERCARD numkeys key [key ...] [LIMIT limit]` | Intersection count | O(N*M) |
| `SUNION key [key ...]` | Union | O(N) |
| `SUNIONSTORE dest key [key ...]` | Store union | O(N) |
| `SDIFF key [key ...]` | Difference | O(N) |
| `SDIFFSTORE dest key [key ...]` | Store difference | O(N) |
| `SMOVE src dest member` | Move member | O(1) |
| `SPOP key [count]` | Pop random | O(N) |
| `SRANDMEMBER key [count]` | Random member | O(N) |
| `SSCAN key cursor [MATCH pat] [COUNT n]` | Scan members | O(1) per call |

## Sorted Set Commands

| Command | Description | Complexity |
|---------|-------------|------------|
| `ZADD key [NX\|XX] [GT\|LT] [CH] [INCR] score member [score member ...]` | Add with scores | O(log N) per member |
| `ZSCORE key member` | Get score | O(1) |
| `ZMSCORE key member [member ...]` | Get multiple scores | O(N) |
| `ZRANK key member` | Get rank (ascending) | O(log N) |
| `ZREVRANK key member` | Get rank (descending) | O(log N) |
| `ZCARD key` | Member count | O(1) |
| `ZCOUNT key min max` | Count in score range | O(log N) |
| `ZRANGE key start stop [BYSCORE\|BYLEX] [REV] [LIMIT offset count] [WITHSCORES]` | Range query | O(log N + S) |
| `ZREVRANGE key start stop [WITHSCORES]` | Reverse range | O(log N + S) |
| `ZREMRANGEBYRANK key start stop` | Remove by rank | O(log N + S) |
| `ZREMRANGEBYSCORE key min max` | Remove by score | O(log N + S) |
| `ZREM key member [member ...]` | Remove members | O(M*log N) |
| `ZINCRBY key n member` | Increment score | O(log N) |
| `ZPOPMIN key [count]` | Pop lowest | O(log N * count) |
| `ZPOPMAX key [count]` | Pop highest | O(log N * count) |
| `BZPOPMIN key [key ...] timeout` | Blocking pop min | O(log N) |
| `BZPOPMAX key [key ...] timeout` | Blocking pop max | O(log N) |
| `ZINTER numkeys key [key ...] [AGGREGATE SUM\|MIN\|MAX] [WEIGHTS w ...] [WITHSCORES]` | Intersection | O(N*K + M*log M) |
| `ZUNION numkeys key [key ...] [AGGREGATE ...] [WEIGHTS ...] [WITHSCORES]` | Union | O(N) |
| `ZDIFF numkeys key [key ...] [WITHSCORES]` | Difference | O(L) |
| `ZINTERSTORE dest numkeys key ...` | Store intersection | O(N*K + M*log M) |
| `ZUNIONSTORE dest numkeys key ...` | Store union | O(N) |
| `ZDIFFSTORE dest numkeys key ...` | Store difference | O(L) |
| `ZINTERCARD numkeys key [key ...] [LIMIT limit]` | Intersection count | O(N*K) |
| `ZRANDMEMBER key [count] [WITHSCORES]` | Random member | O(N) |
| `ZSCAN key cursor [MATCH pat] [COUNT n]` | Scan members | O(1) per call |
| `BZMPOP timeout numkeys key [key ...] MIN\|MAX [COUNT count]` | Blocking multi-pop | O(log N) |
| `ZMPOP numkeys key [key ...] MIN\|MAX [COUNT count]` | Multi-pop | O(log N) |

## Stream Commands

| Command | Description | Complexity |
|---------|-------------|------------|
| `XADD key [MAXLEN\|MINID [~] threshold] [NOMKSTREAM] *\|ID field value [field value ...]` | Add entry | O(1) |
| `XREAD [COUNT count] [BLOCK ms] STREAMS key [key ...] ID [ID ...]` | Read entries | O(N) |
| `XREADGROUP GROUP group consumer [COUNT count] [BLOCK ms] [NOACK] STREAMS key [key ...] ID [ID ...]` | Read as consumer | O(N) |
| `XLEN key` | Stream length | O(1) |
| `XRANGE key start end [COUNT count]` | Range query | O(N) |
| `XREVRANGE key end start [COUNT count]` | Reverse range | O(N) |
| `XDEL key ID [ID ...]` | Delete entries | O(1) per ID |
| `XTRIM key MAXLEN\|MINID [~] threshold [LIMIT count]` | Trim stream | O(N) |
| `XACK key group ID [ID ...]` | Acknowledge entries | O(1) per ID |
| `XGROUP CREATE key group ID [MKSTREAM]` | Create consumer group | O(1) |
| `XGROUP CREATECONSUMER key group consumer` | Create consumer | O(1) |
| `XGROUP DELCONSUMER key group consumer` | Delete consumer | O(N) |
| `XGROUP DESTROY key group` | Destroy group | O(N+M) |
| `XGROUP SETID key group ID` | Set group's last-delivered ID | O(1) |
| `XPENDING key group [start end count] [consumer]` | Pending entries | O(N) |
| `XCLAIM key group consumer min-idle-time ID [ID ...]` | Claim entries | O(N) |
| `XAUTOCLAIM key group consumer min-idle-time start [COUNT count]` | Auto-claim | O(N) |
| `XINFO STREAM key [FULL]` | Stream info | O(1) |
| `XINFO GROUPS key` | Group info | O(1) |
| `XINFO CONSUMERS key group` | Consumer info | O(1) |

## Key Commands

| Command | Description | Complexity |
|---------|-------------|------------|
| `DEL key [key ...]` | Delete keys | O(N) |
| `EXISTS key [key ...]` | Check existence | O(N) |
| `EXPIRE key secs [NX\|XX\|GT\|LT]` | Set TTL | O(1) |
| `PEXPIRE key ms [NX\|XX\|GT\|LT]` | Set TTL (ms) | O(1) |
| `EXPIREAT key timestamp [NX\|XX\|GT\|LT]` | Set expiry at time | O(1) |
| `PEXPIREAT key timestamp-ms [NX\|XX\|GT\|LT]` | Set expiry at time (ms) | O(1) |
| `TTL key` | Get TTL (seconds) | O(1) |
| `PTTL key` | Get TTL (milliseconds) | O(1) |
| `PERSIST key` | Remove TTL | O(1) |
| `TYPE key` | Get value type | O(1) |
| `RENAME key newkey` | Rename key | O(1) |
| `RENAMENX key newkey` | Rename if new key doesn't exist | O(1) |
| `COPY key newkey [DB db] [REPLACE]` | Copy key | O(N) |
| `DUMP key` | Serialize value | O(N) |
| `RESTORE key ttl serialized [REPLACE] [ABSTTL] [IDLETIME secs] [FREQ freq]` | Restore value | O(1) |
| `OBJECT ENCODING key` | Get internal encoding | O(1) |
| `OBJECT REFCOUNT key` | Get reference count | O(1) |
| `OBJECT IDLETIME key` | Get idle time | O(1) |
| `MEMORY USAGE key [SAMPLES count]` | Memory usage | O(N) |
| `RANDOMKEY` | Random key | O(1) |
| `SCAN cursor [MATCH pat] [COUNT n] [TYPE type]` | Scan keys | O(1) per call |
| `DBSIZE` | Key count | O(1) |

## Pub/Sub Commands

| Command | Description |
|---------|-------------|
| `PUBLISH channel message` | Publish message |
| `SUBSCRIBE channel [channel ...]` | Subscribe to channels |
| `UNSUBSCRIBE [channel ...]` | Unsubscribe |
| `PSUBSCRIBE pattern [pattern ...]` | Pattern subscribe |
| `PUNSUBSCRIBE [pattern ...]` | Pattern unsubscribe |
| `SPUBLISH channel message` | Sharded publish |
| `SSUBSCRIBE channel [channel ...]` | Sharded subscribe |
| `SUNSUBSCRIBE [channel ...]` | Sharded unsubscribe |
| `PUBSUB CHANNELS [pattern]` | List active channels |
| `PUBSUB NUMSUB [channel ...]` | Subscriber count per channel |
| `PUBSUB NUMPAT` | Pattern subscriber count |
| `PUBSUB SHARDCHANNELS [pattern]` | List shard channels |
| `PUBSUB SHARDNUMSUB [channel ...]` | Shard subscriber count |

## Transaction Commands

| Command | Description |
|---------|-------------|
| `MULTI` | Start transaction |
| `EXEC` | Execute queued commands |
| `DISCARD` | Cancel transaction |
| `WATCH key [key ...]` | Watch for changes |
| `UNWATCH` | Unwatch all keys |

## Server Commands

| Command | Description |
|---------|-------------|
| `INFO [section ...]` | Server info |
| `DBSIZE` | Key count |
| `FLUSHDB [ASYNC\|SYNC]` | Flush current DB |
| `FLUSHALL [ASYNC\|SYNC]` | Flush all DBs |
| `SELECT db` | Select database |
| `SWAPDB db1 db2` | Swap databases |
| `PING [message]` | Ping server |
| `ECHO message` | Echo message |
| `AUTH password` | Authenticate |
| `QUIT` | Close connection |
| `SHUTDOWN [NOSAVE\|SAVE]` | Shut down server |
| `BGSAVE` | Background save |
| `SAVE` | Synchronous save |
| `LASTSAVE` | Last save timestamp |
| `BGREWRITEAOF` | Rewrite AOF |
| `CONFIG GET parameter` | Get config |
| `CONFIG SET parameter value` | Set config |
| `CONFIG RESETSTAT` | Reset stats |
| `CONFIG REWRITE` | Rewrite config file |
| `CLIENT LIST` | List clients |
| `CLIENT KILL` | Kill client |
| `CLIENT GETNAME` | Get client name |
| `CLIENT SETNAME name` | Set client name |
| `CLIENT ID` | Get client ID |
| `CLIENT PAUSE ms` | Pause clients |
| `CLIENT NO-EVICT ON\|OFF` | Toggle no-evict |
| `MONITOR` | Monitor all commands |
| `SLOWLOG GET [count]` | Get slow log |
| `SLOWLOG RESET` | Reset slow log |
| `SLOWLOG LEN` | Slow log length |
| `LATENCY HISTORY event` | Latency history |
| `LATENCY RESET [event ...]` | Reset latency |
| `MEMORY STATS` | Memory stats |
| `MEMORY DOCTOR` | Memory diagnosis |
| `MEMORY PURGE` | Purge memory |
| `CLUSTER INFO` | Cluster info |
| `CLUSTER NODES` | Cluster nodes |
| `CLUSTER SLOTS` | Cluster slots |
| `CLUSTER MYID` | Node ID |
| `CLUSTER MEET ip port` | Join cluster |
| `CLUSTER FORGET node-id` | Remove node |
| `CLUSTER REPLICATE node-id` | Become replica |
| `CLUSTER FAILOVER` | Manual failover |
| `CLUSTER RESET [HARD\|SOFT]` | Reset cluster |
| `CLUSTER ADDSLOTS slot [slot ...]` | Assign slots |
| `CLUSTER DELSLOTS slot [slot ...]` | Remove slots |
| `CLUSTER KEYSLOT key` | Key's slot |
| `CLUSTER COUNT-FAILURE-REPORTS node-id` | Failure reports |
| `CLUSTER COUNTKEYSINSLOT slot` | Keys in slot |
| `CLUSTER GETKEYSINSLOT slot count` | Get keys in slot |
| `CLUSTER SETSLOT slot NODE\|MIGRATING\|IMPORTING\|STABLE node-id` | Set slot state |
| `CLUSTER FLUSHSLOTS` | Flush slots |
| `ROLE` | Server role |
| `REPLICAOF host port` | Become replica |
| `REPLICAOF NO ONE` | Stop being replica |
| `DEBUG SLEEP sec` | Sleep (debug) |
| `DEBUG OBJECT key` | Debug object |
| `DEBUG SET-ACTIVE-EXPIRE 0\|1` | Toggle active expiry |
| `COMMAND` | List all commands |
| `COMMAND COUNT` | Command count |
| `COMMAND INFO [command ...]` | Command info |
| `COMMAND DOCS [command ...]` | Command docs |
| `COMMAND GETKEYS command args` | Extract keys from command |
| `COMMAND LIST [FILTERBY ...]` | List command names |
