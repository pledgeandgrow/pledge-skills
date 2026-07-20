# What's New in Go 1.26

Released: 2026-02-10

## Language Changes

### new() with Expression

The built-in `new()` function now accepts an expression specifying the initial value:

```go
// Before Go 1.26 — new(T) allocates zero-valued T, returns *T
p := new(int)  // *int, value 0

// Go 1.26 — new(expr) allocates and initializes
type Person struct {
    Name string
    Age  *int `json:"age"`
}

func personJSON(name string, born time.Time) ([]byte, error) {
    return json.Marshal(Person{
        Name: name,
        Age:  new(yearsSince(born)),  // new with expression
    })
}

func yearsSince(t time.Time) int {
    return int(time.Since(t).Hours() / (365.25 * 24))
}
```

This is particularly useful with serialization packages (`encoding/json`, protocol buffers) that use pointers for optional fields.

### Self-Referential Type Constraints

Generic types can now refer to themselves in their type parameter constraint list:

```go
// Go 1.26 — self-reference allowed
type Adder[A Adder[A]] interface {
    Add(A) A
}

func algo[A Adder[A]](x, y A) A {
    return x.Add(y)
}

// Previously, the self-reference to Adder on the first line was not allowed.
// This also simplifies the spec rules for type parameters.
```

## Runtime

### Green Tea Garbage Collector

The Green Tea GC (experimental in Go 1.25) is now **enabled by default** in Go 1.26.

- 10–40% reduction in GC overhead for real-world programs
- Better locality and CPU scalability for marking and scanning small objects
- Additional ~10% improvement on newer amd64 CPUs (Intel Ice Lake, AMD Zen 4+) via vector instructions

```bash
# Disable Green Tea GC (opt-out, expected to be removed in Go 1.27)
GOEXPERIMENT=nogreenteagc go build
```

### Faster cgo Calls

Baseline runtime overhead of cgo calls reduced by ~30%.

### Heap Base Address Randomization

On 64-bit platforms, the runtime now randomizes the heap base address at startup — a security enhancement making it harder for attackers to exploit vulnerabilities when using cgo.

```bash
# Disable (opt-out, expected to be removed in a future release)
GOEXPERIMENT=norandomizedheapbase64 go build
```

## Standard Library

### New: crypto/hpke

Hybrid Public Key Encryption (RFC 9180), including post-quantum hybrid KEMs:

```go
import "crypto/hpke"

// Sender
sender, err := hpke.NewSender(kem, kdf, aead, recipientPubKey, info)
ct, err := sender.Seal(aad, plaintext)

// Receiver
receiver, err := hpke.NewReceiver(kem, kdf, aead, recipientPrivKey, info)
plaintext, err := receiver.Open(aad, ct)
```

### New: simd/archsimd (Experimental)

Architecture-specific SIMD operations, enabled with `GOEXPERIMENT=simd`:

```go
import "simd/archsimd"

// Available on amd64: 128-bit, 256-bit, 512-bit vector types
var v1 archsimd.Int8x16
var v2 archsimd.Float64x8

result := archsimd.Int8x16.Add(v1, v2)
```

- API is not yet stable
- Architecture-specific (non-portable)
- High-level portable SIMD package planned for future

### New: runtime/secret (Experimental)

Securely erase temporaries used in cryptographic operations — ensures forward secrecy:

```bash
# Enable
GOEXPERIMENT=runtimesecret go build
```

- Supports amd64 and arm64 on Linux
- Erases registers, stack, and new heap allocations used with secret data

### Minor Library Changes

#### bytes

```go
// New: Buffer.Peek — returns next n bytes without advancing
data := buf.Peek(5)
```

#### crypto

```go
// New: Encapsulator and Decapsulator interfaces
// Allow abstract KEM encapsulation/decapsulation keys
```

#### crypto/dsa, crypto/ecdh, crypto/ecdsa, crypto/ed25519

```go
// Random parameter is now IGNORED — always uses secure source
// For deterministic testing: testing/cryptotest.SetGlobalRandom
// GODEBUG setting: cryptocustomrand=1 restores old behavior

// crypto/ecdh: New KeyExchanger interface
// crypto/ecdsa: big.Int fields deprecated
```

#### crypto/fips140

```go
// FIPS 140-3 Go Cryptographic Module v1.26.0
// New: WithoutEnforcement and Enforced functions
// New: Version function
// Select with GOFIPS140
```

#### crypto/mlkem

```go
// DecapsulationKey768.Encapsulator and DecapsulationKey1024.Encapsulator
// implement the new crypto.Decapsulator interface
```

#### encoding/json/v2 (Experimental)

New experimental JSON v2 package with improved API:

```go
import "encoding/json/v2"
import "encoding/json/jsontext"

// Improved Marshal/Unmarshal with options
data, err := json.Marshal(v)
data, err := json.MarshalWith(v, json.JoinOptions(
    json.Deterministic(true),
    json.OmitZero(true),
))

// Low-level: jsontext for token-level control
enc := jsontext.NewEncoder(w)
enc.WriteToken(jsontext.String("hello"))
```

#### math/rand/v2

Already available since Go 1.22 — improved API with no global seed needed:

```go
import "math/rand/v2"
n := rand.IntN(100)  // 0..99
```

#### testing/cryptotest

```go
import "testing/cryptotest"

// Set global random source for deterministic crypto testing
cryptotest.SetGlobalRandom(rand.Reader)
```

## Tools

### go command

- Module tool dependencies (`tool` directive in go.mod, Go 1.24+)
- `go tool` command for running tool dependencies
- Workspaces support continues to improve

### Profile-Guided Optimization (PGO)

- Stable since Go 1.21
- Typical 2-7% performance improvement
- Use `go build -pgo=profile.pprof`

### Coverage

- Binary coverage support (Go 1.20+)
- `go build -cover` for instrumenting binaries
- `go tool covdata` for analyzing coverage data

## Ports

### New/Improved

- amd64 platforms benefit from vector instructions in GC
- arm64 continued improvements
- WebAssembly (wasm) improvements

### Removed/Deprecated

- Check release notes for any platform deprecations

## Compatibility

Go 1.26 maintains the Go 1 compatibility promise — almost all Go programs continue to compile and run as before.

### GODEBUG Settings

```bash
# New GODEBUG settings in Go 1.26:
# cryptocustomrand=1 — restore old crypto random behavior
# nogreenteagc — disable Green Tea GC (via GOEXPERIMENT)
# norandomizedheapbase64 — disable heap randomization (via GOEXPERIMENT)
```

## Migration from Go 1.25

```bash
# Upgrade
go install golang.org/dl/go1.26@latest
go1.26 download

# Or download from https://go.dev/dl/

# Update go.mod
go mod edit -go=1.26

# Test compatibility
go test ./...
go vet ./...

# Try new features
# - new() with expression
# - Self-referential type constraints
# - crypto/hpke
# - Buffer.Peek
```

## Release Schedule

| Version | Release Date | Support Status |
|---------|-------------|----------------|
| Go 1.26 | 2026-02-10 | **Current** |
| Go 1.25 | 2025-08-xx | Supported |
| Go 1.24 | 2025-02-xx | EOL |
| Go 1.27 | 2026-08-xx | Upcoming |

Go releases every 6 months (February and August). Two releases are supported at any time.
