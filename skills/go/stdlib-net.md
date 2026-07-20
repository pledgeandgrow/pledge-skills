# Standard Library: Networking — Go 1.26

## net

```go
import "net"

// Dial — connect to address
conn, err := net.Dial("tcp", "example.com:80")
conn, err := net.Dial("udp", "example.com:53")
conn, err := net.DialTimeout("tcp", "example.com:80", 5*time.Second)
defer conn.Close()

// Read/Write
buf := make([]byte, 1024)
n, err := conn.Read(buf)
n, err := conn.Write([]byte("GET / HTTP/1.0\r\n\r\n"))

// Set deadlines
conn.SetDeadline(time.Now().Add(10 * time.Second))
conn.SetReadDeadline(time.Now().Add(5 * time.Second))
conn.SetWriteDeadline(time.Now().Add(5 * time.Second))

// Listen — server
ln, err := net.Listen("tcp", ":8080")
defer ln.Close()

for {
    conn, err := ln.Accept()
    if err != nil {
        log.Println(err)
        continue
    }
    go handleConn(conn)
}

// ListenPacket — UDP server
pc, err := net.ListenPacket("udp", ":8080")
defer pc.Close()

buf := make([]byte, 1024)
n, addr, err := pc.ReadFrom(buf)
pc.WriteTo([]byte("response"), addr)

// Resolve
addr, err := net.ResolveTCPAddr("tcp", "example.com:80")
addr, err := net.ResolveUDPAddr("udp", "example.com:53")

// DNS lookup
ips, err := net.LookupIP("example.com")
mxs, err := net.LookupMX("example.com")
cnames, err := net.LookupCNAME("example.com")
txts, err := net.LookupTXT("example.com")
ns, err := net.LookupNS("example.com")
ptrs, err := net.LookupAddr("192.0.2.1")
```

## net/netip

```go
import "net/netip"

// IP addresses — modern API (Go 1.18+)
ip := netip.MustParseAddr("192.168.1.1")
ip := netip.MustParseAddr("::1")

ip, err := netip.ParseAddr("192.168.1.1")
ip.Is4()           // true
ip.Is6()           // false
ip.IsLoopback()    // false
ip.IsPrivate()     // true (RFC 1918)
ip.IsGlobalUnicast()
ip.IsMulticast()
ip.IsUnspecified()

// AddrPort
ap := netip.AddrPortFrom(ip, 8080)
ap := netip.MustParseAddrPort("192.168.1.1:8080")
ap.Addr()   // ip
ap.Port()   // 8080

// Prefix (CIDR)
prefix := netip.MustParsePrefix("192.168.0.0/16")
prefix.Contains(ip)  // true
prefix.Masked()      // normalized
prefix.Bits()        // 16

// Marshal/unmarshal
s := ip.String()
b, _ := ip.MarshalBinary()
```

## net/http

### Client

```go
import "net/http"

// Simple GET
resp, err := http.Get("https://example.com")
defer resp.Body.Close()
body, err := io.ReadAll(resp.Body)
fmt.Println(resp.Status)

// Custom request
req, err := http.NewRequest("GET", "https://example.com", nil)
req.Header.Set("Authorization", "Bearer token")
req.Header.Set("Accept", "application/json")

resp, err := http.DefaultClient.Do(req)
defer resp.Body.Close()

// POST with body
body := strings.NewReader(`{"key":"value"}`)
resp, err := http.Post("https://api.example.com", "application/json", body)

// POST form
resp, err := http.PostForm("https://example.com/form",
    url.Values{"key": {"value"}, "foo": {"bar"}})

// Custom client with timeout
client := &http.Client{
    Timeout: 30 * time.Second,
    Transport: &http.Transport{
        MaxIdleConns:        100,
        MaxIdleConnsPerHost: 10,
        IdleConnTimeout:     90 * time.Second,
    },
}
resp, err := client.Do(req)

// Context with timeout
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
req, _ := http.NewRequestWithContext(ctx, "GET", "https://example.com", nil)
resp, err := client.Do(req)
```

### Server

