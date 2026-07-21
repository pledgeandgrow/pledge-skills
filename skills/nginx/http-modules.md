# NGINX HTTP Modules Reference

> **Source**: [nginx.org/en/docs/http](https://nginx.org/en/docs/http/ngx_http_core_module.html)

## Core Module (ngx_http_core_module)

### Server and Location Configuration

#### `server { ... }`

Sets configuration for a virtual server. Multiple servers can listen on the same port, distinguished by `server_name` or IP.

```nginx
http {
    server {
        listen 80;
        server_name example.org www.example.org;
        root /data/www;
    }
}
```

#### `listen address:port [parameters]`

Configures the listening socket for the server.

Common parameters:
- `default_server` — Mark as default for this port
- `ssl` — Enable SSL/TLS
- `http2` — Enable HTTP/2
- `quic` — Enable HTTP/3 (QUIC)
- `reuseport` — Enable SO_REUSEPORT for multiple workers
- `backlog=number` — Set listen backlog
- `rcvbuf=size`, `sndbuf=size` — Set socket buffer sizes
- `deferred` — Use TCP_DEFER_ACCEPT (Linux)
- `bind` — Force bind to address:port
- `ipv6only=on|off` — Enable/disable IPv6-only socket
- `so_keepalive` — Enable TCP keepalive

```nginx
listen 80;
listen 443 ssl;
listen 443 quic reuseport;
listen [::]:80 ipv6only=on;
```

#### `server_name name ...`

Sets virtual server names. Supports exact names, wildcards, and regex.

```nginx
server_name example.org www.example.org;
server_name *.example.org;
server_name ~^www\d+\.example\.org$;
server_name "";  # matches requests without Host header
```

#### `location [ = | ~ | ~* | ^~ ] uri { ... }`

Configures matching of request URIs.

- `=` — Exact match (stops searching)
- `~` — Case-sensitive regex
- `~*` — Case-insensitive regex
- `^~` — Prefix match (stops regex search if matched)
- No modifier — Prefix match

```nginx
location = /exact {
    # exact match only
}

location ^~ /static/ {
    # prefix match, stops regex search
}

location ~* \.(gif|jpg|png)$ {
    # case-insensitive regex
}

location / {
    # default prefix match
}
```

#### `root path`

Sets the root directory for requests. The URI is appended to the path.

```nginx
location /images/ {
    root /data;
}
# Request /images/cat.png → /data/images/cat.png
```

#### `alias path`

Defines a replacement for the location prefix.

```nginx
location /i/ {
    alias /data/w3/images/;
}
# Request /i/top.gif → /data/w3/images/top.gif
```

#### `try_files file ... uri`

Checks existence of files in order, uses the last as fallback.

```nginx
location / {
    try_files $uri $uri/ /index.php?$args;
}
```

#### `error_page code ... [=[response]] uri`

Defines custom error pages.

```nginx
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;
error_page 404 =200 /empty.gif;
error_page 403 =301 https://example.com/forbidden.html;
```

#### `internal`

Marks a location as internal-only (accessible only via internal redirects).

```nginx
location /internal/ {
    internal;
    root /data/internal;
}
```

### Client Request Handling

| Directive | Default | Context | Description |
|-----------|---------|---------|-------------|
| `client_body_buffer_size` | 8k/16k | http, server, location | Buffer size for reading client request body |
| `client_body_temp_path` | client_body_temp | http, server, location | Directory for temporary body files |
| `client_body_timeout` | 60s | http, server, location | Timeout between two read operations |
| `client_header_buffer_size` | 1k | http, server | Buffer size for reading request header |
| `client_header_timeout` | 60s | http, server | Timeout for reading request header |
| `client_max_body_size` | 1m | http, server, location | Max request body size |
| `client_body_in_file_only` | off | http, server, location | Save request body to file |
| `client_body_in_single_buffer` | off | http, server, location | Save body in single buffer |
| `large_client_header_buffers` | 4 8k | http, server | Buffers for large request headers |
| `keepalive_timeout` | 75s | http, server, location | Keep-alive client timeout |
| `keepalive_requests` | 1000 | http, server, location | Max requests per keep-alive connection |
| `send_timeout` | 60s | http, server, location | Timeout for sending response to client |
| `server_tokens` | on | http, server, location | Show nginx version in error responses |
| `etag` | on | http, server, location | Enable/disable ETag generation |
| `if_modified_since` | exact | http, server, location | How to compare If-Modified-Since |
| `ignore_invalid_headers` | on | http, server | Ignore header fields with invalid names |
| `merge_slashes` | on | http, server | Merge multiple slashes in URI |
| `underscores_in_headers` | off | http, server | Allow underscores in header names |
| `absolute_redirect` | off | http, server, location | Use absolute URLs in redirects |
| `server_name_in_redirect` | off | http, server, location | Use server_name in redirects |
| `port_in_redirect` | on | http, server, location | Include port in redirects |
| `msie_padding` | on | http, server, location | Pad responses for MSIE clients |
| `msie_refresh` | off | http, server, location | Enable refresh for MSIE |
| `log_not_found` | on | http, server, location | Log "not found" errors |
| `log_subrequest` | off | http, server, location | Log subrequests |
| `recursive_error_pages` | off | http, server, location | Enable recursive error_page |
| `server_names_hash_max_size` | 512 | http | Max size of server names hash |
| `server_names_hash_bucket_size` | depends | http | Bucket size for server names hash |
| `variables_hash_max_size` | 1024 | http | Max size of variables hash |
| `variables_hash_bucket_size` | 64 | http | Bucket size for variables hash |
| `postpone_output` | 1460 | http, server, location | Buffer size for postponed output |
| `client_header_timeout` | 60s | http, server | Timeout for reading client header |

### File Processing

| Directive | Default | Context | Description |
|-----------|---------|---------|-------------|
| `index file ...` | index.html | http, server, location | Index file names |
| `autoindex on\|off` | off | http, server, location | Enable directory listing |
| `autoindex_exact_size` | on | http, server, location | Show exact sizes in listing |
| `autoindex_localtime` | off | http, server, location | Use local time in listing |
| `autoindex_format` | html | http, server, location | Format: html, xml, json, jsonp |
| `types { ... }` | — | http, server, location | MIME type mappings |
| `default_type` | text/plain | http, server, location | Default MIME type |
| `types_hash_max_size` | 1024 | http, server | Max size of types hash |
| `types_hash_bucket_size` | 64 | http, server | Bucket size for types hash |
| `sendfile on\|off` | off | http, server, location | Enable sendfile() |
| `sendfile_max_chunk` | 0 | http, server, location | Max chunk for sendfile |
| `aio on\|off\|sendfile` | off | http, server, location | Enable asynchronous I/O |
| `directio size\|off` | off | http, server, location | Enable direct I/O |
| `directio_alignment` | 512 | http, server, location | Alignment for direct I/O |
| `output_buffers` | 2 32k | http, server, location | Buffers for reading from disk |
| `limit_rate` | 0 | http, server, location | Rate limit response to client |
| `limit_rate_after` | 0 | http, server, location | Don't rate limit until this much sent |
| `internal_redirect uri` | — | location | Internal redirect (1.23.4+) |

### WebSocket Proxying

```nginx
location /chat/ {
    proxy_pass http://backend;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Dynamic Connection header:

```nginx
http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        location /chat/ {
            proxy_pass http://backend;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
        }
    }
}
```

## Proxy Module (ngx_http_proxy_module)

### Core Proxy Directives

#### `proxy_pass URL`

Sets the protocol and address of a proxied server.

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
}

# With URI part
location /api/ {
    proxy_pass http://backend/api/;
}

# With variables (no URI part change)
location / {
    proxy_pass http://$backend;
    resolver 127.0.0.1;
}
```

