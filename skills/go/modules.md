# Modules & Project Layout — Go 1.26

## Go Modules

### go.mod

```
module example.com/myproject

go 1.26.0

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/lib/pq v1.10.9
    golang.org/x/sync v0.6.0
)

require (
    github.com/json-iterator/go v1.1.12 // indirect
    golang.org/x/net v0.20.0 // indirect
)

replace example.com/local => ../local

exclude example.com/broken v1.0.0

retract [v1.0.0, v1.0.5]

tool github.com/example/tool
```

### Module Commands

```bash
# Initialize module
go mod init example.com/myproject

# Add missing dependencies
go mod tidy

# Download dependencies
go mod download

# Verify dependencies
go mod verify

# Copy dependencies to vendor
go mod vendor

# Edit go.mod
go mod edit -require=github.com/pkg/errors@v0.9.1
go mod edit -replace=example.com/local=../local

# Graph dependency tree
go mod graph

# Why is a dependency needed?
go mod why github.com/pkg/errors

# List modules
go list -m all
go list -m -mod=mod -json all
```

### Versioning

```bash
# Semantic versioning: vMAJOR.MINOR.PATCH
# v1.0.0, v1.1.0, v1.1.1, v2.0.0

# v2+ modules — major version in path
// module example.com/myproject/v2
// import "example.com/myproject/v2"

# Tag a release
git tag v1.0.0
git push origin v1.0.0

# Pre-release
git tag v1.0.0-beta.1

# Pseudo-versions (for untagged commits)
// v0.0.0-20240115120000-abcdef123456
// Format: v0.0.0-YYYYMMDDHHMMSS-commitprefix

# Get specific version
go get example.com/pkg@v1.2.3
go get example.com/pkg@latest
go get example.com/pkg@v1.2.0  # minimum version

# Upgrade
go get -u example.com/pkg       # latest minor/patch
go get -u=patch example.com/pkg # latest patch only
go get -u ./...                  # upgrade all

# Downgrade
go get example.com/pkg@v1.1.0

# Remove unused
go mod tidy
```

### go.sum

```
github.com/gin-gonic/gin v1.9.1 h1:hash...
github.com/gin-gonic/gin v1.9.1/go.mod h1:hash...
```

- Contains cryptographic hashes of module content
- Used for verification (GOSUMDB)
- Should be committed to version control

### GOPRIVATE / GONOSUMCHECK

```bash
# Private modules — skip proxy and checksum database
go env -w GOPRIVATE=*.corp.example.com,github.com/myorg/private

# Or in go env
# GOPRIVATE=*.corp.example.com
# GONOSUMDB=*.corp.example.com
# GONOSUMCHECK=*.corp.example.com

# GONOSUMCHECK is deprecated — use GOPRIVATE
```

### GOPROXY

```bash
# Default
go env -w GOPROXY=https://proxy.golang.org,direct

# Private proxy
go env -w GOPROXY=https://goproxy.corp.example.com

# Direct only (no proxy)
go env -w GOPROXY=off

# Athens proxy
go env -w GOPROXY=https://athens.corp.example.com
```

## Workspaces

```bash
# Initialize workspace
go work init ./module1 ./module2

# Add module to workspace
go work use ./module3

# Remove module
go work drop ./module3

# Sync workspace dependencies
go work sync

# Edit go.work
go work edit -use ./module4
```

### go.work

```
go 1.26.0

use (
    ./module1
    ./module2
    ./module3
)

replace example.com/local => ../local
```

- go.work should NOT be committed for libraries
- Useful for local development across multiple modules
- Workspace mode is active when go.work is present in parent directory

## Project Layout

### Standard Layout

```
myproject/
├── go.mod
├── go.sum
├── main.go                    # package main
├── cmd/                       # multiple binaries
│   ├── myapp/
│   │   └── main.go
│   └── mytool/
│       └── main.go
├── internal/                  # private packages (not importable externally)
│   ├── config/
│   │   └── config.go
│   ├── handler/
│   │   └── handler.go
│   └── service/
│       └── service.go
├── pkg/                       # public packages (importable)
│   ├── client/
│   │   └── client.go
│   └── utils/
│       └── utils.go
├── api/                       # API definitions
│   ├── openapi.yaml
│   └── proto/
├── configs/                   # configuration files
│   └── config.yaml
├── scripts/                   # build/install scripts
├── test/                      # integration tests
│   └── integration_test.go
├── web/                       # static assets
│   ├── static/
│   └── templates/
├── .github/
│   └── workflows/
│       └── ci.yml
├── Makefile
├── Dockerfile
└── README.md
```

