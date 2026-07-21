# NGINX Stream & Mail Modules Reference

> **Source**: [nginx.org/en/docs/stream](https://nginx.org/en/docs/stream/ngx_stream_core_module.html) | [nginx.org/en/docs/mail](https://nginx.org/en/docs/mail/ngx_mail_core_module.html)

## Stream Module (TCP/UDP Proxy)

The `stream` context provides TCP/UDP load balancing and proxying, separate from HTTP.

### Core Module (ngx_stream_core_module)

#### Configuration Context

```nginx
stream {
    upstream backend {
        server 127.0.0.1:3306;
        server 127.0.0.1:3307;
    }

    server {
        listen 3306;
        proxy_pass backend;
    }
}
```

#### `listen address:port [parameters]`

| Parameter | Description |
|-----------|-------------|
| `ssl` | Enable SSL/TLS |
| `udp` | Listen on UDP |
| `bind` | Force bind to address:port |
| `ipv6only=on\|off` | IPv6-only socket |
| `reuseport` | Enable SO_REUSEPORT |
| `backlog=number` | Listen backlog |
| `rcvbuf=size`, `sndbuf=size` | Socket buffer sizes |
| `accept_filter=filter` | FreeBSD accept filter |
| `deferred` | TCP_DEFER_ACCEPT (Linux) |
| `setfib=number` | Set FIB (FreeBSD) |
| `fastopen=number` | TCP_FASTOPEN (Linux) |
| `so_keepalive` | TCP keepalive |
| `multipath` | Multipath TCP (RFC 8684) |

```nginx
server {
    listen 53 udp reuseport;
    listen 12345;
    listen [::1]:54321;
}
```

#### `proxy_pass address`

Passes connection to upstream server.

```nginx
server {
    listen 3306;
    proxy_pass 127.0.0.1:33060;
}
```

#### Key Directives

| Directive | Default | Context | Description |
|-----------|---------|---------|-------------|
| `preread_buffer_size` | 16k | stream, server | Preread buffer size |
| `preread_timeout` | 30s | stream, server | Preread phase timeout |
| `proxy_protocol_timeout` | 30s | stream, server | PROXY protocol read timeout |
| `resolver address ...` | — | stream, server | Name servers for upstream resolution |
| `resolver_timeout` | 30s | stream, server | DNS resolution timeout |
| `tcp_nodelay on\|off` | on | stream, server | Enable TCP_NODELAY |
| `proxy_buffer_size` | 16k | stream, server | Buffer for proxied data |
| `proxy_timeout` | 10m | stream, server | Timeout between two reads/writes |
| `proxy_connect_timeout` | 60s | stream, server | Connection timeout to upstream |
| `proxy_upload_rate` | 0 | stream, server | Rate limit for client→upstream |
| `proxy_download_rate` | 0 | stream, server | Rate limit for upstream→client |
| `proxy_requests` | 0 | stream, server | Max requests per UDP connection |
| `proxy_responses` | 0 | stream, server | Expected responses per UDP datagram |
| `proxy_next_upstream` | error timeout | stream, server | Conditions for next upstream |
| `proxy_next_upstream_tries` | 0 | stream, server | Max tries for next upstream |
| `proxy_next_upstream_timeout` | 0 | stream, server | Timeout for next upstream |
| `proxy_socket_keepalive` | off | stream, server | TCP keepalive on upstream connections |
| `proxy_protocol on\|off` | off | stream, server | Enable PROXY protocol |

### How NGINX Processes a TCP/UDP Session

1. **Pre-access phase** — Access control checks
2. **Preread phase** — Read initial bytes (e.g., for SNI or protocol detection)
3. **SSL phase** — SSL/TLS handshake (if enabled)
4. **Content phase** — Proxy the connection (or return a value)
5. **Log phase** — Session logging

### Stream Upstream Module (ngx_stream_upstream_module)

Same load balancing methods as HTTP upstream:

```nginx
stream {
    upstream dns_servers {
        least_conn;
        server 192.168.1.1:53;
        server 192.168.1.2:53;
    }

    upstream mysql_servers {
        hash $remote_addr consistent;
        server 192.168.1.10:3306 weight=2;
        server 192.168.1.11:3306;
    }

    upstream redis_servers {
        random two least_conn;
        server 192.168.1.20:6379;
        server 192.168.1.21:6379;
    }
}
```

### Stream SSL Module (ngx_stream_ssl_module)

```nginx
server {
    listen 993 ssl;
    ssl_certificate     /etc/nginx/certs/mail.crt;
    ssl_certificate_key /etc/nginx/certs/mail.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    proxy_pass 127.0.0.1:8993;
}
```

### Stream SSL Preread Module (ngx_stream_ssl_preread_module)

Inspect SNI without terminating SSL:

```nginx
stream {
    map $ssl_preread_server_name $backend {
        example.com backend1;
        default     backend2;
    }

    server {
        listen 443;
        ssl_preread on;
        proxy_pass $backend;
    }
}
```

### Stream Access Module (ngx_stream_access_module)

```nginx
server {
    listen 3306;
    allow 192.168.1.0/24;
    deny all;
    proxy_pass 127.0.0.1:33060;
}
```

### Stream Geo Module (ngx_stream_geo_module)

```nginx
stream {
    geo $country {
        default    ZZ;
        10.0.0.0/8 US;
        EU         192.168.0.0/16;
    }
}
```

### Stream GeoIP Module (ngx_stream_geoip_module)

```nginx
stream {
    geoip_country /usr/share/GeoIP/GeoIP.dat;
    geoip_city    /usr/share/GeoIP/GeoLiteCity.dat;
}
```

### Stream Map Module (ngx_stream_map_module)

```nginx
stream {
    map $remote_addr $backend {
        127.0.0.1 backend1;
        default   backend2;
    }
}
```

### Stream Limit Conn Module (ngx_stream_limit_conn_module)

```nginx
stream {
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    server {
        listen 3306;
        limit_conn addr 10;
        proxy_pass backend;
    }
}
```

### Stream Log Module (ngx_stream_log_module)

```nginx
stream {
    log_format main '$remote_addr [$time_local] $protocol '
                    '$status $bytes_sent $bytes_received '
                    '$session_time';

    access_log /var/log/nginx/stream.log main;
}
```

### Stream Return Module (ngx_stream_return_module)

```nginx
server {
    listen 12345;
    return "Hello from NGINX!\n";
}
```

### Stream Set Module (ngx_stream_set_module)

```nginx
server {
    listen 12345;
    set $service "backend1";
    proxy_pass $service;
}
```

### Stream Pass Module (ngx_stream_pass_module) — Commercial

Pass connection to another listening socket:

```nginx
server {
    listen 12345;
    pass 127.0.0.1:12346;
}
```

### Stream Split Clients Module (ngx_stream_split_clients_module)

```nginx
stream {
    split_clients "${remote_addr}AAA" $variant {
        0.5%   backend1;
        2.0%   backend2;
        *      backend3;
    }
}
```

### Stream Proxy Protocol Vendor Module

Vendor-specific PROXY protocol extensions (commercial).

### Stream JS Module (ngx_stream_js_module)

```nginx
stream {
    js_import main.js;

    server {
        listen 12345;
        js_filter main.filter;
        proxy_pass 127.0.0.1:8080;
    }
}
```

### Stream Keyval Module (ngx_stream_keyval_module) — Commercial

```nginx
stream {
    keyval_zone zone=one:32k;
    keyval $remote_addr $rate zone=one;
}
```

### Stream Upstream HC Module (ngx_stream_upstream_hc_module) — Commercial

Active health checks for TCP/UDP:

```nginx
server {
    listen 3306;
    proxy_pass mysql_servers;
    health_check interval=10s fails=3 passes=2;
}
```

### Stream Zone Sync Module (ngx_stream_zone_sync_module) — Commercial

Synchronize shared memory zones across NGINX instances in a cluster.

### Stream MQTT Preread Module (ngx_stream_mqtt_preread_module) — Commercial

Extracts MQTT client ID and username from CONNECT messages for routing:

```nginx
server {
    listen 1883;
    mqtt_preread on;
    proxy_pass backend;
}

# Route by client ID
upstream mqtt_backend {
    hash $mqtt_preread_client_id;
    server mqtt1:1883;
    server mqtt2:1883;
}
```

| Directive | Default | Context | Description |
|-----------|---------|---------|-------------|
| `mqtt_preread on\|off` | off | stream, server | Enable MQTT CONNECT parsing |

**Variables**: `$mqtt_preread_client_id`, `$mqtt_preread_username`

### Stream MQTT Filter Module (ngx_stream_mqtt_filter_module) — Commercial

MQTT protocol-aware filtering and message inspection:

```nginx
server {
    listen 1883;
    mqtt_filter on;
    mqtt_filter_publish_allow false;
    mqtt_filter_subscribe_allow false;
    proxy_pass backend;
}
```

| Directive | Default | Context | Description |
|-----------|---------|---------|-------------|
| `mqtt_filter on\|off` | off | stream, server | Enable MQTT message filtering |
| `mqtt_filter_publish_allow` | true | stream, server | Allow PUBLISH messages |
| `mqtt_filter_subscribe_allow` | true | stream, server | Allow SUBSCRIBE messages |
| `mqtt_filter_unsubscribe_allow` | true | stream, server | Allow UNSUBSCRIBE messages |
| `mqtt_filter_disconnect_allow` | true | stream, server | Allow DISCONNECT messages |

### Stream Num Map Module (ngx_stream_num_map_module) — Commercial

Numeric map module for integer-based variable mappings:

```nginx
stream {
    num_map $protocol $backend_port {
        1   3306;
        2   5432;
        default 3306;
    }
}
```

### Stream Proxy Module (ngx_stream_proxy_module)

Core proxying functionality for TCP/UDP. Key directives:

| Directive | Default | Description |
|-----------|---------|-------------|
| `proxy_pass address` | — | Upstream server address |
| `proxy_buffer_size` | 16k | Buffer for proxied data |
| `proxy_timeout` | 10m | Timeout between two read/write operations |
| `proxy_connect_timeout` | 60s | Connection timeout to upstream |
| `proxy_upload_rate` | 0 | Rate limit client→upstream (bytes/s) |
| `proxy_download_rate` | 0 | Rate limit upstream→client (bytes/s) |
| `proxy_requests` | 0 | Max requests per UDP connection (0=unlimited) |
| `proxy_responses` | 0 | Expected responses per UDP datagram |
| `proxy_next_upstream` | error timeout | Conditions for trying next upstream |
| `proxy_next_upstream_tries` | 0 | Max tries for next upstream |
| `proxy_next_upstream_timeout` | 0 | Timeout for next upstream attempts |
| `proxy_socket_keepalive` | off | TCP keepalive on upstream connections |
| `proxy_protocol on\|off` | off | Enable PROXY protocol |

```nginx
server {
    listen 53 udp;
    proxy_pass 8.8.8.8:53;
    proxy_responses 1;
    proxy_timeout 3s;
}

server {
    listen 3306;
    proxy_pass mysql_backend;
    proxy_connect_timeout 5s;
    proxy_timeout 30s;
    proxy_upload_rate 100k;
    proxy_download_rate 100k;
}
```

### Stream Proxy Protocol Vendor Module (ngx_stream_proxy_protocol_vendor_module) — Commercial

Vendor-specific PROXY protocol TLV parsing for cloud providers:

```nginx
stream {
    proxy_protocol_vendor aws;
    # Exposes $proxy_protocol_vendor_aws_vpc_id, etc.
}
```

### Stream Real IP Module (ngx_stream_realip_module)

Restores client IP from PROXY protocol header:

```nginx
server {
    listen 12345;
    set_real_ip_from 192.168.1.0/24;
    proxy_protocol on;
    proxy_pass backend;
}
```

---

## Mail Module (IMAP/POP3/SMTP Proxy)

### Core Module (ngx_mail_core_module)

```nginx
mail {
    server {
        listen 25;
        protocol smtp;
        proxy_pass 127.0.0.1:10025;
    }

    server {
        listen 143;
        protocol imap;
        proxy_pass 127.0.0.1:10143;
    }

    server {
        listen 110;
        protocol pop3;
        proxy_pass 127.0.0.1:10110;
    }
}
```

#### `listen address:port [parameters]`

Same parameters as stream, plus SSL support.

#### `protocol smtp|imap|pop3`

If not set, protocol is auto-detected from well-known ports:
- IMAP: 143, 993
- POP3: 110, 995
- SMTP: 25, 587, 465

#### Key Directives

| Directive | Default | Context | Description |
|-----------|---------|---------|-------------|
| `server_name name` | hostname | mail, server | Server name for greeting/SASL/EHLO |
| `timeout` | 60s | mail, server | Timeout before proxying starts |
| `resolver address ...` | — | mail, server | DNS servers for client hostname lookup |
| `resolver_timeout` | 30s | mail, server | DNS resolution timeout |
| `auth_http URL` | — | mail, server | Auth server URL |
| `auth_http_timeout` | 60s | mail, server | Auth HTTP timeout |
| `auth_http_header` | — | mail, server | Custom header for auth request |
| `auth_http_pass_client_cert` | off | mail, server | Pass client cert to auth server |
| `imap_capabilities` | — | mail, server | IMAP capabilities to advertise |
| `imap_client_buffer` | 4k/8k | mail, server | IMAP read buffer |
| `pop3_capabilities` | — | mail, server | POP3 capabilities to advertise |
| `smtp_capabilities` | — | mail, server | SMTP capabilities to advertise |
| `smtp_greeting_delay` | 0 | mail, server | Delay before SMTP greeting |
| `starttls on\|off\|only` | off | mail, server | STARTTLS configuration |
| `ssl_certificate` | — | mail, server | SSL certificate |
| `ssl_certificate_key` | — | mail, server | SSL key |
| `ssl_protocols` | TLSv1 TLSv1.1 TLSv1.2 TLSv1.3 | mail, server | SSL protocols |
| `ssl_ciphers` | HIGH:!aNULL:!MD5 | mail, server | SSL ciphers |
| `ssl_session_cache` | none | mail, server | SSL session cache |
| `ssl_session_timeout` | 10m | mail, server | SSL session timeout |

### Mail Auth HTTP Module (ngx_mail_auth_http_module)

NGINX delegates authentication to an external HTTP server:

```nginx
server {
    listen 143;
    protocol imap;
    auth_http http://auth-server/imap-auth;
    auth_http_header X-Auth-Protocol imap;
}
```

The auth server receives headers like:
- `Auth-Method` — plain, apop, cram-md5, external, none
- `Auth-User` — username
- `Auth-Pass` — password
- `Auth-Protocol` — imap, pop3, smtp
- `Auth-Salt` — salt for CRAM-MD5
- `Client-IP` — client IP
- `Client-HOST` — client hostname
- `Auth-SSL` — whether SSL was used
- `Auth-SSL-Verify` — client cert verification result

The auth server responds with:
- `Auth-Server: 127.0.0.1` — backend server address
- `Auth-Port: 8143` — backend server port
- `Auth-Status: OK` — authentication result
- `Auth-Pass: password` — password for proxying (if needed)
- `Auth-Wait: 2` — wait before returning error to client

### Mail Proxy Module (ngx_mail_proxy_module)

| Directive | Default | Description |
|-----------|---------|-------------|
| `proxy_pass` | — | Backend server address |
| `proxy_buffer` | 4k | Buffer for proxying |
| `proxy_timeout` | 24h | Timeout between I/O operations |
| `proxy_xclient on\|off` | off | Send XCLIENT command (SMTP) |
| `proxy_smtp_auth on\|off` | off | Authenticate on SMTP backend |

### Mail SSL Module (ngx_mail_ssl_module)

```nginx
server {
    listen 993 ssl;
    protocol imap;
    ssl_certificate     /etc/nginx/certs/mail.crt;
    ssl_certificate_key /etc/nginx/certs/mail.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    starttls            only;
    proxy_pass 127.0.0.1:8993;
}
```

### Mail Real IP Module (ngx_mail_realip_module)

```nginx
server {
    listen 25;
    protocol smtp;
    set_real_ip_from 192.168.1.0/24;
    real_ip_header X-Real-IP;
}
```

### Mail IMAP Module (ngx_mail_imap_module)

Configures IMAP-specific behavior:

```nginx
imap_capabilities IMAP4rev1 UIDPLUS IDLE LITERAL+ QUOTA;
imap_client_buffer 8k;
```

### Mail POP3 Module (ngx_mail_pop3_module)

```nginx
pop3_capabilities USER TOP UIDL;
```

### Mail SMTP Module (ngx_mail_smtp_module)

```nginx
smtp_capabilities PIPELINING 8BITMIME DSN;
smtp_greeting_delay 1s;
```

**Source**: [Stream Core Module](https://nginx.org/en/docs/stream/ngx_stream_core_module.html) | [Stream Processing](https://nginx.org/en/docs/stream/stream_processing.html) | [Stream Upstream Module](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html) | [Stream SSL Module](https://nginx.org/en/docs/stream/ngx_stream_ssl_module.html) | [Stream SSL Preread Module](https://nginx.org/en/docs/stream/ngx_stream_ssl_preread_module.html) | [Stream Access Module](https://nginx.org/en/docs/stream/ngx_stream_access_module.html) | [Stream Geo Module](https://nginx.org/en/docs/stream/ngx_stream_geo_module.html) | [Stream GeoIP Module](https://nginx.org/en/docs/stream/ngx_stream_geoip_module.html) | [Stream JS Module](https://nginx.org/en/docs/stream/ngx_stream_js_module.html) | [Stream Keyval Module](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html) | [Stream Limit Conn Module](https://nginx.org/en/docs/stream/ngx_stream_limit_conn_module.html) | [Stream Log Module](https://nginx.org/en/docs/stream/ngx_stream_log_module.html) | [Stream Map Module](https://nginx.org/en/docs/stream/ngx_stream_map_module.html) | [Stream MQTT Preread Module](https://nginx.org/en/docs/stream/ngx_stream_mqtt_preread_module.html) | [Stream MQTT Filter Module](https://nginx.org/en/docs/stream/ngx_stream_mqtt_filter_module.html) | [Stream Num Map Module](https://nginx.org/en/docs/stream/ngx_stream_num_map_module.html) | [Stream Pass Module](https://nginx.org/en/docs/stream/ngx_stream_pass_module.html) | [Stream Proxy Module](https://nginx.org/en/docs/stream/ngx_stream_proxy_module.html) | [Stream Proxy Protocol Vendor Module](https://nginx.org/en/docs/stream/ngx_stream_proxy_protocol_vendor_module.html) | [Stream Real IP Module](https://nginx.org/en/docs/stream/ngx_stream_realip_module.html) | [Stream Return Module](https://nginx.org/en/docs/stream/ngx_stream_return_module.html) | [Stream Set Module](https://nginx.org/en/docs/stream/ngx_stream_set_module.html) | [Stream Split Clients Module](https://nginx.org/en/docs/stream/ngx_stream_split_clients_module.html) | [Stream Upstream HC Module](https://nginx.org/en/docs/stream/ngx_stream_upstream_hc_module.html) | [Stream Zone Sync Module](https://nginx.org/en/docs/stream/ngx_stream_zone_sync_module.html) | [Mail Core Module](https://nginx.org/en/docs/mail/ngx_mail_core_module.html) | [Mail Auth HTTP Module](https://nginx.org/en/docs/mail/ngx_mail_auth_http_module.html) | [Mail Proxy Module](https://nginx.org/en/docs/mail/ngx_mail_proxy_module.html) | [Mail Real IP Module](https://nginx.org/en/docs/mail/ngx_mail_realip_module.html) | [Mail SSL Module](https://nginx.org/en/docs/mail/ngx_mail_ssl_module.html) | [Mail IMAP Module](https://nginx.org/en/docs/mail/ngx_mail_imap_module.html) | [Mail POP3 Module](https://nginx.org/en/docs/mail/ngx_mail_pop3_module.html) | [Mail SMTP Module](https://nginx.org/en/docs/mail/ngx_mail_smtp_module.html)