#### `proxy_set_header field value`

Sets headers passed to the proxied server.

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

### Proxy Buffering

| Directive | Default | Description |
|-----------|---------|-------------|
| `proxy_buffering` | on | Enable/disable response buffering |
| `proxy_buffer_size` | 4k/8k | Buffer for first part of response |
| `proxy_buffers` | 8 4k/8k | Number and size of buffers |
| `proxy_busy_buffers_size` | 8k/16k | Max busy buffers while response not fully read |
| `proxy_max_temp_file_size` | 1024m | Max temp file size |
| `proxy_temp_file_write_size` | 8k/16k | Size of data to write to temp file |
| `proxy_temp_path` | proxy_temp | Directory for temp files |
| `proxy_request_buffering` | on | Buffer request body before sending |

### Proxy Caching

| Directive | Default | Description |
|-----------|---------|-------------|
| `proxy_cache zone\|off` | off | Define shared memory zone for caching |
| `proxy_cache_key string` | $scheme$proxy_host$request_uri | Cache key |
| `proxy_cache_path path ...` | — | Set cache path and parameters |
| `proxy_cache_valid [code ...] time` | — | Set cache time for response codes |
| `proxy_cache_use_stale` | off | Use stale cache in error conditions |
| `proxy_cache_bypass string` | — | Conditions to bypass cache |
| `proxy_no_cache string` | — | Conditions to not store in cache |
| `proxy_cache_background_update` | off | Background update of stale cache |
| `proxy_cache_lock` | off | Limit concurrent cache fills |
| `proxy_cache_lock_timeout` | 5s | Timeout for cache lock |
| `proxy_cache_revalidate` | off | Revalidate stale items |
| `proxy_cache_convert_head` | on | Convert HEAD to GET for caching |
| `proxy_cache_min_uses` | 1 | Min uses before caching |

