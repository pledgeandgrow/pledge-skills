---
name: go-docs
version: 1.26.0
description: Go 1.26 — language specification, standard library, concurrency, modules, tools, testing, crypto, networking, database access, and idiomatic patterns.
tags: [go, golang, language, concurrency, modules, stdlib, backend, systems, cli]
---

# Go 1.26 — Complete Skill Reference

## Quick Reference

| Topic | File |
|-------|------|
| Getting Started (installation, tutorials, tour, workspaces) | `getting-started.md` |
| Language Specification (syntax, types, functions, structs, interfaces, generics) | `language-spec.md` |
| Effective Go (idioms, patterns, conventions, naming, formatting) | `effective-go.md` |
| Concurrency (goroutines, channels, select, sync, atomic, context, memory model) | `concurrency.md` |
| Stdlib Core (fmt, strings, bytes, bufio, strconv, unicode, errors, log/slog, cmp, iter, context) | `stdlib-core.md` |
| Stdlib IO (io, io/fs, os, path/filepath, embed, archive/tar, archive/zip) | `stdlib-io.md` |
| Stdlib Net (net, net/http, net/url, net/mail, net/rpc, net/smtp, net/netip) | `stdlib-net.md` |
| Stdlib Crypto (aes, ecdsa, ed25519, rsa, sha*, tls, x509, hpke, mlkem, fips140) | `stdlib-crypto.md` |
| Stdlib Encoding (json v1+v2, xml, base32/64, binary, csv, gob, hex, pem, asn1) | `stdlib-encoding.md` |
| Stdlib Data (container/*, sort, slices, maps, math, math/big, regexp, hash/*, unique, weak) | `stdlib-data.md` |
| Stdlib Sys (os/exec, os/signal, runtime/*, debug/*, plugin, syscall, time, flag, expvar) | `stdlib-sys.md` |
| Stdlib Testing (testing, fstest, iotest, quick, synctest, fuzzing, coverage, benchmarks) | `stdlib-testing.md` |
| Stdlib Template (text/template, html/template, text/scanner, tabwriter, html, mime, image/*) | `stdlib-template.md` |
| Stdlib Meta (go/ast, go/build, go/parser, go/types, go/format, go/doc, reflect) | `stdlib-meta.md` |
| Modules (go.mod, versioning, publishing, workspaces, dependencies, layout) | `modules.md` |
| Database (database/sql, driver, transactions, prepared statements, connection pooling) | `database.md` |
| Tools (go command, gofmt, pprof, trace, diagnostics, PGO, GC guide, editors) | `tools.md` |
| What's New in Go 1.26 (release notes, changes from 1.25) | `whats-new.md` |
| Cgo (C interoperability, bindings, pointer rules, performance) | `cgo.md` |
| FAQ (design decisions, language features, common questions) | `faq.md` |

---

## Core Concepts

- **Simplicity & Readability**: Go emphasizes clear, readable code with minimal syntax complexity
- **Static Typing**: Strongly typed with type inference (`:=`), generics since 1.18, self-referential type constraints in 1.26
- **Concurrency**: First-class goroutines and channels — CSP (Communicating Sequential Processes) model
- **Standard Library**: Comprehensive — networking, crypto, encoding, testing, and more built-in
- **Modules**: Built-in dependency management with semantic versioning
- **Single Binary**: Compiles to a single static binary — no runtime dependencies
- **Cross-Platform**: Compiles to many OS/arch combinations from any platform
- **Fast Compilation**: Designed for fast build times — imports are explicit
- **Garbage Collected**: Concurrent GC with low latency — Green Tea GC in 1.26
- **Go 1 Compatibility Promise**: Code that works in Go 1.x will continue to work

## Target Version

- **Go 1.26** (released 2026-02-10)
- **Supported**: Go 1.25 and Go 1.26 (two-release support policy)

## Common Patterns

```go
// Hello World
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

```go
// HTTP server
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
    })
    http.ListenAndServe(":8080", nil)
}
```

```go
// Goroutines and channels
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    for j := 1; j <= 10; j++ {
        jobs <- j
    }
    close(jobs)

    for r := 1; r <= 10; r++ {
        fmt.Println(<-results)
    }
}
```
