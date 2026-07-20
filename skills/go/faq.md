# Go FAQ — Frequently Asked Questions — Go 1.26

## History and Design

### What is the purpose of the project?

Go is an attempt to combine the ease of programming of an interpreted, dynamically typed language with the efficiency and safety of a statically typed, compiled language. It aims to be a modern language that supports networking, multicore, and concurrent programming.

### What is the status of the project?

Go is production-ready. Major companies use Go in production at scale. The Go project continues to release new versions every 6 months (February and August).

### What's the origin of the name?

"Go" — because it's short, easy to type, and action-oriented. The mascot is a gopher.

### Why create a new language?

Go was born out of frustration with existing languages and tools for the work environment at Google. The need was for:
- Fast compilation
- Ease of programming
- Efficient execution
- Good support for concurrency

### What are Go's ancestors?

Go draws inspiration from many languages:
- **Pascal/Modula/Oberon** — package system, syntax
- **CSP** (Communicating Sequential Processes) — concurrency model
- **Newsqueak/Limbo** — channels
- **C** — expression syntax, control flow
- **Smalltalk** — interfaces
- **Python** — slices
- **Java** — garbage collection

### What are the guiding principles in the design?

- Simplicity over complexity
- Orthogonality — features don't overlap
- Readability — code is read more than written
- One way to do things
- Explicit over implicit

## Language Features

### Does Go have features X?

Go intentionally omits many features found in other languages:
- **No classes** — uses structs and methods
- **No inheritance** — uses composition and embedding
- **No generics** until Go 1.18 — now has generics
- **No exceptions** — uses error values
- **No assertions** — uses explicit error handling
- **No implicit conversions** — all conversions are explicit
- **No operator overloading** — methods instead
- **No implicit constructors** — explicit initialization

### Why does Go not have feature X?

Every language feature adds complexity. Go's philosophy is to include only features that are proven, necessary, and don't conflict with existing features. Features are added only when the benefit clearly outweighs the cost.

### Why no generics for so long?

Generics were added in Go 1.18 (2022). The team took time to design a solution that fits Go's philosophy — simple, readable, and efficient. Go 1.26 adds self-referential type constraints.

### Why no exceptions?

Go uses explicit error values instead of exceptions because:
- Errors are part of the API contract — visible in function signatures
- No hidden control flow — easier to reason about
- Simpler runtime — no stack unwinding
- Error handling is explicit — can't accidentally ignore

### Why no assertions?

Assertions encourage skipping proper error handling. Go prefers explicit checks:

```go
// Instead of assert(x != nil)
if x == nil {
    log.Fatal("x must not be nil")
}
```

### Why does Go not have method overloading?

Method overloading complicates method resolution and can make code harder to read. Go prefers distinct method names.

### Why doesn't Go have covariant result types?

Covariant result types add complexity to the type system. Go's interfaces provide a cleaner alternative.

## Types and Values

### Why don't maps allow slices as keys?

Slices are not comparable (no equality operator) because their contents can change. Maps require comparable keys. Use a struct or array instead, or convert the slice to a string.

### Why are maps, slices, and functions references?

For efficiency. Passing a map or slice by value would be expensive. They are lightweight descriptors pointing to underlying data.

### Why doesn't Go have immutable data?

Go doesn't have const references like C++. The philosophy is that the programmer should control mutability through interface design and documentation, not language enforcement.

## Concurrency

### What operations are atomic?

Operations on single machine words are atomic with `sync/atomic`. Channel operations and mutex operations are atomic. All other operations require explicit synchronization.

### Why doesn't Go use the same concurrency model as Erlang?

Go uses CSP (Communicating Sequential Processes) with goroutines and channels. Erlang uses the Actor model. Both are valid approaches. Go's model is simpler for most use cases and integrates with shared memory when needed.

### Why goroutines instead of threads?

Goroutines are lightweight (~2KB stack initially, grows/shrinks dynamically). OS threads are heavyweight (~1-8MB stack). You can have millions of goroutines but only thousands of OS threads.

### Why are channels not faster?

Channels provide synchronization guarantees (happens-before relationship). For pure performance without synchronization, use shared memory with `sync/atomic`.

## Values and Pointers

### When are function parameters passed by value?

Always. Go passes all function parameters by value. However, maps, slices, channels, functions, and interfaces contain pointers internally, so modifications to their underlying data are visible to the caller.

### When should I use a pointer?

- When the function needs to modify the argument
- When the value is large (avoid copying)
- When the type is large (structs with many fields)
- When consistency with other methods of the type requires it

### Why doesn't Go have const references?

Const references add complexity to the type system. Go's philosophy is to keep the type system simple.

## Memory

### When does the garbage collector run?

The GC runs when the heap grows by a certain percentage (controlled by `GOGC`, default 100%). It's concurrent — runs alongside application code with minimal stop-the-world pauses. Go 1.26's Green Tea GC reduces overhead by 10-40%.

### How do I know if a variable is on the stack or heap?

You don't need to know. Go's escape analysis determines this automatically. If a value escapes the function (e.g., returned or stored in a heap-allocated structure), it goes on the heap. Otherwise, it stays on the stack.

### Why does Go have a garbage collector?

A garbage collector:
- Eliminates memory leaks
- Simplifies the language (no manual memory management)
- Enables safe concurrency (no use-after-free)
- Makes interfaces simpler (no ownership transfer)

## Performance

### Is Go fast?

Yes. Go compiles to native machine code and is generally comparable to C/C++/Java for most workloads. It's faster than interpreted languages (Python, Ruby, JavaScript).

### Why is my Go program slow?