```nginx
http {
    proxy_cache_path /data/nginx/cache levels=1:2 keys_zone=one:10m
                     max_size=1g inactive=60m use_temp_path=off;

    server {
        location / {
            proxy_cache one;
            proxy_cache_key $host$request_uri;
            proxy_cache_valid 200 302 10m;
            proxy_cache_valid 404 1m;
            proxy_cache_use_stale error timeout updating;
        }
    }
}
```

### Proxy Timeouts

| Directive | Default | Description |
|-----------|---------|-------------|
| `proxy_connect_timeout` | 60s | Connection timeout to upstream |
| `proxy_send_timeout` | 60s | Timeout for sending request to upstream |
| `proxy_read_timeout` | 60s | Timeout for reading response from upstream |
| `proxy_next_upstream_timeout` | 0 | Timeout for trying next upstream |
| `proxy_next_upstream_tries` | 0 | Number of tries for next upstream |

### Proxy SSL

| Directive | Default | Description |
|-----------|---------|-------------|
| `proxy_ssl_server_name` | off | Send SNI during upstream connection |
| `proxy_ssl_name` | $proxy_host | Server name for SNI/verification |
| `proxy_ssl_protocols` | TLSv1 TLSv1.1 TLSv1.2 TLSv1.3 | SSL protocols for upstream |
| `proxy_ssl_certificate` | — | Client certificate for upstream |
| `proxy_ssl_certificate_key` | — | Client key for upstream |
| `proxy_ssl_verify` | off | Verify upstream certificate |
| `proxy_ssl_verify_depth` | 1 | Verification depth |
| `proxy_ssl_session_reuse` | on | Reuse SSL sessions |

## Upstream Module (ngx_http_upstream_module)

### Defining Server Groups

```nginx
upstream backend {
    server 127.0.0.1:8080 weight=3;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082 backup;
}
```

### Load Balancing Methods

#### Round Robin (default)

Distributes requests in round-robin fashion with optional weights.

```nginx
upstream backend {
    server srv1.example.com weight=3;
    server srv2.example.com;
    server srv3.example.com;
}
```

#### Least Connections (`least_conn`)

Sends request to server with least active connections.

```nginx
upstream backend {
    least_conn;
    server srv1.example.com;
    server srv2.example.com;
}
```

#### IP Hash (`ip_hash`)

Sticky sessions based on client IP.

```nginx
upstream backend {
    ip_hash;
    server srv1.example.com;
    server srv2.example.com;
}
```

#### Generic Hash (`hash`)

Hash-based load balancing with optional consistent hashing.

```nginx
upstream backend {
    hash $request_uri consistent;
    server srv1.example.com;
    server srv2.example.com;
}
```

#### Random (`random`)

Random load balancing with optional "two choices" selection.

```nginx
upstream backend {
    random two least_conn;
    server srv1.example.com;
    server srv2.example.com;
}
```

### Server Parameters

| Parameter | Description |
|-----------|-------------|
| `weight=number` | Server weight (default: 1) |
| `max_fails=number` | Max failed attempts (default: 1, 0=disabled) |
| `fail_timeout=time` | Time to count max_fails, and to mark as failed (default: 10s) |
| `backup` | Backup server (used when primary servers are down) |
| `down` | Mark server as permanently unavailable |
| `resolve` | Monitor changes of IP addresses |
| `route=string` | Session affinity route (commercial) |
| `service=name` | Resolve SRV records (commercial) |
| `slow_start=time` | Gradual recovery (commercial) |
| `drain` | Drain mode (commercial) |
| `max_conns=number` | Max concurrent connections (commercial) |

### Keepalive Connections

```nginx
upstream backend {
    server 127.0.0.1:8080;
    keepalive 16;
    keepalive_requests 1000;
    keepalive_timeout 60s;
}
```

