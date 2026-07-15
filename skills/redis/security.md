# Redis Security

Security configuration, access control, TLS, and best practices.

---

## Network Security

### Bind to Local Interface

```conf
# redis.conf
bind 127.0.0.1 ::1

# Or specific interfaces
bind 10.0.0.1 10.0.0.2
```

### Protected Mode

```conf
# Prevents access from non-loopback interfaces without authentication
protected-mode yes
```

### Change Default Port

```conf
port 6380
```

### Firewall Rules

```bash
# iptables: allow only specific IP
iptables -A INPUT -p tcp --dport 6379 -s 10.0.0.5 -j ACCEPT
iptables -A INPUT -p tcp --dport 6379 -j DROP
```

---

## Authentication

### Password Authentication

```conf
# redis.conf
requirepass "your-strong-password-here"
```

```bash
# Connect with password
redis-cli -a "your-strong-password-here"

# Or authenticate after connecting
AUTH "your-strong-password-here"
```

### ACL (Access Control Lists)

Redis 6+ provides fine-grained user management.

```bash
# List users
ACL LIST

# Get current user
ACL WHOAMI

# Create user with specific permissions
ACL SETUSER alice on >alice_password ~user:* +get +set +hset +hget

# Create read-only user
ACL SETUSER reader on >reader_pass ~* +get +hget +lrange +smembers +zrange +exists +type +scan +hscan +sscan +zscan

# Create admin user
ACL SETUSER admin on >admin_pass ~* +@all

# Delete user
ACL DELUSER alice

# Get user info
ACL GETUSER alice
```

### ACL Categories

```bash
# Command categories
+@read        # All read commands
+@write       # All write commands
+@admin       # Admin commands
+@connection  # Connection commands
+@keyspace    # Keyspace commands
+@pubsub      # Pub/Sub commands
+@fast        # Fast commands
+@slow        # Slow commands
+@all         # All commands

# Exclude categories
-@admin       # No admin commands
-@dangerous   # No dangerous commands

# Individual commands
+get +set +del
-flushdb -flushall -config
```

### ACL Key Patterns

```bash
~user:*        # Access keys matching user:*
~cache:*       # Access keys matching cache:*
~*             # Access all keys
resetkeys      # Reset key patterns
```

### ACL File

```conf
# redis.conf
aclfile /etc/redis/users.acl
```

```
# users.acl
user default on >default_pass ~* +@all -@dangerous
user alice on >alice_pass ~user:* +@read +@write
user readonly on >ro_pass ~* +@read
user admin on >admin_pass ~* +@all
```

```bash
# Reload ACL file
ACL LOAD

# Save current ACL to file
ACL SAVE
```

---

## TLS / SSL

### Configuration

```conf
# redis.conf
port 0                    # Disable plain text
tls-port 6379
tls-cert-file /etc/redis/redis.crt
tls-key-file /etc/redis/redis.key
tls-ca-cert-file /etc/redis/ca.crt
tls-auth-clients yes      # Require client certificates
tls-auth-clients no       # Don't require client certificates
tls-auth-clients optional # Optional client certificates
```

### Connecting with TLS

```bash
redis-cli --tls --cert client.crt --key client.key --cacert ca.crt
```

### Python with TLS

```python
import redis

r = redis.Redis(
    host='localhost',
    port=6379,
    ssl=True,
    ssl_cert_reqs='required',
    ssl_ca_certs='/path/to/ca.crt',
    ssl_certfile='/path/to/client.crt',
    ssl_keyfile='/path/to/client.key',
)
```

---

## Command Renaming / Disabling

```conf
# redis.conf — disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
rename-command DEBUG ""
rename-command KEYS ""

# Rename commands
rename-command CONFIG "CONFIG_a8f3k2j9"
rename-command FLUSHDB "FLUSHDB_x7y2z1"
```

---

## Best Practices

- **Never expose Redis to the internet** without authentication and TLS
- **Use ACLs** to limit user permissions (principle of least privilege)
- **Use strong passwords** (32+ characters, randomly generated)
- **Enable TLS** for all connections
- **Disable dangerous commands** (FLUSHDB, FLUSHALL, CONFIG, DEBUG, KEYS)
- **Use firewalls** to restrict network access
- **Keep Redis updated** with latest security patches
- **Monitor** for suspicious activity
- **Encrypt at rest** (disk encryption for RDB/AOF files)
- **Use separate databases/instances** for different applications
- **Set maxmemory** to prevent memory exhaustion
- **Disable CONFIG command** in production or restrict to admin users

---

## Security Checklist

- [ ] `bind` set to specific interfaces (not `0.0.0.0`)
- [ ] `protected-mode yes`
- [ ] `requirepass` set or ACL configured
- [ ] TLS enabled for remote connections
- [ ] Dangerous commands disabled or renamed
- [ ] Firewall rules in place
- [ ] Non-default port (optional but recommended)
- [ ] ACL users with least privilege
- [ ] Regular security updates
- [ ] Monitoring and alerting configured
- [ ] Disk encryption for persistence files