```go
// Basic server
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
})

http.HandleFunc("/api/", apiHandler)

log.Fatal(http.ListenAndServe(":8080", nil))

// Custom server
srv := &http.Server{
    Addr:         ":8080",
    Handler:      mux,
    ReadTimeout:  10 * time.Second,
    WriteTimeout: 10 * time.Second,
    IdleTimeout:  120 * time.Second,
}
log.Fatal(srv.ListenAndServe())

// TLS
log.Fatal(srv.ListenAndServeTLS("cert.pem", "key.pem"))

// HTTP/2 is automatic with TLS
// HTTP/3 requires quic-go or similar
```

### ServeMux (Go 1.22+ pattern routing)

```go
// Go 1.22+ enhanced routing with methods and wildcards
mux := http.NewServeMux()

// Method-based routing
mux.HandleFunc("GET /users", listUsers)
mux.HandleFunc("POST /users", createUser)
mux.HandleFunc("GET /users/{id}", getUser)
mux.HandleFunc("PUT /users/{id}", updateUser)
mux.HandleFunc("DELETE /users/{id}", deleteUser)

// Wildcards
mux.HandleFunc("GET /files/{path...}", serveFile)

// In handler — access path values
func getUser(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")
    fmt.Fprintf(w, "User: %s", id)
}
```

### Request

```go
// Request properties
r.Method          // "GET", "POST", etc.
r.URL             // *url.URL
r.Header          // http.Header
r.Body            // io.ReadCloser
r.Context()       // context.Context
r.RemoteAddr      // "192.168.1.1:12345"
r.Host            // "example.com"
r.Cookies()       // []*http.Cookie
r.UserAgent()
r.Referer()

// Parse form
r.ParseForm()
r.Form.Get("key")
r.PostForm.Get("key")

// Parse multipart
r.ParseMultipartForm(32 << 20)  // 32MB
r.MultipartForm.File["upload"]

// Path values (Go 1.22+)
r.PathValue("id")

// URL query params
q := r.URL.Query()
q.Get("search")
q["tags"]  // []string
```

### ResponseWriter

```go
// Write
w.Write([]byte("hello"))
w.WriteHeader(http.StatusOK)

// Set headers
w.Header().Set("Content-Type", "application/json")
w.Header().Add("X-Custom", "value")

// Set cookie
http.SetCookie(w, &http.Cookie{
    Name:  "session",
    Value: "abc123",
    Path:  "/",
    MaxAge: 3600,
    HttpOnly: true,
    Secure:   true,
    SameSite: http.SameSiteStrictMode,
})

// Flush (for streaming)
if f, ok := w.(http.Flusher); ok {
    f.Flush()
}

// Hijack (for WebSocket)
if hj, ok := w.(http.Hijacker); ok {
    conn, buf, _ := hj.Hijack()
    defer conn.Close()
    // raw connection access
}

// Status codes
http.StatusOK              // 200
http.StatusCreated         // 201
http.StatusNoContent       // 204
http.StatusBadRequest     // 400
http.StatusUnauthorized    // 401
http.StatusForbidden       // 403
http.StatusNotFound        // 404
http.StatusInternalServerError // 500
```

### Middleware

```go
// Logging middleware
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// Recovery middleware
func recoveryMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                http.Error(w, "Internal Server Error", http.StatusInternalServerError)
            }
        }()
        next.ServeHTTP(w, r)
    })
}

// Chain
mux.Use(loggingMiddleware, recoveryMiddleware)  // Go 1.22+ for ServeMux

// Manual chaining
handler := recoveryMiddleware(loggingMiddleware(mux))
```

### File Server

```go
// Serve files
fs := http.FileServer(http.Dir("./static"))
http.Handle("/static/", http.StripPrefix("/static/", fs))

// Serve single file
http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
    http.ServeFile(w, r, "favicon.ico")
})

// Embed + file server
//go:embed static
var staticFS embed.FS
staticContent, _ := fs.Sub(staticFS, "static")
http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.FS(staticContent))))
```

### httptest

```go
import "net/http/httptest"

// Test server
ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, test!")
}))
defer ts.Close()

resp, _ := http.Get(ts.URL)
body, _ := io.ReadAll(resp.Body)

// Test request
req := httptest.NewRequest("GET", "/users/42", nil)
req.SetPathValue("id", "42")

// Test response recorder
w := httptest.NewRecorder()
handler.ServeHTTP(w, req)
w.Code         // 200
w.Body.String() // response body
w.Header().Get("Content-Type")
```

### httptrace