### Shared State Zone

```nginx
upstream backend {
    zone backend 64k;
    server 127.0.0.1:8080;
}
```

### State File

```nginx
upstream backend {
    state /var/lib/nginx/state/servers.conf;
}
```

### Health Checks

Passive (in-band) health checks via `max_fails` and `fail_timeout`:

```nginx
upstream backend {
    server srv1.example.com max_fails=3 fail_timeout=30s;
    server srv2.example.com max_fails=3 fail_timeout=30s;
}
```

Active health checks (NGINX Plus only) via `ngx_http_upstream_hc_module`:

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
    }
}
```

## Rewrite Module (ngx_http_rewrite_module)

### `rewrite regex replacement [flag]`

Changes URI based on regex match.

Flags:
- `last` — Stop processing, search for new location match
- `break` — Stop processing, continue in current location
- `redirect` — Return 302 redirect
- `permanent` — Return 301 redirect

```nginx
server {
    rewrite ^(/download/.*)/media/(.*)\..*$ $1/mp3/$2.mp3 last;
    rewrite ^(/download/.*)/audio/(.*)\..*$ $1/mp3/$2.ra last;
    return 403;
}

location /download/ {
    rewrite ^(/download/.*)/media/(.*)\..*$ $1/mp3/$2.mp3 break;
    rewrite ^(/download/.*)/audio/(.*)\..*$ $1/mp3/$2.ra break;
    return 403;
}
```

### `return code [text]` / `return code URL`

Returns response with specified code.

```nginx
return 301 https://example.com$request_uri;
return 404;
return 444;  # close connection without response
```

### `if (condition) { ... }`

Conditional processing. Use sparingly — `if` is evil in location context.

```nginx
if ($http_user_agent ~ MSIE) {
    rewrite ^(.*)$ /msie/$1 break;
}

if ($slow) {
    limit_rate 10k;
}
```

### `set $variable value`

Sets a variable.

```nginx
set $foo "bar";
set $full_path $document_root$uri;
```

### `rewrite_log on | off`

Enables logging of rewrite processing at `notice` level.

## FastCGI Module (ngx_http_fastcgi_module)

### `fastcgi_pass address`

Passes request to a FastCGI server.

```nginx
location ~ \.php$ {
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

### Key Directives

| Directive | Default | Description |
|-----------|---------|-------------|
| `fastcgi_param` | — | Pass parameter to FastCGI server |
| `fastcgi_index` | — | File name appended after URI |
| `fastcgi_split_path_info` | — | Split URI into script and path_info |
| `fastcgi_buffering` | on | Buffer FastCGI responses |
| `fastcgi_buffers` | 8 4k/8k | Number and size of buffers |
| `fastcgi_buffer_size` | 4k/8k | Buffer for first part of response |
| `fastcgi_cache` | off | Cache zone |
| `fastcgi_cache_path` | — | Cache path and parameters |
| `fastcgi_cache_key` | — | Cache key |
| `fastcgi_cache_valid` | — | Cache time per response code |
| `fastcgi_connect_timeout` | 60s | Connection timeout |
| `fastcgi_send_timeout` | 60s | Send timeout |
| `fastcgi_read_timeout` | 60s | Read timeout |
| `fastcgi_pass_header` | — | Pass header from FastCGI to client |
| `fastcgi_hide_header` | — | Hide header from client |
| `fastcgi_intercept_errors` | off | Handle errors from FastCGI server |

## Other HTTP Modules

### Access Control (ngx_http_access_module)

```nginx
location / {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
}
```

### Basic Authentication (ngx_http_auth_basic_module)

```nginx
location /admin/ {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### Auth Request (ngx_http_auth_request_module)

Subrequest-based authentication:

```nginx
location /private/ {
    auth_request /auth;
    proxy_pass http://backend;
}

location = /auth {
    proxy_pass http://auth-server/validate;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header X-Original-URI $request_uri;
}
```

### Auth JWT (ngx_http_auth_jwt_module)

JWT token validation (commercial):

```nginx
location /api/ {
    auth_jwt "API";
    auth_jwt_key_file /etc/nginx/jwt_keys.pem;
    auth_jwt_alg RS256;
}
```

### Gzip (ngx_http_gzip_module)

```nginx
gzip on;
gzip_min_length 1000;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_vary on;
gzip_proxied any;
gzip_disable "MSIE [1-6]\.";
```

### Headers (ngx_http_headers_module)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-XSS-Protection "1; mode=block" always;

expires 1d;
expires max;
expires off;
```

### Limit Connection (ngx_http_limit_conn_module)

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    location /download/ {
        limit_conn addr 10;
    }
}
```

### Limit Request Rate (ngx_http_limit_req_module)

```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;

