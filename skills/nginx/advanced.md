# NGINX Advanced Topics

> **Source**: [nginx.org/en/docs](https://nginx.org/en/docs/index.html)

## SSL/TLS Configuration

### HTTPS Server Setup

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/nginx/certs/example.com.crt;
    ssl_certificate_key /etc/nginx/certs/example.com.key;

    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets on;
}
```

### SSL Module Directives (ngx_http_ssl_module)

| Directive | Default | Description |
|-----------|---------|-------------|
| `ssl_certificate` | — | PEM certificate file |
| `ssl_certificate_key` | — | PEM private key file |
| `ssl_protocols` | TLSv1 TLSv1.1 TLSv1.2 TLSv1.3 | Enabled protocols |
| `ssl_ciphers` | HIGH:!aNULL:!MD5 | Cipher suites |
| `ssl_prefer_server_ciphers` | off | Prefer server ciphers |
| `ssl_dhparam` | — | DH parameters file |
| `ssl_ecdh_curve` | auto | ECDH curve |
| `ssl_session_cache` | none | Session cache type and size |
| `ssl_session_tickets` | on | Session tickets |
| `ssl_session_ticket_key` | — | Ticket key file |
| `ssl_session_timeout` | 10m | Session timeout |
| `ssl_buffer_size` | 16k | Send buffer size |
| `ssl_client_certificate` | — | CA cert for client verification |
| `ssl_trusted_certificate` | — | Trusted CA certs (not sent to client) |
| `ssl_crl` | — | CRL file |
| `ssl_verify_client` | off | Verify client cert (on, off, optional, optional_no_ca) |
| `ssl_verify_depth` | 1 | Verification depth |
| `ssl_handshake_timeout` | 60s | Handshake timeout |
| `ssl_password_file` | — | File with passphrase(s) for key |
| `ssl_alpn` | — | ALPN protocols (e.g., h2, h3) |
| `ssl_conf_command` | — | Arbitrary OpenSSL configuration command |
| `ssl_certificate_cache` | off | Cache for certs specified with variables (1.27.4) |
| `ssl_certificate_compression` | off | TLS 1.3 cert compression (1.29.1) |
| `ssl_early_data` | off | Enable 0-RTT (TLS 1.3) |
| `ssl_reject_handshake` | off | Reject SSL handshake (for catch-all) |
| `ssl_stapling` | off | OCSP stapling |
| `ssl_stapling_verify` | off | Verify OCSP stapling responses |
| `ssl_stapling_file` | — | OCSP stapling file |
| `ssl_stapling_responder` | — | OCSP responder URL |

### Certificate Chains

Include the full chain (server + intermediate certs) in one file:

```bash
cat server.crt intermediate.crt > combined.crt
```

Verify with openssl:

```bash
openssl s_client -connect example.com:443
```

### Single HTTP/HTTPS Server

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name example.com;
    ssl_certificate example.com.crt;
    ssl_certificate_key example.com.key;
}
```

### Name-Based HTTPS Servers (SNI)

Multiple HTTPS servers on one IP using SNI:

```nginx
server {
    listen 443 ssl;
    server_name www.example.com;
    ssl_certificate www.example.com.crt;
}

server {
    listen 443 ssl;
    server_name www.example.org;
    ssl_certificate www.example.org.crt;
}
```

Without SNI support, use separate IPs or a certificate with SubjectAltName:

```nginx
# Wildcard cert for *.example.org
ssl_certificate *.example.org.crt;

# SubjectAltName cert covering example.org and *.example.org
ssl_certificate combined.crt;
```

### OCSP Stapling

```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/certs/trust-chain.crt;
resolver 8.8.8.8;
```

### Client Certificate Verification

```nginx
ssl_client_certificate /etc/nginx/certs/ca.crt;
ssl_verify_client on;
ssl_verify_depth 2;

if ($ssl_client_verify != SUCCESS) {
    return 403;
}
```

### SSL Variables