### Internal Packages

```go
// internal/ packages can only be imported from within the parent directory tree
// example.com/myproject/internal/config — only importable from myproject/*
// example.com/myproject/internal/handler — only importable from myproject/*
// NOT importable from example.com/other
```

### Single Package (simple project)

```
myproject/
├── go.mod
├── main.go
├── handlers.go
├── models.go
├── handlers_test.go
└── models_test.go
```

### Library Layout

```
mylib/
├── go.mod
├── doc.go              // package documentation
├── mylib.go            // main implementation
├── mylib_test.go       // tests
├── example/
│   └── example_test.go // examples
└── README.md
```

## Publishing

```bash
# 1. Initialize module with public path
go mod init github.com/myorg/mylib

# 2. Write code and tests
# 3. Tag release
git tag v1.0.0
git push origin v1.0.0

# 4. Verify module is accessible
go list -m github.com/myorg/mylib@latest

# 5. Users can import
go get github.com/myorg/mylib@v1.0.0
```

### Major Versions

```bash
# v2 — change module path
# go.mod: module github.com/myorg/mylib/v2
# import: import "github.com/myorg/mylib/v2"

git tag v2.0.0
git push origin v2.0.0

# v3, v4, etc. — same pattern
```

### Retracting

```
// go.mod
retract v1.2.3  // retracted due to security issue
retract [v1.1.0, v1.1.9]  // retracted range
```

```bash
# Users will not see retracted versions with @latest
# But can still explicitly request them
go get example.com/pkg@v1.2.3  # still works
```

## Tool Dependencies

```bash
# Add tool dependency (Go 1.24+)
go tool github.com/example/tool@latest

# Or in go.mod
# tool github.com/example/tool

# Run tool
go tool mytool arg1 arg2

# Manage tools
go get -tool github.com/example/tool@latest
go get -tool github.com/example/tool@none  # remove
```

## dependency management

### Minimum Version Selection (MVS)

Go uses MVS — the minimum version that satisfies all requirements. Not the latest, not the lowest, but the minimum required.

```bash
# If A requires C v1.1.0 and B requires C v1.2.0
# Go selects C v1.2.0 (the minimum that satisfies both)
```

### Overrides

```bash
# Replace — use different version or local path
replace example.com/dep => github.com/myfork/dep v1.2.0
replace example.com/dep => ../local-dep

# Exclude — prevent specific version
exclude example.com/dep v1.3.0
```

### Vendoring

```bash
# Create vendor directory
go mod vendor

# Build with vendor
go build -mod=vendor

# Default: auto-detect vendor directory
go env -w GOFLAGS=-mod=vendor
```

## Build Constraints

```go
//go:build linux && amd64
// +build linux,amd64

package main

// Old syntax (pre-1.17):
// // +build linux,amd64

// New syntax (1.17+):
// //go:build linux && amd64

// Multiple constraints
//go:build (linux || darwin) && !js

// File-specific constraints
//go:build ignore
//go:build go1.26  // requires Go 1.26+
```

## Embedding Directives

```go
//go:embed static/*
var staticFS embed.FS

//go:embed templates/index.html
var indexHTML string

//go:embed images/*.png
var images map[string][]byte  // Go 1.22+ pattern matching
```

## Environment

```bash
# Go environment
go env GOROOT        # Go installation
go env GOPATH        # workspace (default: ~/go)
go env GOOS          # target OS
go env GOARCH        # target arch
go env GOPROXY       # module proxy
go env GOSUMDB       # checksum database
go env GOPRIVATE     # private modules
go env GOFLAGS       # default flags
go env CGO_ENABLED   # cgo support

# Set environment
go env -w GOPRIVATE=*.corp.example.com

# List all
go env
```
