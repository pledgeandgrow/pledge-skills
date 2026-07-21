# Compiler, Tools, and REPL

Swift compiler architecture, REPL, debugger, and development tools.

## Swift Compiler Architecture

The Swift compiler translates Swift source code into efficient machine code through several stages:

### 1. Parsing

The parser is a recursive-descent parser (implemented in `lib/Parse`) with an integrated, hand-coded lexer. It generates an Abstract Syntax Tree (AST) without semantic or type information, emitting warnings or errors for grammatical problems.

### 2. Semantic Analysis

Semantic analysis (implemented in `lib/Sema`) transforms the parsed AST into a well-formed, fully-type-checked form. It includes:
- Type inference
- Type checking
- Emitting warnings/errors for semantic problems

### 3. Clang Importer

The Clang importer (implemented in `lib/ClangImporter`) imports Clang modules and maps C or Objective-C APIs into Swift APIs. The resulting imported ASTs can be referred to by semantic analysis.

### 4. SIL Generation

The Swift Intermediate Language (SIL) is a high-level, Swift-specific intermediate language. The SIL generation phase (implemented in `lib/SILGen`) lowers the type-checked AST into "raw" SIL.

### 5. SIL Guaranteed Transformations

Mandatory transformations (implemented in `lib/SILOptimizer/Mandatory`) perform dataflow diagnostics affecting correctness (e.g., use of uninitialized variables). Produces "canonical" SIL.

### 6. SIL Optimizations

High-level, Swift-specific optimizations including:
- Automatic Reference Counting (ARC) optimizations
- Devirtualization
- Generic specialization

### 7. LLVM IR Generation

IR generation (implemented in `lib/IRGen`) lowers SIL to LLVM IR, at which point LLVM continues optimization and generates machine code.

```
Source → Parse → AST → Sema → Type-checked AST → Clang Import
    → SILGen → Raw SIL → SIL Mandatory → Canonical SIL
    → SIL Optimizations → LLVM IR → Machine Code
```

## REPL and Debugger

### Swift REPL

The Swift REPL (Read-Eval-Print Loop) is integrated with LLDB, providing an interactive Swift environment:

```bash
# Start REPL
swift repl

# Or with explicit LLDB
swift --repl
```

```swift
// In the REPL
  1> let x = 42
x: Int = 42

  2> x * 2
$R0: Int = 84

  3> func factorial(_ n: Int) -> Int { n <= 1 ? 1 : n * factorial(n - 1) }

  4> factorial(5)
$R1: Int = 120

  5> :quit  // Exit
```

### LLDB Debugger

Swift uses LLDB as its debugger, with full Swift expression support:

```bash
# Debug a Swift program
swiftc -g main.swift -o myprogram
lldb myprogram

# Common LLDB commands
(lldb) breakpoint set --name main           # Break at function
(lldb) breakpoint set --file main.swift --line 20  # Break at line
(lldb) run                                 # Start execution
(lldb) step                                # Step into
(lldb) next                                # Step over
(lldb) continue                            # Continue execution
(lldb) print variable                      # Print variable
(lldb) po object                           # Print object description
(lldb) frame variable                      # Show all locals
(lldb) thread backtrace                    # Show call stack
(lldb) expression let x = 42              # Evaluate expression
(lldb) expression -- Swift code            # Evaluate Swift expression
```

### Xcode Playground Support

The REPL and debugger share the same infrastructure as Xcode Playgrounds, enabling:
- Interactive code execution
- Live view of results
- Rich visualizations
- Step-by-step debugging

## Command-line tools

### swiftc (Swift compiler)

```bash
# Compile a single file
swiftc main.swift -o myprogram

# Compile with optimization
swiftc -O main.swift -o myprogram          # Optimized
swiftc -Osize main.swift -o myprogram      # Optimize for size
swiftc -Onone main.swift -o myprogram      # No optimization (debug)

# Compile with debug info
swiftc -g main.swift -o myprogram

# Emit LLVM IR
swiftc -emit-ir main.swift -o output.ll

# Emit SIL
swiftc -emit-sil main.swift -o output.sil

# Emit assembly
swiftc -emit-assembly main.swift -o output.s

# Parse only (check syntax)
swiftc -parse main.swift

# Type check only
swiftc -typecheck main.swift

# Cross-compilation
swiftc -target arm64-apple-macosx14.0 main.swift -o myprogram

# Whole module optimization
swiftc -wmo -O main.swift -o myprogram
```

### swift build

```bash
swift build                    # Build all targets
swift build -c release         # Release configuration
swift build --target MyTarget  # Specific target
swift build --verbose          # Verbose output
```

### swift run

```bash
swift run                      # Run executable target
swift run MyTool arg1 arg2     # With arguments
swift run -c release MyTool    # Release build
```

### swift test

```bash
swift test                     # Run all tests
swift test --filter MyTests    # Filter by name
swift test --parallel           # Parallel execution
swift test --enable-code-coverage # With coverage
swift test --verbose            # Verbose output
```

## SourceKit-LSP

SourceKit-LSP provides Language Server Protocol support for Swift:

```bash
# Install SourceKit-LSP
# Included with Swift toolchain

# VS Code extension
# Install "Swift" extension from Marketplace
```

### VS Code configuration

```json
// .vscode/settings.json
{
    "swift.path": "/usr/local/swift",
    "swift.buildArguments": ["-c", "release"],
    "swift.sourcekit-lsp.serverPath": "/path/to/sourcekit-lsp"
}
```

### Features
- Code completion
- Jump to definition
- Hover documentation
- Symbol search
- Refactoring
- Diagnostics
- Debugging

## Profiling and performance

### Time compilation

```bash
# Show compilation time per file
swiftc -driver-time-compilations main.swift

# Show pass timings
swiftc -Xfrontend -debug-time-function-bodies main.swift
```

### Instruments (macOS)

```bash
# Profile with Instruments
instruments -t "Time Profiler" myprogram

# Leaks template
instruments -t "Leaks" myprogram
```

### Benchmarking

```swift
import Foundation

func benchmark(_ name: String, iterations: Int = 100_000, _ block: () -> Void) {
    let start = Date()
    for _ in 0..<iterations {
        block()
    }
    let elapsed = Date().timeIntervalSince(start)
    print("\(name): \(elapsed)s (\(elapsed / Double(iterations) * 1_000_000)µs per iteration)")
}

benchmark("Array append") {
    var array: [Int] = []
    for i in 0..<100 {
        array.append(i)
    }
}
```

## Continuous Integration

### GitHub Actions

```yaml
name: Swift CI
on: [push, pull_request]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: swift build -c release
      - name: Test
        run: swift test --parallel
      - name: Generate docs
        run: swift package generate-documentation --output-path ./docs
```

## Source compatibility

Swift maintains source compatibility across versions. The [Source Compatibility Suite](https://www.swift.org/documentation/source-compatibility/) tests Swift against a large set of open-source projects to ensure compatibility.

## Best practices

1. Use `swift build` for package builds, `swiftc` for standalone compilation
2. Use `-O` for production builds, `-Onone` for debugging
3. Use LLDB for debugging — it understands Swift types
4. Use SourceKit-LSP for editor integration
5. Use `-emit-sil` to inspect intermediate code for debugging
6. Profile with Instruments on macOS
7. Set up CI with GitHub Actions for multi-platform testing
8. Use `swift test --enable-code-coverage` for coverage reports
9. Use whole module optimization (`-wmo`) for release builds
10. Keep toolchain up to date for latest features and fixes