| Variable | Description |
|----------|-------------|
| `$ssl_protocol` | Protocol used |
| `$ssl_cipher` | Cipher used |
| `$ssl_ciphers` | Supported ciphers (client) |
| `$ssl_client_cert` | Client cert (deprecated) |
| `$ssl_client_escaped_cert` | Client cert (URL-encoded) |
| `$ssl_client_fingerprint` | Client cert SHA1 fingerprint |
| `$ssl_client_i_dn` | Issuer DN |
| `$ssl_client_i_dn_legacy` | Issuer DN (legacy format) |
| `$ssl_client_raw_cert` | Client cert (raw) |
| `$ssl_client_s_dn` | Subject DN |
| `$ssl_client_s_dn_legacy` | Subject DN (legacy format) |
| `$ssl_client_serial` | Client cert serial number |
| `$ssl_client_v_end` | End date of client cert |
| `$ssl_client_v_remain` | Remaining days |
| `$ssl_client_v_start` | Start date of client cert |
| `$ssl_client_verify` | Verification result |
| `$ssl_curves` | Supported curves (client) |
| `$ssl_early_data` | Early data (0-RTT) |
| `$ssl_preread_alpn_protocols` | ALPN from preread (stream) |
| `$ssl_preread_protocol` | SSL protocol from preread (stream) |
| `$ssl_preread_server_name` | SNI from preread (stream) |
| `$ssl_server_name` | SNI server name |
| `$ssl_session_id` | Session ID |
| `$ssl_session_reused` | Whether session was reused |

## HTTP/2

### Enabling HTTP/2

```nginx
server {
    listen 443 ssl http2;
    # HTTP/2 requires SSL in browsers
}
```

### Key Directives (ngx_http_v2_module)

| Directive | Default | Description |
|-----------|---------|-------------|
| `http2_pool_size` | 16k | Pool size for HTTP/2 connections |
| `http2_max_concurrent_streams` | 128 | Max concurrent streams |
| `http2_max_concurrent_pushes` | 10 | Max concurrent pushes |
| `http2_max_field_size` | 4k | Max header field size |
| `http2_max_header_size` | 16k | Max header section size |
| `http2_body_preread_size` | 64k | Pre-read buffer for request body |
| `http2_chunk_size` | 8k | Chunk size for response |
| `http2_idle_timeout` | 180s | Idle timeout |
| `http2_push` | off | Push a resource |
| `http2_push_preload` | off | Convert Link: preload to push |
| `http2_recv_buffer_size` | 256k | Receive buffer |

### Server Push

```nginx
server {
    listen 443 ssl http2;
    http2_push /style.css;
    http2_push /script.js;

    # Or use Link header
    add_header Link "</style.css>; as=style; rel=preload";
    http2_push_preload on;
}
```

## HTTP/3 and QUIC

### Enabling HTTP/3

```nginx
server {
    listen 443 quic reuseport;
    listen 443 ssl;  # Fallback for HTTP/1.1 and HTTP/2
    http3 on;

    ssl_protocols TLSv1.3;  # QUIC requires TLS 1.3
    ssl_certificate     /etc/nginx/certs/example.crt;
    ssl_certificate_key /etc/nginx/certs/example.key;
}
```

### QUIC Directives (ngx_http_v3_module)

| Directive | Default | Description |
|-----------|---------|-------------|
| `http3` | off | Enable HTTP/3 |
| `http3_hq` | off | Enable HTTP/3 compatibility mode |
| `http3_max_concurrent_streams` | 128 | Max concurrent streams |
| `http3_stream_buffer_size` | 64k | Stream buffer size |
| `quic_retry` | off | Enable address validation |
| `quic_gso` | off | Enable GSO (Generic Segmentation Offloading) |
| `quic_host_key` | — | Host key for tokens |
| `quic_active_connection_id_limit` | 2 | Max connection IDs |

### Advertising HTTP/3

```nginx
add_header Alt-Svc 'h3=":443"; ma=86400';
```

### Building with QUIC Support

