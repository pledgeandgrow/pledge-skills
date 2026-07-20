# Cgo — C Interoperability — Go 1.26

## Overview

Cgo enables Go packages to call C code. It is **not** a foreign function interface — it is a tool that generates Go and C wrapper files for calling C functions from Go and vice versa.

```go
package main

/*
#include <stdio.h>
#include <stdlib.h>
*/
import "C"

import "unsafe"

func main() {
    // Call C function
    s := C.CString("Hello from Go!")
    defer C.free(unsafe.Pointer(s))
    C.puts(s)
}
```

## Basic Usage

### Calling C Functions

```go
package main

/*
#include <math.h>
*/
import "C"

func main() {
    result := float64(C.sqrt(16.0))
    fmt.Println(result)  // 4
}
```

### Calling C with Structs

```go
/*
#include <time.h>
*/
import "C"

func main() {
    var ts C.struct_tm
    C.time(nil)  // C call
    // Access C struct fields
    fmt.Println(int(ts.tm_year))
}
```

### String Conversion

```go
package main

/*
#include <string.h>
*/
import "C"

import (
    "fmt"
    "unsafe"
)

func main() {
    // Go string → C string (must free)
    cs := C.CString("hello")
    defer C.free(unsafe.Pointer(cs))

    // C string → Go string (copy, no free needed)
    goStr := C.GoString(cs)

    // C string with length
    goStrN := C.GoStringN(cs, 3)  // "hel"

    fmt.Println(goStr, goStrN)
}
```

### Numeric Types

```go
/*
#include <stdint.h>
*/
import "C"

func main() {
    var i C.int          // C int
    var l C.long         // C long
    var ll C.longlong    // C long long
    var ui C.uint        // C unsigned int
    var f C.float        // C float
    var d C.double       // C double
    var u8 C.uint8_t     // C uint8_t
    var i64 C.int64_t    // C int64_t

    // Convert to Go types
    goInt := int(i)
    goFloat := float64(f)
}
```

### Pointer Conversion

```go
import "unsafe"

// Go []byte → C pointer
data := []byte{1, 2, 3}
cPtr := (*C.char)(unsafe.Pointer(&data[0]))
C.process(cPtr, C.int(len(data)))

// C pointer → Go slice
cArr := C.get_array()
size := C.get_size()
goSlice := unsafe.Slice((*byte)(unsafe.Pointer(cArr)), int(size))
```

### Callbacks (C calling Go)

```go
/*
extern void go_callback(int);

static void call_callback(void) {
    go_callback(42);
}
*/
import "C"

//export go_callback
func go_callback(val C.int) {
    fmt.Printf("Callback called with: %d\n", val)
}

func main() {
    C.call_callback()
}
```

### Using C Libraries

```go
/*
#cgo LDFLAGS: -lcrypto
#include <openssl/sha.h>
*/
import "C"

func sha256(data []byte) []byte {
    var hash C.uchar[32]
    C.SHA256((*C.uchar)(unsafe.Pointer(&data[0])), C.size_t(len(data)), &hash[0])
    return unsafe.Slice((*byte)(unsafe.Pointer(&hash[0])), 32)
}
```

### Build Flags

```go
/*
#cgo CFLAGS: -DDEBUG -Wall
#cgo LDFLAGS: -lm -lpthread
#cgo pkg-config: openssl
#include <openssl/ssl.h>
*/
import "C"
```

### Conditional Compilation

```go
/*
#cgo windows CFLAGS: -DWIN32
#cgo linux LDFLAGS: -ldl
#cgo darwin LDFLAGS: -framework Foundation
*/
import "C"
```

## Enabling/Disabling Cgo

```bash
# Check if cgo is enabled
go env CGO_ENABLED

# Enable cgo
CGO_ENABLED=1 go build

# Disable cgo (pure Go, static binary)
CGO_ENABLED=0 go build

# Cross-compilation requires cgo disabled or a C cross-compiler
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build

# With cgo cross-compilation
CC=aarch64-linux-gnu-gcc CGO_ENABLED=1 GOOS=linux GOARCH=arm64 go build
```

## Performance Considerations

- **Cgo calls have overhead** — ~100ns per call (vs ~1ns for Go function calls)
- **Go goroutines blocked in C calls** — consume OS threads, not scheduled by Go runtime
- **No inlining** — cgo calls cannot be inlined
- **Memory management** — C memory is not garbage collected; must manually free
- **Escape analysis** — pointers passed to C escape to heap

### When to Use Cgo

- Wrapping existing C libraries (e.g., database drivers, crypto libraries)
- System-level programming not available in Go stdlib
- Interfacing with C-based hardware APIs

### When NOT to Use Cgo

- Pure Go alternatives exist
- Performance-critical hot paths
- Need static binaries
- Cross-compilation simplicity needed
- Want fast build times

## Patterns

### Wrapper Package

```go
package mywrapper

/*
#cgo pkg-config: libfoo
#include <foo.h>
*/
import "C"

type Foo struct {
    handle *C.foo_t
}

func NewFoo(name string) (*Foo, error) {
    cname := C.CString(name)
    defer C.free(unsafe.Pointer(cname))
    
    handle := C.foo_create(cname)
    if handle == nil {
        return nil, fmt.Errorf("foo_create failed")
    }
    return &Foo{handle: handle}, nil
}

func (f *Foo) Close() {
    C.foo_destroy(f.handle)
}

func (f *Foo) Process(data []byte) error {
    result := C.foo_process(f.handle, (*C.char)(unsafe.Pointer(&data[0])), C.size_t(len(data)))
    if result != 0 {
        return fmt.Errorf("foo_process failed: %d", result)
    }
    return nil
}
```

### Error Handling

```go
/*
#include <errno.h>
*/
import "C"

func callC() error {
    C.some_function()
    if C.errno != 0 {
        return fmt.Errorf("C error: %s", C.GoString(C.strerror(C.errno)))
    }
    return nil
}
```

## Limitations

- No C++ support directly (use C wrapper around C++)
- Cannot pass Go pointers to C if they contain Go pointers (cgo pointer rules)
- Go garbage collector does not know about C memory
- Cannot use Go maps, slices, or channels in C
- `//export` functions cannot be defined in same file as C definitions

## Cgo Pointer Rules

Go memory containing Go pointers cannot be passed to C:
```go
// INVALID — Go pointer to Go pointer
type Foo struct { Bar *Bar }
var f Foo
C.process(unsafe.Pointer(&f))  // violates cgo pointer rules

// Valid — Go pointer to non-pointer data
data := make([]byte, 100)
C.process(unsafe.Pointer(&data[0]), C.int(len(data)))
```

Use `runtime/cgo` handle for safe passing:
```go
import "runtime/cgo"

// Create handle
h := cgo.NewHandle(myGoObject)
defer h.Delete()

// Pass numeric handle to C
C.process(C.uintptr_t(h))

// In Go callback, retrieve
// val := h.Value()
```