Common causes:
- Unnecessary allocations (use `sync.Pool`, avoid `interface{}` conversions)
- Inefficient string concatenation (use `strings.Builder`)
- Excessive cgo calls (~100ns overhead each)
- Large struct copies (use pointers)
- Not using PGO (Profile-Guided Optimization — 2-7% improvement)

### Why does Go have a slow compiler?

Go's compiler is actually very fast compared to C/C++. The tradeoff is:
- Fast compilation → simpler compiler optimizations
- Go prioritizes compilation speed over peak performance
- PGO can recover some optimization

## Error Handling

### Why does Go not use exceptions?

See above — explicit error handling is a core Go design decision.

### Why is error handling verbose?

Go's error handling is explicit, which can be verbose. However:
- It makes error handling visible and auditable
- `errors.Is` and `errors.As` provide powerful error inspection
- Error wrapping (`fmt.Errorf("...: %w", err)`) preserves context
- `slog` provides structured error logging

### How should I handle errors?

```go
// Check immediately
result, err := doSomething()
if err != nil {
    return fmt.Errorf("doSomething: %w", err)
}

// Type-specific handling
var pathErr *fs.PathError
if errors.As(err, &pathErr) {
    // handle path error
}

// Sentinel errors
if errors.Is(err, sql.ErrNoRows) {
    // no row found
}
```

## Testing

### How do I test Go code?

Use the `testing` package. Test files end with `_test.go` and run with `go test`.

### How do I benchmark?

Use `testing.B` with `go test -bench=.`.

### How do I do property-based testing?

Use `testing/quick` or third-party libraries like `rapid`.

### How do I fuzz?

Use `testing.F` with `go test -fuzz=FuzzName`.

## Modules

### What is a Go module?

A module is a collection of Go packages with a `go.mod` file at the root. It defines the module path and dependencies.

### What is MVS?

Minimum Version Selection — Go's dependency resolution algorithm. It selects the minimum version that satisfies all requirements, not the latest.

### How do I publish a Go module?

1. Tag a git commit with a semantic version (e.g., `v1.0.0`)
2. Push the tag
3. Users can `go get` your module

### What about v2+?

Major version v2+ must be in the module path (e.g., `module example.com/mypkg/v2`).

## Tools

### What IDEs support Go?

- VS Code with the Go extension (uses gopls)
- GoLand (JetBrains)
- Neovim with nvim-lspconfig and gopls
- Vim with vim-go
- Emacs with lsp-mode and gopls

### What is gopls?

The Go language server. Provides code completion, go-to-definition, hover, references, formatting, and more. Used by most editors.

### How do I profile Go code?

Use `runtime/pprof` for CPU and memory profiling, `runtime/trace` for execution traces, and `go tool pprof` / `go tool trace` for analysis.

### What is PGO?

Profile-Guided Optimization — uses runtime profile data to improve binary performance. Typically 2-7% improvement. Use `go build -pgo=profile.pprof`.

## Go History

### Timeline of Major Releases

| Version | Date | Key Features |
|---------|------|-------------|
| Go 1.0 | 2012-03 | Initial release |
| Go 1.1 | 2013-05 | Method values, integer division by zero |
| Go 1.2 | 2013-12 | Three-index slice, testing.B.Run |
| Go 1.3 | 2014-06 | Stack management, sync.Pool |
| Go 1.4 | 2014-12 | `for range` over int, `go generate`, Android |
| Go 1.5 | 2015-08 | Concurrent GC, self-hosted compiler, `vendor/` |
| Go 1.6 | 2016-02 | HTTP/2, template blocks |
| Go 1.7 | 2016-08 | `context` in stdlib, subtests/benchmarks |
| Go 1.8 | 2017-02 | GC pauses <1ms, sort.Slice, plugin |
| Go 1.9 | 2017-08 | Type aliases, sync.Map, monotonic clock |
| Go 1.10 | 2018-02 | Build cache, default GOROOT |
| Go 1.11 | 2018-09 | **Modules** (experimental), WebAssembly |
| Go 1.12 | 2019-02 | TLS 1.3, finfo improvements |
| Go 1.13 | 2019-09 | Error wrapping (`%w`), Go modules default |
| Go 1.14 | 2020-02 | Module maturity, embedding overlap |
| Go 1.15 | 2020-08 | Smaller binaries, linker improvements |
| Go 1.16 | 2021-02 | `embed`, `io/fs`, modules default-on |
| Go 1.17 | 2021-08 | Module graph pruning, `//go:build` |
| Go 1.18 | 2022-03 | **Generics**, fuzzing, workspaces |
| Go 1.19 | 2022-08 | Memory limits, doc comments |
| Go 1.20 | 2023-02 | `errors.Join`, coverage profiling |
| Go 1.21 | 2023-08 | `slog`, `cmp`, `slices`, `maps`, PGO stable |
| Go 1.22 | 2024-02 | `range` over int, ServeMux routing, `math/rand/v2` |
| Go 1.23 | 2024-08 | `iter`, `unique`, `range` over func |
| Go 1.24 | 2025-02 | `weak`, tool dependencies, Swiss table maps |
| Go 1.25 | 2025-08 | Green Tea GC (experimental), `testing/synctest` |
| Go 1.26 | 2026-02 | Green Tea GC default, `new()` expr, `crypto/hpke`, self-referential generics |

### Go 1 Compatibility Promise

Go 1 guarantees that programs written for Go 1 will continue to compile and run correctly, without source changes, throughout the lifetime of Go 1. This is enforced by:
- `go fix` tool for automated migration
- GODEBUG settings for opt-out of behavioral changes
- Careful language spec evolution
- Deprecation warnings before removal

### The Gopher Mascot

The Go gopher was created by Renée French. It's an open-source mascot used extensively in Go branding, documentation, and community materials.
