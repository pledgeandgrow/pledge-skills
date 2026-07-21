# NGINX

> **Version**: Latest (1.29.x) | **Source**: [nginx.org/en/docs](https://nginx.org/en/docs/index.html)

## Overview

NGINX is a high-performance HTTP web server, reverse proxy, IMAP/POP3 mail proxy, and TCP/UDP load balancer. It uses an event-driven, asynchronous architecture with a master-worker process model, delivering high concurrency with low memory footprint. NGINX powers a significant portion of the web as a front-end proxy, load balancer, and content delivery server.

## Quick Reference

| Topic | File | Key Content |
|-------|------|-------------|
| Getting Started | `getting-started.md` | What is NGINX, architecture (master-worker, event-driven), installation (Linux, FreeBSD, Windows, building from sources, Win32 Visual C build), beginner's guide (configuration structure, directives, contexts, serving static content, proxy, FastCGI), how NGINX processes a request, server names (exact, wildcard, regex, IDN), controlling NGINX (signals, binary upgrade), command-line parameters, connection processing methods (epoll, kqueue, select, poll), configuration units, debugging (debug log, DTrace), setting up hashes, njs scripting, contributing |
| HTTP Modules | `http-modules.md` | Core module (server, listen, location matching, root, alias, try_files, error_page, client handling, file processing, WebSocket proxying), proxy module (proxy_pass, headers, buffering, caching, timeouts, SSL), upstream module (round robin, least_conn, ip_hash, hash, random, server parameters, keepalive, health checks, state, zone), rewrite module (rewrite, return, if, set), FastCGI module, access control, auth basic, auth request, auth JWT, auth require, gzip, headers, limit conn, limit req, logging, map, num map, geo, geoip, real IP, referer, SSI, sub filter, browser, charset, slice, split clients, mirror, secure link, addition, autoindex, DAV, image filter, XSLT, Perl, JavaScript, user ID, HTTP/2, HTTP/3, API, keyval, OIDC, gRPC, SCGI, uWSGI, memcached, gunzip, gzip static, stub status, status, session log, ACME, OpenTelemetry, empty GIF, F4F, FLV, HLS, MP4, random index, internal redirect, tunnel, upstream conf, proxy protocol vendor, management |
| Stream & Mail Modules | `stream-mail-modules.md` | Stream core (TCP/UDP proxy, listen, proxy_pass, preread, resolver), stream proxy (all proxy directives, UDP, rate limiting), stream upstream (load balancing methods, health checks), stream SSL, stream SSL preread (SNI without termination), stream access, geo, geoip, map, num map, limit conn, log, return, set, pass, split clients, JS, keyval, upstream HC, zone sync, MQTT preread/filter, proxy protocol vendor, real IP; Mail core (IMAP/POP3/SMTP proxy, protocol auto-detection), mail auth HTTP (authentication delegation, headers, response), mail proxy, mail SSL, mail real IP, mail IMAP/POP3/SMTP modules |
| Advanced Topics | `advanced.md` | SSL/TLS (HTTPS setup, all ssl_ directives, certificate chains, SNI, OCSP stapling, client verification, SSL variables), HTTP/2 (enabling, directives, server push), HTTP/3 and QUIC (enabling, directives, building, 0-RTT, troubleshooting), load balancing (all methods, weighted, health checks, session persistence, dynamic reconfiguration), reverse proxy patterns, security (rate limiting, connection limiting, access control, auth, DDoS protection, security headers), performance tuning (workers, sendfile, keepalive, compression, caching, open file cache, thread pools, buffers), logging (access log formats, error log, log rotation), variables reference (core HTTP, upstream), converting rewrite rules from Apache, full configuration example |

## Core Concepts

- **Master process** — Reads/validates config, manages worker processes
- **Worker process** — Handles network connections via event loop (non-blocking I/O)
- **Directive** — Configuration instruction (simple: `name params;` or block: `name { ... }`)
- **Context** — Block that can contain other directives (main, events, http, server, location, upstream, mail, stream)
- **Location** — URI matching block within a server (exact, prefix, regex)
- **Server name** — Virtual host identification (exact, wildcard, regex)
- **Upstream** — Server group for load balancing
- **Proxy** — Forwarding requests to backend servers (HTTP, FastCGI, SCGI, uWSGI, gRPC)
- **Reverse proxy** — Accepting client requests and forwarding to backend
- **Load balancing** — Distributing requests across multiple servers (round robin, least_conn, ip_hash, hash, random)
- **SSL/TLS** — Secure connections with certificates and ciphers
- **SNI** — Server Name Indication for name-based HTTPS
- **HTTP/2** — Binary multiplexed protocol with server push
- **HTTP/3** — HTTP over QUIC (UDP-based, 0-RTT)
- **Stream** — TCP/UDP proxy and load balancing
- **Mail proxy** — IMAP/POP3/SMTP proxy with auth delegation
- **njs** — JavaScript subset for configuration scripting
- **Variable** — Runtime value (core, HTTP, upstream, SSL, stream)
- **Map** — Key-value mapping for variable transformation
- **Rewrite** — URI modification using regex
- **Access log** — Request logging with custom formats
- **Error log** — Server error and debug logging
- **Proxy cache** — Caching upstream responses in shared memory
- **Health check** — Monitoring upstream server availability (passive or active)
- **PROXY protocol** — Preserving client connection info through proxies
- **ACME** — Automated certificate management (Let's Encrypt)
- **OpenTelemetry** — Distributed tracing (commercial)
- **Zone sync** — Synchronizing shared state across NGINX cluster (commercial)

## Official Documentation Links

- [NGINX Documentation](https://nginx.org/en/docs/index.html)
- [Installing nginx](https://nginx.org/en/docs/install.html)
- [Building from Sources](https://nginx.org/en/docs/configure.html)
- [Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Controlling nginx](https://nginx.org/en/docs/control.html)
- [Command-line parameters](https://nginx.org/en/docs/switches.html)
- [Connection processing methods](https://nginx.org/en/docs/events.html)
- [Setting up hashes](https://nginx.org/en/docs/hash.html)
- [Debugging log](https://nginx.org/en/docs/debugging_log.html)
- [Logging to syslog](https://nginx.org/en/docs/syslog.html)
- [Configuration file measurement units](https://nginx.org/en/docs/syntax.html)
- [nginx for Windows](https://nginx.org/en/docs/windows.html)
- [QUIC and HTTP/3](https://nginx.org/en/docs/quic.html)
- [How nginx processes a request](https://nginx.org/en/docs/http/request_processing.html)
- [Server names](https://nginx.org/en/docs/http/server_names.html)
- [HTTP load balancing](https://nginx.org/en/docs/http/load_balancing.html)
- [Configuring HTTPS servers](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [How nginx processes a TCP/UDP session](https://nginx.org/en/docs/stream/stream_processing.html)
- [WebSocket proxying](https://nginx.org/en/docs/http/websocket.html)
- [Converting rewrite rules](https://nginx.org/en/docs/http/converting_rewrite_rules.html)
- [Scripting with njs](https://nginx.org/en/docs/njs/index.html)
- [Contributing Changes](https://nginx.org/en/docs/contributing_changes.html)
- [Development Guide](https://nginx.org/en/docs/dev/development_guide.html)
- [Core functionality](https://nginx.org/en/docs/ngx_core_module.html)
- [HTTP Core Module](https://nginx.org/en/docs/http/ngx_http_core_module.html)
- [HTTP Proxy Module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [HTTP Upstream Module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [HTTP Upstream HC Module](https://nginx.org/en/docs/http/ngx_http_upstream_hc_module.html)
- [HTTP Upstream Conf Module](https://nginx.org/en/docs/http/ngx_http_upstream_conf_module.html)
- [HTTP SSL Module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [HTTP Rewrite Module](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html)
- [HTTP FastCGI Module](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html)
- [HTTP/2 Module](https://nginx.org/en/docs/http/ngx_http_v2_module.html)
- [HTTP/3 Module](https://nginx.org/en/docs/http/ngx_http_v3_module.html)
- [HTTP Access Module](https://nginx.org/en/docs/http/ngx_http_access_module.html)
- [HTTP Auth Basic Module](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
- [HTTP Auth Request Module](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html)
- [HTTP Auth JWT Module](https://nginx.org/en/docs/http/ngx_http_auth_jwt_module.html)
- [HTTP Auth Require Module](https://nginx.org/en/docs/http/ngx_http_auth_require_module.html)
- [HTTP Autoindex Module](https://nginx.org/en/docs/http/ngx_http_autoindex_module.html)
- [HTTP Browser Module](https://nginx.org/en/docs/http/ngx_http_browser_module.html)
- [HTTP Charset Module](https://nginx.org/en/docs/http/ngx_http_charset_module.html)
- [HTTP DAV Module](https://nginx.org/en/docs/http/ngx_http_dav_module.html)
- [HTTP Empty GIF Module](https://nginx.org/en/docs/http/ngx_http_empty_gif_module.html)
- [HTTP F4F Module](https://nginx.org/en/docs/http/ngx_http_f4f_module.html)
- [HTTP FLV Module](https://nginx.org/en/docs/http/ngx_http_flv_module.html)
- [HTTP Geo Module](https://nginx.org/en/docs/http/ngx_http_geo_module.html)
- [HTTP GeoIP Module](https://nginx.org/en/docs/http/ngx_http_geoip_module.html)
- [HTTP gRPC Module](https://nginx.org/en/docs/http/ngx_http_grpc_module.html)
- [HTTP Gunzip Module](https://nginx.org/en/docs/http/ngx_http_gunzip_module.html)
- [HTTP Gzip Module](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)
- [HTTP Gzip Static Module](https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html)
- [HTTP Headers Module](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [HTTP HLS Module](https://nginx.org/en/docs/http/ngx_http_hls_module.html)
- [HTTP Image Filter Module](https://nginx.org/en/docs/http/ngx_http_image_filter_module.html)
- [HTTP Index Module](https://nginx.org/en/docs/http/ngx_http_index_module.html)
- [HTTP Internal Redirect Module](https://nginx.org/en/docs/http/ngx_http_internal_redirect_module.html)
- [HTTP JS Module](https://nginx.org/en/docs/http/ngx_http_js_module.html)
- [HTTP Keyval Module](https://nginx.org/en/docs/http/ngx_http_keyval_module.html)
- [HTTP Limit Conn Module](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)
- [HTTP Limit Req Module](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- [HTTP Log Module](https://nginx.org/en/docs/http/ngx_http_log_module.html)
- [HTTP Map Module](https://nginx.org/en/docs/http/ngx_http_map_module.html)
- [HTTP Memcached Module](https://nginx.org/en/docs/http/ngx_http_memcached_module.html)
- [HTTP Mirror Module](https://nginx.org/en/docs/http/ngx_http_mirror_module.html)
- [HTTP MP4 Module](https://nginx.org/en/docs/http/ngx_http_mp4_module.html)
- [HTTP Num Map Module](https://nginx.org/en/docs/http/ngx_http_num_map_module.html)
- [HTTP OIDC Module](https://nginx.org/en/docs/http/ngx_http_oidc_module.html)
- [HTTP Perl Module](https://nginx.org/en/docs/http/ngx_http_perl_module.html)
- [HTTP Proxy Protocol Vendor Module](https://nginx.org/en/docs/http/ngx_http_proxy_protocol_vendor_module.html)
- [HTTP Random Index Module](https://nginx.org/en/docs/http/ngx_http_random_index_module.html)
- [HTTP Real IP Module](https://nginx.org/en/docs/http/ngx_http_realip_module.html)
- [HTTP Referer Module](https://nginx.org/en/docs/http/ngx_http_referer_module.html)
- [HTTP SCGI Module](https://nginx.org/en/docs/http/ngx_http_scgi_module.html)
- [HTTP Secure Link Module](https://nginx.org/en/docs/http/ngx_http_secure_link_module.html)
- [HTTP Session Log Module](https://nginx.org/en/docs/http/ngx_http_session_log_module.html)
- [HTTP Slice Module](https://nginx.org/en/docs/http/ngx_http_slice_module.html)
- [HTTP Split Clients Module](https://nginx.org/en/docs/http/ngx_http_split_clients_module.html)
- [HTTP SSI Module](https://nginx.org/en/docs/http/ngx_http_ssi_module.html)
- [HTTP Status Module](https://nginx.org/en/docs/http/ngx_http_status_module.html)
- [HTTP Stub Status Module](https://nginx.org/en/docs/http/ngx_http_stub_status_module.html)
- [HTTP Sub Module](https://nginx.org/en/docs/http/ngx_http_sub_module.html)
- [HTTP Tunnel Module](https://nginx.org/en/docs/http/ngx_http_tunnel_module.html)
- [HTTP User ID Module](https://nginx.org/en/docs/http/ngx_http_userid_module.html)
- [HTTP uWSGI Module](https://nginx.org/en/docs/http/ngx_http_uwsgi_module.html)
- [HTTP XSLT Module](https://nginx.org/en/docs/http/ngx_http_xslt_module.html)
- [HTTP ACME Module](https://nginx.org/en/docs/http/ngx_http_acme_module.html)
- [HTTP API Module](https://nginx.org/en/docs/http/ngx_http_api_module.html)
- [HTTP Addition Module](https://nginx.org/en/docs/http/ngx_http_addition_module.html)
- [Stream Core Module](https://nginx.org/en/docs/stream/ngx_stream_core_module.html)
- [Stream Upstream Module](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html)
- [Stream Upstream HC Module](https://nginx.org/en/docs/stream/ngx_stream_upstream_hc_module.html)
- [Stream SSL Module](https://nginx.org/en/docs/stream/ngx_stream_ssl_module.html)
- [Stream SSL Preread Module](https://nginx.org/en/docs/stream/ngx_stream_ssl_preread_module.html)
- [Stream Proxy Module](https://nginx.org/en/docs/stream/ngx_stream_proxy_module.html)
- [Stream Access Module](https://nginx.org/en/docs/stream/ngx_stream_access_module.html)
- [Stream Geo Module](https://nginx.org/en/docs/stream/ngx_stream_geo_module.html)
- [Stream GeoIP Module](https://nginx.org/en/docs/stream/ngx_stream_geoip_module.html)
- [Stream JS Module](https://nginx.org/en/docs/stream/ngx_stream_js_module.html)
- [Stream Keyval Module](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html)
- [Stream Limit Conn Module](https://nginx.org/en/docs/stream/ngx_stream_limit_conn_module.html)
- [Stream Log Module](https://nginx.org/en/docs/stream/ngx_stream_log_module.html)
- [Stream Map Module](https://nginx.org/en/docs/stream/ngx_stream_map_module.html)
- [Stream MQTT Preread Module](https://nginx.org/en/docs/stream/ngx_stream_mqtt_preread_module.html)
- [Stream MQTT Filter Module](https://nginx.org/en/docs/stream/ngx_stream_mqtt_filter_module.html)
- [Stream Num Map Module](https://nginx.org/en/docs/stream/ngx_stream_num_map_module.html)
- [Stream Pass Module](https://nginx.org/en/docs/stream/ngx_stream_pass_module.html)
- [Stream Proxy Protocol Vendor Module](https://nginx.org/en/docs/stream/ngx_stream_proxy_protocol_vendor_module.html)
- [Stream Real IP Module](https://nginx.org/en/docs/stream/ngx_stream_realip_module.html)
- [Stream Return Module](https://nginx.org/en/docs/stream/ngx_stream_return_module.html)
- [Stream Set Module](https://nginx.org/en/docs/stream/ngx_stream_set_module.html)
- [Stream Split Clients Module](https://nginx.org/en/docs/stream/ngx_stream_split_clients_module.html)
- [Stream Zone Sync Module](https://nginx.org/en/docs/stream/ngx_stream_zone_sync_module.html)
- [Mail Core Module](https://nginx.org/en/docs/mail/ngx_mail_core_module.html)
- [Mail Auth HTTP Module](https://nginx.org/en/docs/mail/ngx_mail_auth_http_module.html)
- [Mail Proxy Module](https://nginx.org/en/docs/mail/ngx_mail_proxy_module.html)
- [Mail Real IP Module](https://nginx.org/en/docs/mail/ngx_mail_realip_module.html)
- [Mail SSL Module](https://nginx.org/en/docs/mail/ngx_mail_ssl_module.html)
- [Mail IMAP Module](https://nginx.org/en/docs/mail/ngx_mail_imap_module.html)
- [Mail POP3 Module](https://nginx.org/en/docs/mail/ngx_mail_pop3_module.html)
- [Mail SMTP Module](https://nginx.org/en/docs/mail/ngx_mail_smtp_module.html)
- [Google Perftools Module](https://nginx.org/en/docs/ngx_google_perftools_module.html)
- [Management Module](https://nginx.org/en/docs/ngx_mgmt_module.html)
- [OpenTelemetry Module](https://nginx.org/en/docs/ngx_otel_module.html)
- [Alphabetical index of directives](https://nginx.org/en/docs/dirindex.html)
- [Alphabetical index of variables](https://nginx.org/en/docs/varindex.html)
- [FAQ](https://nginx.org/en/docs/faq.html)
- [Security Advisories](https://nginx.org/en/security_advisories.html)
