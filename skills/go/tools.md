# Tools & Diagnostics — Go 1.26

## The go Command

```bash
# Build
go build                    # build current package
go build ./...              # build all packages
go build -o myapp           # specify output name
go build -v ./...           # verbose
go build -race ./...        # race detector
go build -ldflags="-s -w"   # strip debug info, smaller binary
go build -tags="production" # build tags
go build -trimpath          # remove file system paths from binary
go build -cover             # include coverage instrumentation (Go 1.20+)
go build -pgo=profile.pprof # profile-guided optimization

# Run
go run .                    # compile and run
go run main.go              # run specific file
go run -race .

# Test
go test ./...               # test all
go test -v -race ./...      # verbose with race detector
go test -cover -coverprofile=c.out
go test -bench=. -benchmem
go test -fuzz=FuzzName -fuzztime=5m

# Format
go fmt ./...                # format all files
gofmt -w file.go            # format single file
gofmt -d file.go            # show diff

# Vet
go vet ./...                # static analysis
go vet -unsafeptr ./...     # specific analyzer

# Mod
go mod init example.com/pkg
go mod tidy
go mod download
go mod verify
go mod vendor

# Get
go get example.com/pkg@latest
go get -u ./...
go get -u=patch ./...

# Install
go install example.com/cmd/tool@latest
go install ./cmd/myapp      # install local

# List
go list ./...               # list packages
go list -m all              # list modules
go list -json .             # JSON output

# Version
go version                  # Go version
go version -m myapp         # module info from binary

# Env
go env GOROOT
go env -w GOPRIVATE=*.corp.example.com
go env -json                # JSON output

# Clean
go clean                    # remove build cache
go clean -i                 # also remove installed binaries
go clean -modcache          # remove module cache
go clean -testcache         # remove test cache

# Doc
go doc fmt.Println          # documentation
go doc -all                 # all declarations
go doc -src fmt.Println     # show source

# Work (workspaces)
go work init ./mod1 ./mod2
go work use ./mod3
go work sync

# Tool
go tool pprof cpu.prof
go tool trace trace.out
go tool cover -html=c.out
go tool covdata textfmt -i=./covdir -o coverage.txt

# Generate
go generate ./...           # run go:generate directives

# Cgo
go env CGO_ENABLED          # check cgo status
CGO_ENABLED=0 go build      # disable cgo (static binary)
```

## go:generate

```go
//go:generate stringer -type=Pill
//go:generate mockgen -source=service.go -destination=mocks/service_mock.go
//go:generate protoc --go_out=. proto/service.proto

package mypackage

type Pill int
const (
    Placebo Pill = iota
    Aspirin
    Ibuprofen
)
```

```bash
go generate ./...
```

## gofmt / go fmt

```bash
# Format files
gofmt -w *.go               # write changes
gofmt -d *.go               # show diff
gofmt -l .                  # list files needing formatting

# Simplify code
gofmt -s -w *.go            # simplify (e.g., remove unnecessary types)

# go fmt — convenience wrapper
go fmt ./...
```

## go vet

```bash
# Run all analyzers
go vet ./...

# Specific analyzers
go vet -printf ./...        # check printf format strings
go vet -composites ./...    # check composite literal keys
go vet -shadow ./...        # check variable shadowing
go vet -unsafeptr ./...     # check unsafe pointer arithmetic
go vet -unreachable ./...   # check unreachable code

# Custom analyzers
go install golang.org/x/tools/go/analysis/passes/fieldalignment/cmd/fieldalignment@latest
fieldalignment ./...
```

## Profiling

### CPU Profiling

```go
import "runtime/pprof"

func main() {
    f, _ := os.Create("cpu.prof")
    defer f.Close()
    pprof.StartCPUProfile(f)
    defer pprof.StopCPUProfile()

    // Your code here
}
```

```bash
# Analyze
go tool pprof cpu.prof
# (pprof) top
# (pprof) top10
# (pprof) list FunctionName
# (pprof) web          # SVG graph (requires graphviz)
# (pprof) tree
# (pprof) png > cpu.png

# HTTP pprof
import _ "net/http/pprof"
go http.ListenAndServe("localhost:6060", nil)
# go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
```