```bash
# With BoringSSL
./configure --with-debug --with-http_v3_module \
    --with-cc-opt="-I../boringssl/include" \
    --with-ld-opt="-L../boringssl/build -lstdc++"

# With QuicTLS
./configure --with-debug --with-http_v3_module \
    --with-cc-opt="-I../quictls/build/include" \
    --with-ld-opt="-L../quictls/build/lib"

# With LibreSSL
./configure --with-debug --with-http_v3_module \
    --with-cc-opt="-I../libressl/build/include" \
    --with-ld-opt="-L../libressl/build/lib"
```

OpenSSL 3.5.1+ is recommended. QUIC requires TLSv1.3.

### 0-RTT Early Data

```nginx
ssl_early_data on;
```

Note: 0-RTT data is replayable. Use `$ssl_early_data` variable to check and protect against replay attacks.

### QUIC Troubleshooting

- Verify nginx is built with proper SSL library (`nginx -V`)
- Ensure client actually sends QUIC (test with `ngtcp2` first)
- Build with debug support and check debug log (filter by "quic" prefix)
- Debug macros: `NGX_QUIC_DEBUG_PACKETS`, `NGX_QUIC_DEBUG_FRAMES`, `NGX_QUIC_DEBUG_ALLOC`, `NGX_QUIC_DEBUG_CRYPTO`

## Load Balancing

### Methods Overview

| Method | Directive | Use Case |
|--------|-----------|----------|
| Round Robin | (default) | General purpose, equal capacity servers |
| Weighted Round Robin | `weight=N` | Different capacity servers |
| Least Connections | `least_conn` | Long-lived connections |
| IP Hash | `ip_hash` | Sticky sessions by client IP |
| Generic Hash | `hash key [consistent]` | Custom hash key, consistent hashing |
| Random | `random [two [method]]` | Random distribution |

### Weighted Load Balancing

```nginx
upstream backend {
    server srv1.example.com weight=3;
    server srv2.example.com;
    server srv3.example.com;
}
# Every 5 requests: 3 to srv1, 1 to srv2, 1 to srv3
```

### Least Connections

```nginx
upstream backend {
    least_conn;
    server srv1.example.com;
    server srv2.example.com;
}
```

### IP Hash (Sticky Sessions)

```nginx
upstream backend {
    ip_hash;
    server srv1.example.com;
    server srv2.example.com;
    server srv3.example.com down;  # temporarily remove
}
```

### Consistent Hashing

```nginx
upstream backend {
    hash $request_uri consistent;
    server srv1.example.com;
    server srv2.example.com;
}
```

### Health Checks

#### Passive (In-Band) — Free

```nginx
upstream backend {
    server srv1.example.com max_fails=3 fail_timeout=30s;
    server srv2.example.com max_fails=3 fail_timeout=30s;
    server srv3.example.com backup;
}
```

#### Active — NGINX Plus

```nginx
upstream backend {
    zone backend 64k;
    server srv1.example.com;
    server srv2.example.com;
}

server {
    location / {
        proxy_pass http://backend;
        health_check interval=10s fails=3 passes=2;
        health_check_timeout 5s;
    }
}
```

### Session Persistence — NGINX Plus

```nginx
upstream backend {
    sticky cookie srv_id expires=1h domain=.example.com path=/;
    server srv1.example.com;
    server srv2.example.com;
}

# Or with route
upstream backend {
    sticky route $route_cookie $route_uri;
    server srv1.example.com route=a;
    server srv2.example.com route=b;
}

# Or with learn
upstream backend {
    sticky learn create=$upstream_cookie_examplecookie
                  lookup=$cookie_examplecookie
                  zone=client_sessions:1m;
    server srv1.example.com;
    server srv2.example.com;
}
```

### Dynamic Upstream Configuration — NGINX Plus

```nginx
upstream backend {
    zone backend 64k;
    state /var/lib/nginx/state/servers.conf;
}
```

Reconfigure via API without reloading:

```bash
curl -X POST http://localhost/api/6/http/upstreams/backend/servers \
    -d '{"server":"192.168.1.10:8080","weight":2}'
```

## Reverse Proxy

### Basic Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Proxy with Upstream