server {
    location /search/ {
        limit_req zone=one burst=5 nodelay;
    }
}
```

### Logging (ngx_http_log_module)

```nginx
log_format main '$remote_addr - $remote_user [$time_local] '
                '"$request" $status $body_bytes_sent '
                '"$http_referer" "$http_user_agent" '
                '$request_time $upstream_response_time';

access_log /var/log/nginx/access.log main;
access_log /var/log/nginx/api.log api_buffer;
access_log off;
```

### Map (ngx_http_map_module)

```nginx
map $http_host $server_root {
    default       /data/www;
    example.org   /data/example;
    *.example.org /data/wildcard;
}
```

### Geo (ngx_http_geo_module)

```nginx
geo $country {
    default        ZZ;
    10.0.0.0/8     US;
    172.16.0.0/12  US;
    192.168.0.0/16 RU;
    ranges {
        10.0.0.0-10.255.255.255  US;
    }
}
```

### Real IP (ngx_http_realip_module)

```nginx
set_real_ip_from 192.168.1.0/24;
set_real_ip_from 10.0.0.0/8;
real_ip_header X-Forwarded-For;
real_ip_recursive on;
```

### Referer (ngx_http_referer_module)

```nginx
valid_referers none blocked server_names *.example.org ~\.google\.;

if ($invalid_referer) {
    return 403;
}
```

### SSI (ngx_http_ssi_module)

```nginx
location / {
    ssi on;
    ssi_silent_errors on;
}
```

### Sub Filter (ngx_http_sub_module)

```nginx
location / {
    sub_filter 'href="http://127.0.0.1:8080/' 'href="https://$host/';
    sub_filter_once on;
}
```

### Browser (ngx_http_browser_module)

```nginx
modern_browser MSIE 10;
ancient_browser MSIE 6;
```

### Charset (ngx_http_charset_module)

```nginx
charset utf-8;
source_charset koi8-r;
```

### Slice (ngx_http_slice_module)

Splits a request into subrequests for ranged caching:

```nginx
location / {
    slice 1m;
    proxy_cache cache;
    proxy_cache_key $uri$is_args$args$slice_range;
    proxy_set_header Range $slice_range;
}
```

### Split Clients (ngx_http_split_clients_module)

A/B testing or gradual rollout:

```nginx
split_clients "${remote_addr}AAA" $variant {
    0.5%       .one;
    2.0%       .two;
    *          "";
}
```

### Mirror (ngx_http_mirror_module)

Mirror traffic to a test backend:

```nginx
location / {
    mirror /mirror;
    mirror_request_body off;
    proxy_pass http://backend;
}

location = /mirror {
    internal;
    proxy_pass http://test_backend;
}
```

### Secure Link (ngx_http_secure_link_module)

```nginx
location /download/ {
    secure_link $arg_md5,$arg_expires;
    secure_link_md5 "$secure_link_expires$uri$remote_addr secret";

    if ($secure_link = "") {
        return 403;
    }
    if ($secure_link = "0") {
        return 410;
    }
}
```

### Addition (ngx_http_addition_module)

```nginx
location / {
    add_before_body /before.html;
    add_after_body  /after.html;
}
```

### Index (ngx_http_index_module)

Defines files used as the directory index:

```nginx
location / {
    index index.html index.htm index.php;
}
```

| Directive | Default | Context | Description |
|-----------|---------|---------|-------------|
| `index file ...` | index.html | http, server, location | Index file names, checked in order |
| `index` with variables | — | http, server, location | Variables supported in file names |

```nginx
# Dynamic index based on $arg
location / {
    index index.$geo.html index.html;
}
```

### Autoindex (ngx_http_autoindex_module)

```nginx
location /files/ {
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;
    autoindex_format json;
}
```

### DAV (ngx_http_dav_module)

```nginx
location /webdav/ {
    dav_methods PUT DELETE MKCOL COPY MOVE;
    dav_ext_methods PROPFIND OPTIONS;
    create_full_put_path on;
    dav_access user:rw group:rw all:r;
}
```

### Image Filter (ngx_http_image_filter_module)

```nginx
location /img/ {
    image_filter resize 150 100;
    image_filter_jpeg_quality 75;
    image_filter_buffer 10m;
}
```

### XSLT (ngx_http_xslt_module)

```nginx
location / {
    xslt_stylesheet /data/xslt/transform.xslt;
}
```

### Perl (ngx_http_perl_module)

```nginx
perl_modules perl/lib;
perl_require foo.pm;