### Memory Profiling

```go
f, _ := os.Create("mem.prof")
defer f.Close()
runtime.GC()  // get up-to-date statistics
pprof.WriteHeapProfile(f)
```

```bash
go tool pprof mem.prof
# (pprof) top
# (pprof) list FunctionName
# (pprof) web

# HTTP memory profile
# go tool pprof http://localhost:6060/debug/pprof/heap
```

### Goroutine Profiling

```bash
# HTTP endpoint
# go tool pprof http://localhost:6060/debug/pprof/goroutine

# From code
f, _ := os.Create("goroutine.prof")
pprof.Lookup("goroutine").WriteTo(f, 0)
```

### Trace

```go
import "runtime/trace"

f, _ := os.Create("trace.out")
defer f.Close()
trace.Start(f)
defer trace.Stop()

// Your code here
```

```bash
go tool trace trace.out
# Opens web browser with trace viewer
# Shows: goroutine creation, blocking, syscall, GC events
```

## Profile-Guided Optimization (PGO)

```bash
# 1. Build instrumented binary (or use production pprof data)
go build -o myapp

# 2. Run with profiling
import _ "net/http/pprof"
# Or collect cpu.prof from production

# 3. Build with PGO
go build -pgo=cpu.prof -o myapp-optimized

# PGO uses runtime profile data to:
# - Inline hot functions
# - Optimize branch prediction
# - Improve code layout
# Typical improvement: 2-7%
```

## Garbage Collection

### GOGC

```bash
# GOGC controls GC trigger (default: 100)
# GOGC=100 means GC runs when heap doubles
# GOGC=50 — more aggressive (runs when heap grows 50%)
# GOGC=200 — less aggressive
# GOGC=off — disable GC (dangerous!)

GOGC=200 ./myapp

# In code
debug.SetGCPercent(200)
```

### GOMEMLIMIT

```bash
# Soft memory limit (Go 1.19+)
# GOMEMLIMIT=1GiB ./myapp

# In code
debug.SetMemoryLimit(1 << 30)  # 1GB
```

### GC Guide

Key points:
- GC is concurrent — runs alongside application
- Green Tea GC (Go 1.26) — 10-40% reduction in GC overhead
- STW (Stop-The-World) pauses are typically <1ms
- `runtime.GC()` — force GC (for testing)
- `debug.FreeOSMemory()` — return memory to OS
- `GODEBUG=gctrace=1` — print GC log

```bash
# GC trace
GODEBUG=gctrace=1 ./myapp
# Output: gc 1 @0.045s 1%: 0.013+0.36+0.022 ms clock, ...

# gcpacertrace — GC pacing details
GODEBUG=gctrace=1,gcpacertrace=1 ./myapp
```

### GOEXPERIMENT

```bash
# Disable Green Tea GC (Go 1.26)
GOEXPERIMENT=nogreenteagc go build

# Disable heap randomization
GOEXPERIMENT=norandomizedheapbase64 go build

# Enable SIMD (experimental)
GOEXPERIMENT=simd go build

# Enable runtime/secret (experimental)
GOEXPERIMENT=runtimesecret go build
```

## Diagnostics

### GODEBUG

```bash
# GC trace
GODEBUG=gctrace=1 ./myapp

# Allocation trace
GODEBUG=allocfreetrace=1 ./myapp

# Schedule trace
GODEBUG=schedtrace=1000 ./myapp  # print every 1000ms

# Async preemption
GODEBUG=asyncpreemptoff=1 ./myapp

# HTTP/2 debug
GODEBUG=http2debug=1 ./myapp
GODEBUG=http2debug=2 ./myapp  # verbose

# TLS debug
GODEBUG=tlskeylog=sslkeys.log ./myapp  # for Wireshark

# FIPS 140
GODEBUG=fips140=only ./myapp
```

### Build Info

```go
import "runtime/debug"

info, _ := debug.ReadBuildInfo()
fmt.Println(info.GoVersion)
fmt.Println(info.Main.Path, info.Main.Version)
for _, s := range info.Settings {
    fmt.Printf("%s=%s\n", s.Key, s.Value)
}
```

```bash
# From binary
go version -m myapp
# Shows: module path, version, Go version, build settings
```