```go
import "net/http/httptrace"

req, _ := http.NewRequest("GET", "https://example.com", nil)
trace := &httptrace.ClientTrace{
    DNSStart:    func(info httptrace.DNSStartInfo) { log.Println("DNS start:", info.Host) },
    DNSDone:     func(info httptrace.DNSDoneInfo) { log.Println("DNS done:", info.Addrs) },
    ConnectStart: func(network, addr string) { log.Println("Connect start:", addr) },
    ConnectDone:  func(network, addr string, err error) { log.Println("Connect done") },
    GotConn:      func(info httptrace.GotConnInfo) { log.Println("Got conn") },
    WroteRequest: func(info httptrace.WroteRequestInfo) { log.Println("Wrote request") },
    GotFirstResponseByte: func() { log.Println("First response byte") },
}
req = req.WithContext(httptrace.WithClientTrace(req.Context(), trace))
resp, _ := http.DefaultClient.Do(req)
```

### httputil

```go
import "net/http/httputil"

// Reverse proxy
proxy := httputil.NewSingleHostReverseProxy(targetURL)
proxy.ServeHTTP(w, r)

// Dump request
dump, _ := httputil.DumpRequest(req, true)
fmt.Println(string(dump))

// Dump response
dump, _ := httputil.DumpResponse(resp, true)
```

## net/url

```go
import "net/url"

// Parse
u, err := url.Parse("https://user:pass@example.com:8080/path?q=1#frag")

u.Scheme    // "https"
u.User      // *url.Userinfo
u.Host      // "example.com:8080"
u.Hostname() // "example.com"
u.Port()    // "8080"
u.Path      // "/path"
u.RawQuery  // "q=1"
u.Fragment  // "frag"

// Query parameters
u.Query()  // url.Values
q := url.Values{}
q.Set("key", "value")
q.Add("tag", "a")
q.Add("tag", "b")
q.Encode()  // "key=value&tag=a&tag=b"

// Build URL
u := &url.URL{
    Scheme:   "https",
    Host:     "example.com",
    Path:     "/api",
    RawQuery: q.Encode(),
}
s := u.String()  // "https://example.com/api?key=value&tag=a&tag=b"

// JoinPath (Go 1.19+)
u, _ := url.Parse("https://example.com")
u = u.JoinPath("api", "v1", "users")
// "https://example.com/api/v1/users"

// ParseQuery
v, err := url.ParseQuery("a=1&b=2&c=3")
v.Get("a")  // "1"
v["b"]      // ["2"]
```

## net/mail

```go
import "net/mail"

// Parse address
addr, err := mail.ParseAddress("Alice <alice@example.com>")
addr.Name    // "Alice"
addr.Address // "alice@example.com"

// Parse address list
addrs, err := mail.ParseAddressList("a@a.com, b@b.com")

// Read message
msg, err := mail.ReadMessage(buf)
msg.Header.Get("Subject")
msg.Body

// Create message
var buf bytes.Buffer
w := mail.NewWriter(&buf)
w.Header("From", "alice@example.com")
w.Header("To", "bob@example.com")
w.Header("Subject", "Hello")
```

## net/rpc

```go
import "net/rpc"

// Server
type Arith struct{}

func (a *Arith) Multiply(args *Args, reply *int) error {
    *reply = args.A * args.B
    return nil
}

arith := new(Arith)
rpc.Register(arith)
rpc.HandleHTTP()
l, _ := net.Listen("tcp", ":1234")
go http.Serve(l, nil)

// Client
client, _ := rpc.DialHTTP("tcp", "localhost:1234")
args := &Args{A: 7, B: 8}
var reply int
err := client.Call("Arith.Multiply", args, &reply)
// reply = 56

// Async call
call := client.Go("Arith.Multiply", args, &reply, nil)
replyCall := <-call.Done
```

## net/smtp

```go
import "net/smtp"

// Send email
err := smtp.SendMail(
    "smtp.example.com:587",
    smtp.PlainAuth("", "user", "pass", "smtp.example.com"),
    "from@example.com",
    []string{"to@example.com"},
    []byte("To: to@example.com\r\nSubject: Hello\r\n\r\nBody"),
)

// Custom client
client, _ := smtp.Dial("smtp.example.com:587")
client.Auth(smtp.PlainAuth("", "user", "pass", "smtp.example.com"))
client.Mail("from@example.com")
client.Rcpt("to@example.com")
w, _ := client.Data()
w.Write([]byte("Subject: Hello\r\n\r\nBody"))
w.Close()
client.Quit()
```