location / {
    perl foo::handler;
}
```

### JavaScript (ngx_http_js_module)

```nginx
js_import main.js;
js_set $foo main.foo;

location / {
    js_content main.hello;
}
```

### User ID (ngx_http_userid_module)

```nginx
userid on;
userid_name uid;
userid_domain example.org;
userid_path /;
userid_expires 365d;
```

### HTTP/2 (ngx_http_v2_module)

```nginx
server {
    listen 443 ssl http2;
    http2_push /style.css;
    http2_push_preload on;
}
```

### HTTP/3 (ngx_http_v3_module)

```nginx
server {
    listen 443 quic reuseport;
    http3 on;
    quic_retry on;
    ssl_early_data on;
}
```

### API (ngx_http_api_module) — Commercial

```nginx
location /api/ {
    api write=on;
    allow 127.0.0.1;
    deny all;
}
```

### Keyval (ngx_http_keyval_module) — Commercial

```nginx
keyval_zone zone=one:32k state=/var/lib/nginx/state/one.keyval;
keyval $arg_token $response_size zone=one;
```

### OIDC (ngx_http_oidc_module) — Commercial

OpenID Connect integration for SSO.

### gRPC (ngx_http_grpc_module)

```nginx
location /gRPC/ {
    grpc_pass 127.0.0.1:50051;
}
```

### SCGI (ngx_http_scgi_module)

```nginx
location / {
    scgi_pass 127.0.0.1:4000;
}
```

### uWSGI (ngx_http_uwsgi_module)

```nginx
location / {
    uwsgi_pass 127.0.0.1:8000;
}
```

### Memcached (ngx_http_memcached_module)

```nginx
location / {
    set $memcached_key "$scheme$request_method$host$request_uri";
    memcached_pass 127.0.0.1:11211;
    memcached_gzip_flag 10;
}
```

### Gunzip (ngx_http_gunzip_module)

```nginx
gunzip on;
gunzip_buffers 16 32k;
```

### Gzip Static (ngx_http_gzip_static_module)

```nginx
gzip_static on;
gzip_static always;
```

### Stub Status (ngx_http_stub_status_module)

```nginx
location /nginx_status {
    stub_status;
    allow 127.0.0.1;
    deny all;
}
```

### ACME (ngx_http_acme_module)

Automated certificate management via ACME (Let's Encrypt):

```nginx
acme_client example /var/www/acme/ directory=https://acme-v02.api.letsencrypt.org/directory;
acme_certificate example /etc/nginx/certs/example.crt;
acme_certificate_key example /etc/nginx/certs/example.key;
```

### OpenTelemetry (ngx_otel_module) — Commercial

Distributed tracing via OpenTelemetry.

### Management (ngx_mgmt_module) — Commercial

Centralized management for NGINX instances.

### Google Perftools (ngx_google_perftools_module)

```nginx
google_perftools_profiles /var/log/nginx/gperftools/;
```

### Auth Require (ngx_http_auth_require_module) — Commercial

Requires authentication via an external auth server with additional access control:

```nginx
location /secure/ {
    auth_require "Secure Area";
    auth_require_url http://auth-server/check;
    auth_require_set $authenticated on;
}
```

### Empty GIF (ngx_http_empty_gif_module)

Emits a single-pixel transparent GIF:

```nginx
location = /_.gif {
    empty_gif;
}
```

### F4F (ngx_http_f4f_module) — Commercial

Adobe HTTP Dynamic Streaming (HDS) for Flash:

```nginx
location /video/ {
    f4f;
    f4f_buffer_size 512k;
}
```

### FLV (ngx_http_flv_module)

Pseudo-streaming for FLV files:

```nginx
location ~ \.flv$ {
    flv;
}
```

### GeoIP (ngx_http_geoip_module)

IP-based geolocation using MaxMind GeoIP databases:

```nginx
geoip_country /usr/share/GeoIP/GeoIP.dat;
geoip_city    /usr/share/GeoIP/GeoLiteCity.dat;