### Runtime Stats

```go
var m runtime.MemStats
runtime.ReadMemStats(&m)

fmt.Printf("Alloc = %v MiB", m.Alloc / 1024 / 1024)
fmt.Printf("TotalAlloc = %v MiB", m.TotalAlloc / 1024 / 1024)
fmt.Printf("Sys = %v MiB", m.Sys / 1024 / 1024)
fmt.Printf("NumGC = %v", m.NumGC)
fmt.Printf("Goroutines = %v", runtime.NumGoroutine())
```

## Editors & IDE Support

### gopls

```bash
# Install language server
go install golang.org/x/tools/gopls@latest

# Configuration
# VS Code: Go extension (uses gopls)
# GoLand: JetBrains (built-in)
# Neovim: nvim-lspconfig with gopls
# Vim: vim-go
# Emacs: lsp-mode with gopls
```

### VS Code

```json
// settings.json
{
    "go.formatTool": "gofmt",
    "go.lintTool": "staticcheck",
    "go.useLanguageServer": true,
    "gopls": {
        "ui.semanticTokens": true,
        "build.staticcheck": true
    }
}
```

### Static Analysis

```bash
# staticcheck — advanced static analysis
go install honnef.co/go/tools/cmd/staticcheck@latest
staticcheck ./...

# golangci-lint — meta linter
# .golangci.yml for configuration
golangci-lint run ./...

# gosec — security analysis
go install github.com/securego/gosec/v2/cmd/gosec@latest
gosec ./...

# errcheck — check for unchecked errors
go install github.com/kisielk/errcheck@latest
errcheck ./...

# gofmt -s — simplify
gofmt -s -l .

# goimports — manage imports
go install golang.org/x/tools/cmd/goimports@latest
goimports -l .
```

## Cross-Compilation

```bash
# Set GOOS and GOARCH
GOOS=linux GOARCH=amd64 go build -o app-linux-amd64
GOOS=linux GOARCH=arm64 go build -o app-linux-arm64
GOOS=darwin GOARCH=arm64 go build -o app-darwin-arm64
GOOS=windows GOARCH=amd64 go build -o app-windows-amd64.exe
GOOS=js GOARCH=wasm go build -o app.wasm

# List supported platforms
go tool dist list

# CGO cross-compilation (requires cross-compiler)
CGO_ENABLED=1 GOOS=linux GOARCH=arm64 CC=aarch64-linux-gnu-gcc go build

# Static binary
CGO_ENABLED=0 go build -ldflags="-s -w" -o app
```

## Vulnerability Management

### govulncheck

```bash
# Install
go install golang.org/x/vuln/cmd/govulncheck@latest

# Scan current module
govulncheck ./...

# Scan with verbose output
govulncheck -v ./...

# JSON output (for CI/CD)
govulncheck -json ./...

# Scan specific packages
govulncheck ./cmd/...

# Mode: source (default) — analyzes source code
govulncheck -mode source ./...

# Mode: binary — analyzes compiled binary
govulncheck -mode binary ./myapp

# Show call stacks
govulncheck -show verbose ./...
```

### Go Vulnerability Database

```bash
# The Go vulnerability database (vuln.go.dev) is maintained by the Go team
# It tracks known vulnerabilities in Go modules

# govulncheck uses this database to find:
# - Vulnerabilities in your direct dependencies
# - Whether your code actually calls vulnerable functions
# - Severity and fix information

# In CI/CD (GitHub Actions)
# - uses: golang/govulncheck-action@v1
#   with:
#     go-version: '1.26'
#     go-package: ./...
```

### Vulnerability Response

```bash
# Check if a vulnerability affects you
govulncheck ./...

# Update vulnerable dependency
go get example.com/vulnerable@latest
# Or specific fixed version
go get example.com/vulnerable@v1.2.1

# Verify fix
govulncheck ./...
go test ./...
```

## Docker

```dockerfile
# Multi-stage build
FROM golang:1.26 AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /app/myapp

FROM scratch
COPY --from=builder /app/myapp /myapp
ENTRYPOINT ["/myapp"]

# Alpine
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/myapp /myapp
ENTRYPOINT ["/myapp"]
```
