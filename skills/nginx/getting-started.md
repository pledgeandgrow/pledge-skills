# NGINX Getting Started

> **Version**: Latest (1.29.x) | **Source**: [nginx.org/en/docs](https://nginx.org/en/docs/index.html)

## What is NGINX?

NGINX is a high-performance HTTP web server, reverse proxy, IMAP/POP3 mail proxy, and L7/TCP/UDP load balancer. It is known for its event-driven, asynchronous architecture that delivers high concurrency with low memory footprint.

## Architecture

NGINX uses a master-worker process model:

- **Master process** — Reads and validates configuration, manages worker processes
- **Worker processes** — Handle actual network connections and requests; each worker handles many connections simultaneously using an event loop
- **Cache loader** — Loads disk cache into memory (runs at startup, then exits)
- **Cache manager** — Periodically checks and removes expired cache items

The event-driven architecture means each worker process can handle thousands of connections in a single thread, using non-blocking I/O and an event notification mechanism (epoll on Linux, kqueue on FreeBSD/macOS).

## Installation

### Linux

Install from official nginx.org packages:

```bash
# Debian/Ubuntu
sudo apt update
sudo apt install nginx

# RHEL/CentOS/Rocky
sudo yum install nginx
```

For the latest mainline from nginx.org, add the official repository:

```bash
# Debian/Ubuntu
echo "deb http://nginx.org/packages/mainline/debian $(lsb_release -cs) nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/nginx_signing.gpg
sudo apt update
sudo apt install nginx
```

### FreeBSD

```bash
# Using packages
pkg install nginx

# Using ports (greater flexibility)
cd /usr/ports/www/nginx && make install clean
```

### Building from Sources

```bash
./configure
make
sudo make install
```

Key configure options:

| Option | Description |
|--------|-------------|
| `--prefix=path` | Set installation prefix (default: `/usr/local/nginx`) |
| `--sbin-path=path` | Set nginx binary path |
| `--conf-path=path` | Set config file path |
| `--error-log-path=path` | Set error log path |
| `--pid-path=path` | Set pid file path |
| `--with-http_ssl_module` | Enable SSL/TLS module |
| `--with-http_v2_module` | Enable HTTP/2 module |
| `--with-http_v3_module` | Enable HTTP/3 (QUIC) module |
| `--with-http_realip_module` | Enable real IP module |
| `--with-http_gzip_static_module` | Enable static gzip module |
| `--with-http_stub_status_module` | Enable status module |
| `--with-stream` | Enable TCP/UDP proxy module |
| `--with-mail` | Enable mail proxy module |
| `--with-threads` | Enable thread pool support |
| `--with-file-aio` | Enable asynchronous file I/O |
| `--with-debug` | Enable debug logging |
| `--without-http_rewrite_module` | Disable rewrite module |
| `--without-http_proxy_module` | Disable proxy module |
| `--without-http_gzip_module` | Disable gzip module |
| `--with-pcre-jit` | Enable PCRE JIT compilation |

### Windows

Download the official Windows binary from [nginx.org/en/download.html](https://nginx.org/en/download.html). Extract and run:

```cmd
cd nginx
start nginx
```

Note: NGINX on Windows has lower performance and fewer features than on Unix. It is recommended for development and testing only.

## Beginner's Guide

### Configuration Structure

NGINX configuration consists of modules controlled by **directives**:

- **Simple directive** — Name and parameters separated by spaces, ends with semicolon (`;`)
- **Block directive** — Same structure but ends with braces (`{ }`) containing additional directives
- **Context** — A block directive that can contain other directives (e.g., `events`, `http`, `server`, `location`)

Directives outside any context are in the **main** context. The hierarchy is:

```
main
├── events
├── http
│   ├── server
│   │   └── location
│   └── upstream
├── mail
└── stream
    └── server
        └── ...
```

Lines starting with `#` are comments.

### Serving Static Content

```nginx
http {
    server {
        location / {
            root /data/www;
        }

        location /images/ {
            root /data;
        }
    }
}
```

- `location /` matches all requests (shortest prefix)
- `location /images/` matches requests starting with `/images/`
- `root` directive appends the URI to the specified path

### Setting Up a Simple Proxy

```nginx
server {
    listen 80;
    server_name example.org;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

### Setting Up FastCGI Proxy

```nginx
server {
    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME /data/www$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## How NGINX Processes a Request

1. **Listen port selection** — NGINX selects a server based on the listen port and IP address
2. **Server name selection** — NGINX matches the `Host` header against `server_name` directives
3. **Location matching** — NGINX tests the request URI against `location` blocks:
   - Exact match (`location = /path`)
   - Prefix match with `^~` (stops regex search if matched)
   - Regex match (`location ~ pattern` or `location ~* pattern` for case-insensitive)
   - Longest prefix match (fallback)

Location matching only tests the URI path, not query arguments.

## Server Names

Server names are matched in this order:

1. **Exact name** — `server_name example.org`
2. **Longest wildcard starting with asterisk** — `server_name *.example.org`
3. **Longest wildcard ending with asterisk** — `server_name www.example.*`
4. **First matching regular expression** — `server_name ~^www\d+\.example\.org$`

Special names:
- `""` (empty string) — Matches requests without a `Host` header
- `"_"` — Invalid name used as a catch-all (no special meaning, just never matches a real name)
- `*` — Deprecated; use `default_server` on `listen` directive instead

### Default Server

The first `server` block for a given `listen` port is the default server. Use `default_server` to explicitly set it:

```nginx
server {
    listen 80 default_server;
    server_name _;
    return 444;
}
```

### Internationalized Names (IDN)

Use Punycode (ASCII) representation:

```nginx
server_name xn--e1afmkfd.xn--80akhbyknj4f;
```

## Controlling NGINX

### Signals

NGINX can be controlled by sending signals to the master process:

| Signal | Action |
|--------|--------|
| `TERM`, `INT` | Quick shutdown |
| `QUIT` | Graceful shutdown (waits for worker processes to finish serving requests) |
| `HUP` | Reload configuration (start new workers, gracefully shut down old) |
| `USR1` | Reopen log files |
| `USR2` | Upgrade executable on the fly |
| `WINCH` | Gracefully shut down worker processes (used during binary upgrade) |

### Binary Upgrade On-the-Fly

```bash
# 1. Send USR2 to old master
kill -USR2 <old_master_pid>

# 2. Send WINCH to old master (gracefully shut down old workers)
kill -WINCH <old_master_pid>

# 3. If upgrade is successful, send QUIT to old master
kill -QUIT <old_master_pid>

# If upgrade fails, send HUP to old master to restart old workers
kill -HUP <old_master_pid>
```

## Command-Line Parameters

```bash
nginx [options]
```

| Parameter | Description |
|-----------|-------------|
| `-?`, `-h` | Print help |
| `-c file` | Use alternative configuration file |
| `-e file` | Use alternative error log file (1.19.5) |
| `-g directives` | Set global configuration directives |
| `-p prefix` | Set nginx path prefix (default: `/usr/local/nginx`) |
| `-q` | Suppress non-error messages during config testing |
| `-s signal` | Send signal to master process (`stop`, `quit`, `reload`, `reopen`) |
| `-t` | Test configuration for correct syntax |
| `-T` | Test configuration and dump to stdout |
| `-v` | Print nginx version |
| `-V` | Print nginx version, compiler version, and configure parameters |

### Common Commands

```bash
# Test configuration
nginx -t

# Reload configuration
nginx -s reload

# Graceful shutdown
nginx -s quit

# Reopen log files (useful for log rotation)
nginx -s reopen

# Start with custom config
nginx -c /path/to/nginx.conf
```

## Connection Processing Methods

NGINX supports several connection processing methods, selected automatically based on platform:

| Method | Platform | Notes |
|--------|----------|-------|
| `select` | All platforms | Standard, used when no better option |
| `poll` | All platforms | Standard, used when no better option |
| `kqueue` | FreeBSD 4.1+, macOS | Efficient event notification |
| `epoll` | Linux 2.6+ | Most efficient on Linux |
| `/dev/poll` | Solaris, HP/UX, IRIX, Tru64 | Efficient on Solaris |
| `eventport` | Solaris 10+ | Use `/dev/poll` instead due to known issues |

Override with the `use` directive in the `events` block:

```nginx
events {
    use epoll;
    worker_connections 1024;
}
```

## Configuration File Measurement Units

- Sizes: `k`/`K` (kilobytes), `m`/`M` (megabytes), `g`/`G` (gigabytes)
- Time: `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours), `d` (days), `w` (weeks), `M` (30 days), `y` (365 days)
- Off: `off` or `none` for disabling a feature

## Debugging

### Debug Log

Build with `--with-debug` to enable debug logging:

```nginx
error_log /var/log/nginx/debug.log debug;
```

### Logging to Syslog

```nginx
error_log syslog:server=192.168.1.1 debug;
access_log syslog:server=unix:/var/log/nginx.sock,facility=local7,tag=nginx,severity=info combined;
```

### Memory Buffer Logging

For debugging without disk I/O:

```nginx
error_log memory:32m debug;
```

## NGINX for Windows

Limitations on Windows:
- Single worker process
- No `--with-select_module` needed (uses select by default)
- Lower performance than Unix versions
- Limited number of connections (~1024)

## njs Scripting

njs is a subset of the JavaScript language that can be used in NGINX configuration:

```nginx
load_module modules/ngx_http_js_module.so;

http {
    js_import main.js;

    server {
        location / {
            js_content main.hello;
        }
    }
}
```

```javascript
// main.js
function hello(r) {
    r.return(200, "Hello from njs!");
}
export default { hello };
```

njs supports:
- ES5.1 strict mode plus some ES6 features
- Regular expressions
- JSON parsing
- Crypto operations
- File system access (limited)

## Setting Up Hashes

NGINX uses hash tables for server names, MIME types, and other data. Hash table size parameters can be tuned:

- `server_names_hash_max_size` — Max size of server names hash
- `server_names_hash_bucket_size` — Bucket size (default depends on processor cache line)
- `types_hash_max_size` — Max size of types hash
- `types_hash_bucket_size` — Bucket size for types hash
- `variables_hash_max_size` — Max size of variables hash
- `variables_hash_bucket_size` — Bucket size for variables hash

If a hash table size exceeds the specified max, NGINX increases it to the next power of two. If bucket size is too small, NGINX prints a warning and suggests increasing the bucket size.

## Building on Win32 with Visual C

```cmd
# Ensure Visual C compiler and MSYS environment are available
# From MSYS bash:
auto/configure --with-cc=cl --builddir=objs --prefix= \
    --conf-path=conf/nginx.conf --pid-path=logs/nginx.pid \
    --http-log-path=logs/access.log --error-log-path=logs/error.log \
    --sbin-path=nginx.exe --http-client-body-temp-path=temp/client_body_temp \
    --http-proxy-temp-path=temp/proxy_temp \
    --http-fastcgi-temp-path=temp/fastcgi_temp \
    --with-openssl=../openssl-3.x --with-zlib=../zlib-1.x \
    --with-http_ssl_module --with-http_v2_module --with-http_v3_module

nmake -f objs/Makefile
```

## Debugging with DTrace

On Solaris/macOS, use DTrace pid provider to inspect nginx without rebuilding:

```bash
# List probe functions
dtrace -l -P nginx

# Trace request processing
dtrace -n 'nginx$http_*:entry { trace(copyinstr(arg0)); }'
```

See [Debugging nginx with DTrace pid provider](https://nginx.org/en/docs/nginx_dtrace_pid_provider.html) for platform-specific scripts.

## Contributing and Development

- **Contributing Changes** — See [Contributing Changes](https://nginx.org/en/docs/contributing_changes.html)
- **Development Guide** — See [Development Guide](https://nginx.org/en/docs/dev/development_guide.html)
- **Architecture** — Chapter "nginx" in "The Architecture of Open Source Applications" at [aosabook.org/en/nginx.html](http://www.aosabook.org/en/nginx.html)

**Source**: [NGINX Documentation](https://nginx.org/en/docs/index.html) | [Installing nginx](https://nginx.org/en/docs/install.html) | [Building from Sources](https://nginx.org/en/docs/configure.html) | [Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html) | [Controlling nginx](https://nginx.org/en/docs/control.html) | [Command-line parameters](https://nginx.org/en/docs/switches.html) | [Connection processing methods](https://nginx.org/en/docs/events.html) | [Setting up hashes](https://nginx.org/en/docs/hash.html) | [Debugging log](https://nginx.org/en/docs/debugging_log.html) | [Logging to syslog](https://nginx.org/en/docs/syslog.html) | [Configuration file measurement units](https://nginx.org/en/docs/syntax.html) | [nginx for Windows](https://nginx.org/en/docs/windows.html) | [Building on Win32](https://nginx.org/en/docs/howto_build_on_win32.html) | [DTrace debugging](https://nginx.org/en/docs/nginx_dtrace_pid_provider.html) | [QUIC and HTTP/3](https://nginx.org/en/docs/quic.html) | [How nginx processes a request](https://nginx.org/en/docs/http/request_processing.html) | [Server names](https://nginx.org/en/docs/http/server_names.html) | [WebSocket proxying](https://nginx.org/en/docs/http/websocket.html) | [njs Scripting](https://nginx.org/en/docs/njs/index.html) | [Contributing Changes](https://nginx.org/en/docs/contributing_changes.html) | [Development Guide](https://nginx.org/en/docs/dev/development_guide.html)