# Variables: $geoip_country_code, $geoip_country_name,
# $geoip_city, $geoip_region, $geoip_latitude, $geoip_longitude
```

### HLS (ngx_http_hls_module) — Commercial

HTTP Live Streaming for MP4/M4S fragments:

```nginx
location /hls/ {
    hls;
    hls_fragment 5s;
    hls_buffers 10 10m;
    hls_forward_args on;
}
```

### Internal Redirect (ngx_http_internal_redirect_module) — Commercial

Performs internal redirects based on conditions without client-side round-trip:

```nginx
location / {
    internal_redirect /new_location if=$redirect_needed;
}
```

### MP4 (ngx_http_mp4_module)

Pseudo-streaming for MP4 files:

```nginx
location ~ \.mp4$ {
    mp4;
    mp4_buffer_size 512k;
    mp4_max_buffer_size 10m;
    mp4_limit_rate on;
    mp4_limit_rate_after 5m;
    mp4_start_key_frame on;
}
```

### Num Map (ngx_http_num_map_module) — Commercial

Numeric map module for integer-based variable mappings:

```nginx
num_map $http_x_tier $backend_weight {
    1   10;
    2   20;
    3   30;
    default 1;
}
```

### Proxy Protocol Vendor (ngx_http_proxy_protocol_vendor_module) — Commercial

Vendor-specific PROXY protocol extensions for cloud providers (AWS, Azure, GCP, Cloudflare):

```nginx
proxy_protocol_vendor cloudflare;
# Exposes $proxy_protocol_vendor_<field> variables
```

### Random Index (ngx_http_random_index_module)

Serves a random file from a directory as the index:

```nginx
location / {
    random_index on;
}
```

### Session Log (ngx_http_session_log_module) — Commercial

Logs sessions (grouped requests) to a shared memory zone:

```nginx
session_log_zone /var/log/nginx/session.log zone=one:1m;
session_log one format=main;
```

### Status (ngx_http_status_module) — Commercial (legacy)

Basic status information (superseded by API module in newer versions):

```nginx
location /status {
    status;
    status_format json;
}
```

### Tunnel (ngx_http_tunnel_module)

Protocol upgrade tunneling for HTTP CONNECT method:

```nginx
location / {
    tunnel_connect_timeout 60s;
    tunnel_read_timeout 60s;
    tunnel_send_timeout 60s;
}
```

### Upstream Conf (ngx_http_upstream_conf_module) — Commercial (legacy)

Dynamic upstream configuration via HTTP (superseded by API module):

```nginx
location /upstream_conf {
    upstream_conf;
    allow 127.0.0.1;
    deny all;
}
```

### Proxy Protocol Vendor (HTTP) — Commercial

Cloud provider-specific PROXY protocol TLV parsing:

```nginx
proxy_protocol_vendor aws;
# Exposes $proxy_protocol_vendor_aws_vpc_id, etc.
```

**Source**: [HTTP Core Module](https://nginx.org/en/docs/http/ngx_http_core_module.html) | [Proxy Module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) | [Upstream Module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html) | [Rewrite Module](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html) | [FastCGI Module](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html) | [SSL Module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html) | [Access Module](https://nginx.org/en/docs/http/ngx_http_access_module.html) | [Auth Basic Module](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html) | [Auth Request Module](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html) | [Auth JWT Module](https://nginx.org/en/docs/http/ngx_http_auth_jwt_module.html) | [Auth Require Module](https://nginx.org/en/docs/http/ngx_http_auth_require_module.html) | [Gzip Module](https://nginx.org/en/docs/http/ngx_http_gzip_module.html) | [Headers Module](https://nginx.org/en/docs/http/ngx_http_headers_module.html) | [Log Module](https://nginx.org/en/docs/http/ngx_http_log_module.html) | [Map Module](https://nginx.org/en/docs/http/ngx_http_map_module.html) | [Real IP Module](https://nginx.org/en/docs/http/ngx_http_realip_module.html) | [Limit Req Module](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) | [Limit Conn Module](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html) | [HTTP/2 Module](https://nginx.org/en/docs/http/ngx_http_v2_module.html) | [HTTP/3 Module](https://nginx.org/en/docs/http/ngx_http_v3_module.html) | [Empty GIF Module](https://nginx.org/en/docs/http/ngx_http_empty_gif_module.html) | [F4F Module](https://nginx.org/en/docs/http/ngx_http_f4f_module.html) | [FLV Module](https://nginx.org/en/docs/http/ngx_http_flv_module.html) | [Geo Module](https://nginx.org/en/docs/http/ngx_http_geo_module.html) | [GeoIP Module](https://nginx.org/en/docs/http/ngx_http_geoip_module.html) | [gRPC Module](https://nginx.org/en/docs/http/ngx_http_grpc_module.html) | [Gunzip Module](https://nginx.org/en/docs/http/ngx_http_gunzip_module.html) | [Gzip Static Module](https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html) | [HLS Module](https://nginx.org/en/docs/http/ngx_http_hls_module.html) | [Image Filter Module](https://nginx.org/en/docs/http/ngx_http_image_filter_module.html) | [Index Module](https://nginx.org/en/docs/http/ngx_http_index_module.html) | [Internal Redirect Module](https://nginx.org/en/docs/http/ngx_http_internal_redirect_module.html) | [JS Module](https://nginx.org/en/docs/http/ngx_http_js_module.html) | [Keyval Module](https://nginx.org/en/docs/http/ngx_http_keyval_module.html) | [Memcached Module](https://nginx.org/en/docs/http/ngx_http_memcached_module.html) | [Mirror Module](https://nginx.org/en/docs/http/ngx_http_mirror_module.html) | [MP4 Module](https://nginx.org/en/docs/http/ngx_http_mp4_module.html) | [Num Map Module](https://nginx.org/en/docs/http/ngx_http_num_map_module.html) | [OIDC Module](https://nginx.org/en/docs/http/ngx_http_oidc_module.html) | [Perl Module](https://nginx.org/en/docs/http/ngx_http_perl_module.html) | [Proxy Protocol Vendor Module](https://nginx.org/en/docs/http/ngx_http_proxy_protocol_vendor_module.html) | [Random Index Module](https://nginx.org/en/docs/http/ngx_http_random_index_module.html) | [Referer Module](https://nginx.org/en/docs/http/ngx_http_referer_module.html) | [SCGI Module](https://nginx.org/en/docs/http/ngx_http_scgi_module.html) | [Secure Link Module](https://nginx.org/en/docs/http/ngx_http_secure_link_module.html) | [Session Log Module](https://nginx.org/en/docs/http/ngx_http_session_log_module.html) | [Slice Module](https://nginx.org/en/docs/http/ngx_http_slice_module.html) | [Split Clients Module](https://nginx.org/en/docs/http/ngx_http_split_clients_module.html) | [SSI Module](https://nginx.org/en/docs/http/ngx_http_ssi_module.html) | [Status Module](https://nginx.org/en/docs/http/ngx_http_status_module.html) | [Stub Status Module](https://nginx.org/en/docs/http/ngx_http_stub_status_module.html) | [Sub Module](https://nginx.org/en/docs/http/ngx_http_sub_module.html) | [Tunnel Module](https://nginx.org/en/docs/http/ngx_http_tunnel_module.html) | [Upstream Conf Module](https://nginx.org/en/docs/http/ngx_http_upstream_conf_module.html) | [Upstream HC Module](https://nginx.org/en/docs/http/ngx_http_upstream_hc_module.html) | [User ID Module](https://nginx.org/en/docs/http/ngx_http_userid_module.html) | [uWSGI Module](https://nginx.org/en/docs/http/ngx_http_uwsgi_module.html) | [XSLT Module](https://nginx.org/en/docs/http/ngx_http_xslt_module.html) | [ACME Module](https://nginx.org/en/docs/http/ngx_http_acme_module.html) | [API Module](https://nginx.org/en/docs/http/ngx_http_api_module.html) | [Addition Module](https://nginx.org/en/docs/http/ngx_http_addition_module.html) | [Autoindex Module](https://nginx.org/en/docs/http/ngx_http_autoindex_module.html) | [Browser Module](https://nginx.org/en/docs/http/ngx_http_browser_module.html) | [Charset Module](https://nginx.org/en/docs/http/ngx_http_charset_module.html) | [DAV Module](https://nginx.org/en/docs/http/ngx_http_dav_module.html) | [WebSocket Proxying](https://nginx.org/en/docs/http/websocket.html) | [Load Balancing](https://nginx.org/en/docs/http/load_balancing.html) | [Server Names](https://nginx.org/en/docs/http/server_names.html) | [Request Processing](https://nginx.org/en/docs/http/request_processing.html) | [Configuring HTTPS](https://nginx.org/en/docs/http/configuring_https_servers.html) | [Converting Rewrite Rules](https://nginx.org/en/docs/http/converting_rewrite_rules.html) | [Directives Index](https://nginx.org/en/docs/dirindex.html) | [Variables Index](https://nginx.org/en/docs/varindex.html)