## net/textproto

```go
import "net/textproto"

// Read/write text protocols (SMTP, NNTP, etc.)
conn, _ := net.Dial("tcp", "example.com:80")
rw := textproto.NewConn(conn)
code, msg, _ := rw.ReadResponse(200)
rw.PrintfLine("GET / HTTP/1.0")
```

## net/http/cookiejar

```go
import "net/http/cookiejar"

// Create cookie jar — manages cookies per domain
jar, err := cookiejar.New(&cookiejar.Options{
    PublicSuffixList: nil,  // use golang.org/x/net/publicsuffix for security
})

// Use with HTTP client
client := &http.Client{
    Jar: jar,
}

// Cookies are automatically stored and sent
resp, _ := client.Get("https://example.com/login")
// Subsequent requests to example.com will include cookies
resp, _ = client.Get("https://example.com/dashboard")

// Manually inspect cookies
u, _ := url.Parse("https://example.com")
cookies := jar.Cookies(u)
for _, c := range cookies {
    fmt.Printf("%s=%s\n", c.Name, c.Value)
}

// Set cookies manually
jar.SetCookies(u, []*http.Cookie{
    {Name: "session", Value: "abc123"},
})
```

## net/http/cgi

```go
import "net/http/cgi"

// Run as CGI script (behind Apache, nginx, etc.)
func main() {
    cgi.Serve(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Content-Type: text/html\n\n")
        fmt.Fprintf(w, "<h1>Hello from CGI</h1>")
    }))
}

// Serve with custom handler
err := cgi.Serve(http.NewServeMux())
```

## net/http/fcgi

```go
import "net/http/fcgi"

// Serve as FastCGI (behind nginx, etc.)
func main() {
    err := fcgi.Serve(nil, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello from FastCGI")
    }))
}

// Serve on specific listener
l, _ := net.Listen("tcp", "127.0.0.1:9000")
fcgi.Serve(l, handler)
```

## net/http/pprof

```go
import _ "net/http/pprof"

// Registers pprof handlers on http.DefaultServeMux
// Just import the package — it auto-registers:
//   /debug/pprof/           — index page
//   /debug/pprof/cmdline    — command line
//   /debug/pprof/profile    — CPU profile
//   /debug/pprof/symbol     — symbol lookup
//   /debug/pprof/trace      — execution trace
//   /debug/pprof/allocs     — allocation profile
//   /debug/pprof/heap       — heap profile
//   /debug/pprof/goroutine  — goroutine profile
//   /debug/pprof/block      — blocking profile
//   /debug/pprof/mutex      — mutex profile
//   /debug/pprof/threadcreate — thread creation profile

// Start server
go http.ListenAndServe("localhost:6060", nil)

// Or with custom mux
mux := http.NewServeMux()
pprof.Register(mux)  // Go 1.22+ — register on custom mux
go http.ListenAndServe("localhost:6060", mux)

// Fetch profiles from command line
// go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
// go tool pprof http://localhost:6060/debug/pprof/heap
// go tool pprof http://localhost:6060/debug/pprof/goroutine
// go tool trace http://localhost:6060/debug/pprof/trace?seconds=5

// In production — restrict access
mux.HandleFunc("/debug/pprof/", func(w http.ResponseWriter, r *http.Request) {
    user, pass, ok := r.BasicAuth()
    if !ok || user != "admin" || pass != "secret" {
        w.Header().Set("WWW-Authenticate", "Basic")
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }
    // Delegate to pprof
    http.DefaultServeMux.ServeHTTP(w, r)
})
```

## net/http/httptest (recap)

```go
import "net/http/httptest"

// NewServer — starts a real HTTP server
ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, client")
}))
defer ts.Close()

resp, _ := http.Get(ts.URL)

// NewServer with TLS
ts := httptest.NewTLSServer(handler)
defer ts.Close()
// ts.Client() — returns *http.Client configured for the test server

// NewRecorder — captures response without server
w := httptest.NewRecorder()
handler.ServeHTTP(w, req)
w.Code         // 200
w.Body.String() // response body
w.Header().Get("Content-Type")
```