```nginx
upstream app_servers {
    server 127.0.0.1:8080 weight=2;
    server 127.0.0.1:8081;
    keepalive 32;
}

server {
    location / {
        proxy_pass http://app_servers;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

### Proxy Next Upstream

```nginx
proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
proxy_next_upstream_tries 3;
proxy_next_upstream_timeout 30s;
```

### Proxy to HTTPS Backend

```nginx
location /api/ {
    proxy_pass https://api-backend.example.com;
    proxy_ssl_server_name on;
    proxy_ssl_name api-backend.example.com;
    proxy_ssl_protocols TLSv1.2 TLSv1.3;
}
```

## Security

### Rate Limiting

```nginx
# Define rate limit zone
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        limit_req_status 429;
        limit_req_log_level error;
    }
}
```

### Connection Limiting

```nginx
limit_conn_zone $binary_remote_addr zone=conn_per_ip:10m;

server {
    location / {
        limit_conn conn_per_ip 10;
        limit_conn_status 503;
    }
}
```

### Access Control

```nginx
location /admin/ {
    allow 10.0.0.0/8;
    allow 192.168.1.0/24;
    deny all;
}
```

### Basic Authentication

```nginx
location /protected/ {
    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### Subrequest Authentication

```nginx
location / {
    auth_request /auth;
    proxy_pass http://backend;
}

location = /auth {
    internal;
    proxy_pass http://auth-server/check;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
}
```

### DDoS Protection

```nginx
# Limit connections per IP
limit_conn_zone $binary_remote_addr zone=addr:10m;

# Limit request rate
limit_req_zone $binary_remote_addr zone=req_limit:10m rate=5r/s;

# Limit body size
client_max_body_size 1m;

# Timeout settings
client_body_timeout 10s;
client_header_timeout 10s;
send_timeout 10s;

server {
    limit_conn addr 10;
    limit_req zone=req_limit burst=10 nodelay;
}
```

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

## Performance Tuning

### Worker Configuration

```nginx
worker_processes auto;        # Set to number of CPU cores
worker_cpu_affinity auto;     # Bind workers to CPUs
worker_rlimit_nofile 65535;   # File descriptor limit

events {
    worker_connections 10240;  # Connections per worker
    multi_accept on;           # Accept all connections at once
    use epoll;                 # Use epoll on Linux
}
```

### Sendfile and TCP

```nginx
sendfile on;           # Use sendfile() for static files
tcp_nopush on;         # Send headers in one TCP packet
tcp_nodelay on;        # Disable Nagle's algorithm
```

### Keepalive

```nginx
http {
    keepalive_timeout 65s;
    keepalive_requests 1000;
    keepalive_disable msie6;  # Disable for specific clients
}

# Upstream keepalive
upstream backend {
    server 127.0.0.1:8080;
    keepalive 32;
    keepalive_requests 1000;
    keepalive_timeout 60s;
}
```

### Compression

```nginx
gzip on;
gzip_min_length 1024;
gzip_comp_level 5;
gzip_types text/plain text/css application/json application/javascript
           text/xml application/xml application/xml+rss text/javascript
           image/svg+xml;
gzip_vary on;
gzip_proxied any;
gzip_disable "MSIE [1-6]\.";

# Brotli (if compiled with ngx_brotli)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript
             text/xml application/xml image/svg+xml;
```

### Caching

```nginx
proxy_cache_path /var/cache/nginx levels=1:2
                 keys_zone=cache:10m max_size=1g
                 inactive=60m use_temp_path=off;

server {
    location / {
        proxy_cache cache;
        proxy_cache_key $scheme$request_method$host$request_uri;
        proxy_cache_valid 200 301 302 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating
                              http_500 http_502 http_503 http_504;
        proxy_cache_background_update on;
        proxy_cache_lock on;
        proxy_cache_revalidate on;
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

### Open File Cache

```nginx
open_file_cache max=10000 inactive=5m;
open_file_cache_valid 60s;
open_file_cache_min_uses 2;
open_file_cache_errors on;
```

### Thread Pools

For blocking operations (e.g., large file I/O):

```nginx
thread_pool default threads=32 max_queue=65536;

location /downloads/ {
    aio threads;
    sendfile on;
    directio 8m;
    output_buffers 2 32k;
}
```

### Buffer Sizes

```nginx
client_body_buffer_size 16k;
client_header_buffer_size 4k;
large_client_header_buffers 4 16k;

proxy_buffer_size 8k;
proxy_buffers 16 32k;
proxy_busy_buffers_size 64k;
```

## Logging

### Access Log

```nginx
log_format main '$remote_addr - $remote_user [$time_local] '
                '"$request" $status $body_bytes_sent '
                '"$http_referer" "$http_user_agent" '
                'rt=$request_time uct="$upstream_connect_time" '
                'uht="$upstream_header_time" urt="$upstream_response_time"';

log_format json escape=json '{'
    '"time":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"request":"$request",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"upstream_response_time":"$upstream_response_time"'
    '}';

access_log /var/log/nginx/access.log main;
access_log /var/log/nginx/access.json json buffer=64k flush=5s;
```

### Error Log

```nginx
error_log /var/log/nginx/error.log warn;
error_log /var/log/nginx/error.log debug;  # Requires --with-debug
error_log syslog:server=192.168.1.1:514 warn;
error_log memory:32m debug;
```

### Log Rotation

```bash
# Rename log file
mv /var/log/nginx/access.log /var/log/nginx/access.log.old

# Send USR1 to nginx to reopen log files
kill -USR1 $(cat /var/run/nginx.pid)
```

## Variables Reference

### Core HTTP Variables

| Variable | Description |
|----------|-------------|
| `$arg_name` | Request argument `name` |
| `$args` | Full query string |
| `$body_bytes_sent` | Bytes sent to client (body only) |
| `$bytes_sent` | Total bytes sent to client |
| `$connection` | Connection serial number |
| `$connection_requests` | Number of requests in connection |
| `$content_length` | Content-Length header |
| `$content_type` | Content-Type header |
| `$cookie_name` | Cookie `name` |
| `$document_root` | Root directory for current request |
| `$document_uri` | Same as `$uri` |
| `$host` | Host header (lowercase) or server name |
| `$hostname` | Machine hostname |
| `$http_name` | Arbitrary request header `name` |
| `$https` | "on" if SSL, else "" |
| `$is_args` | "?" if args exist, else "" |
| `$msec` | Current time in seconds with milliseconds |
| `$nginx_version` | NGINX version |
| `$pid` | Worker process PID |
| `$pipe` | "p" if pipelined, "." otherwise |
| `$proxy_protocol_addr` | Source IP from PROXY protocol |
| `$proxy_protocol_port` | Source port from PROXY protocol |
| `$query_string` | Same as `$args` |
| `$realpath_root` | Real path of root/alias |
| `$remote_addr` | Client IP |
| `$remote_port` | Client port |
| `$remote_user` | Authenticated user |
| `$request` | Full original request line |
| `$request_body` | Request body (may not be available) |
| `$request_body_file` | Temp file with request body |
| `$request_completion` | "OK" if completed, "" otherwise |
| `$request_filename` | File path for current request |
| `$request_id` | Unique 16-byte hex request ID |
| `$request_length` | Request length (including line and headers) |
| `$request_method` | Request method (GET, POST, etc.) |
| `$request_time` | Total request processing time |
| `$request_uri` | Full original request URI with arguments |
| `$scheme` | Request scheme (http or https) |
| `$sent_http_name` | Arbitrary response header `name` |
| `$server_addr` | Server IP accepting the request |
| `$server_name` | Server name of the server handling the request |
| `$server_port` | Server port |
| `$server_protocol` | Request protocol (HTTP/1.0, HTTP/1.1, HTTP/2.0) |
| `$status` | Response status code |
| `$tcpinfo_rtt`, `$tcpinfo_rttvar`, `$tcpinfo_snd_cwnd`, `$tcpinfo_rcv_space` | TCP info |
| `$time_iso8601` | ISO 8601 timestamp |
| `$time_local` | Common log format timestamp |
| `$uri` | Current normalized URI (may change during processing) |

### Upstream Variables

| Variable | Description |
|----------|-------------|
| `$upstream_addr` | Upstream server address |
| `$upstream_cache_status` | Cache hit/miss status |
| `$upstream_connect_time` | Time to connect to upstream |
| `$upstream_header_time` | Time to receive first header byte |
| `$upstream_response_length` | Response length from upstream |
| `$upstream_response_time` | Response time from upstream |
| `$upstream_status` | Upstream response status code |
| `$upstream_bytes_sent` | Bytes sent to upstream |
| `$upstream_bytes_received` | Bytes received from upstream |

## Converting Rewrite Rules

### From Apache mod_rewrite

Apache:
```apache
RewriteCond %{HTTP_HOST} example.org
RewriteRule (.*) http://www.example.org$1
```

NGINX:
```nginx
server {
    listen 80;
    server_name www.example.org;
    return 301 http://www.example.org$request_uri;
}

server {
    listen 80 default_server;
    server_name _;
    return 301 http://www.example.org$request_uri;
}
```

### Converting from .htaccess

Move rules to `server` or `location` blocks. Replace `RewriteRule` with `rewrite` or `return`.

## Full Configuration Example

```nginx
user nginx;
worker_processes auto;
worker_cpu_affinity auto;
worker_rlimit_nofile 65535;
pid /var/run/nginx.pid;

events {
    worker_connections 10240;
    multi_accept on;
    use epoll;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65s;
    keepalive_requests 1000;
    server_tokens off;

    gzip on;
    gzip_min_length 1024;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;
    gzip_vary on;

    open_file_cache max=10000 inactive=5m;
    open_file_cache_valid 60s;
    open_file_cache_min_uses 2;

    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_conn_zone $binary_remote_addr zone=conn:10m;

    proxy_cache_path /var/cache/nginx levels=1:2
                     keys_zone=cache:10m max_size=1g
                     inactive=60m use_temp_path=off;

    upstream backend {
        least_conn;
        server 127.0.0.1:8080 weight=2;
        server 127.0.0.1:8081;
        keepalive 32;
    }

    server {
        listen 80;
        server_name example.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        listen 443 quic reuseport;
        server_name example.com;

        ssl_certificate     /etc/nginx/certs/example.com.crt;
        ssl_certificate_key /etc/nginx/certs/example.com.key;
        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        ssl_session_cache   shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_stapling on;
        ssl_stapling_verify on;

        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Alt-Svc 'h3=":443"; ma=86400' always;

        root /var/www/html;
        index index.html index.php;

        limit_req zone=api burst=20 nodelay;
        limit_conn conn 10;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache cache;
            proxy_cache_valid 200 10m;
            proxy_cache_use_stale error timeout updating;
        }

        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        location ~ /\. {
            deny all;
        }
    }
}
```

**Source**: [SSL Module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html) | [Configuring HTTPS Servers](https://nginx.org/en/docs/http/configuring_https_servers.html) | [HTTP/2 Module](https://nginx.org/en/docs/http/ngx_http_v2_module.html) | [HTTP/3 Module](https://nginx.org/en/docs/http/ngx_http_v3_module.html) | [QUIC and HTTP/3](https://nginx.org/en/docs/quic.html) | [Load Balancing](https://nginx.org/en/docs/http/load_balancing.html) | [Upstream Module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html) | [Proxy Module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) | [WebSocket Proxying](https://nginx.org/en/docs/http/websocket.html) | [Converting Rewrite Rules](https://nginx.org/en/docs/http/converting_rewrite_rules.html) | [Variables Index](https://nginx.org/en/docs/varindex.html) | [Directives Index](https://nginx.org/en/docs/dirindex.html) | [Core Module](https://nginx.org/en/docs/ngx_core_module.html) | [Debugging Log](https://nginx.org/en/docs/debugging_log.html) | [Syslog](https://nginx.org/en/docs/syslog.html) | [Hash Setup](https://nginx.org/en/docs/hash.html) | [Configuration Units](https://nginx.org/en/docs/syntax.html)
