# Effective Go — Go 1.26

## Introduction

Effective Go gives tips for writing clear, idiomatic Go code. It augments the tour and the language specification.

## Formatting

```bash
# gofmt — automatic formatting
gofmt -w yourfile.go

# go fmt — formats all files in a package
go fmt ./...
```

Key formatting rules (enforced by gofmt):
- Tabs for indentation
- No spaces around operators in expressions (but spaces around binary operators)
- One space after keywords
- Short lines preferred
- Grouped imports sorted alphabetically

## Commentary

```go
// Doc comment — starts with the name being documented
// Package foo implements bar.
package foo

// Frobulate transforms the input using the frob algorithm.
func Frobulate(input string) string {
    // Line comment — explain why, not what
    return input
}

/*
Block comments for longer explanations.
Used for package documentation and disabling code.
*/

// Doc comment for exported type
// Foo represents a frobnicator.
type Foo struct {
    Bar string // Bar is the bar field
}
```

## Names

### Package Names

```go
// Good: short, concise, evocative, lowercase, single word
package http    // not "httputil" or "httpclient"
package scan    // not "scanner"
package json    // not "jsonparser"

// Package name is part of the import path
// import "encoding/json" → json.Marshal()
```

### Getters/Setters

```go
type Owner struct {
    name string  // unexported field
}

// Getter — don't use "Get" prefix
func (o Owner) Name() string {  // not GetName()
    return o.name
}

// Setter — use "Set" prefix
func (o *Owner) SetName(name string) {
    o.name = name
}
```

### Interface Names

```go
// Single-method interfaces — use method name + "er" suffix
type Reader interface { Read(p []byte) (n int, err error) }
type Writer interface { Write(p []byte) (n int, err error) }
type Closer interface { Close() error }
type Stringer interface { String() string }
```

### CamelCase

```go
// Exported (public) — use PascalCase
func ExportedFunction() {}
type ExportedType struct {}
var ExportedVar int

// Unexported (private) — use camelCase
func unexportedFunction() {}
type unexportedType struct {}
var unexportedVar int

// Acronyms — keep consistent case
urlPath    // not URLPath (unexported)
parseURL   // not parseUrl
ServeHTTP  // not ServeHttp
```

## Semicolons

Go requires semicolons between statements, but the lexer inserts them automatically at end of lines. You rarely write them explicitly.

```go
// These are equivalent — semicolons inserted automatically
a := 1
b := 2

// Explicit semicolons (rare, but needed on one line)
a := 1; b := 2
```

## Control Structures

### If

```go
// Idiomatic — initialize variable in if statement
if err := file.Chmod(0664); err != nil {
    log.Print(err)
    return err
}

// Avoid else when possible
// Good:
if good {
    return
}
// handle bad case here

// Instead of:
if good {
    // ...
} else {
    // ...
}
```

### For

```go
// Idiomatic range — omit unused variables
for range time.Tick(time.Second) {
    // do something every second
}

// Range over slice — skip index
for _, value := range items {
    process(value)
}
```

### Switch

```go
// Idiomatic — use switch instead of if-else chains
switch {
case err != nil:
    return err
case result == "":
    return errors.New("empty result")
default:
    return nil
}
```

## Functions

### Multiple Return Values

```go
// Idiomatic — return value and error
func nextInt(b []byte, i int) (int, int) {
    // ...
    return x, nextI
}

a, b := nextInt(buf, 0)
_, b := nextInt(buf, 0)  // discard first value
```

### Named Return Values

```go
// Good for documentation, but avoid naked returns in long functions
func ReadFull(r Reader, buf []byte) (n int, err error) {
    for len(buf) > 0 && err == nil {
        var nr int
        nr, err = r.Read(buf)
        n += nr
        buf = buf[nr:]
    }
    return  // naked return — acceptable in short functions
}
```

### Defer

```go
// Defer for cleanup — pairs with resource acquisition
func Contents(filename string) (string, error) {
    f, err := os.Open(filename)
    if err != nil {
        return "", err
    }
    defer f.Close()  // Always close, even on error

    var result []byte
    buf := make([]byte, 100)
    for {
        n, err := f.Read(buf)
        result = append(result, buf[:n]...)
        if err != nil {
            if err == io.EOF {
                break
            }
            return "", err
        }
    }
    return string(result), nil
}
```

## Data

### Composite Literals

```go
// Struct literal — keyed
p := Point{X: 1, Y: 2}

// Struct literal — positional (avoid for many fields)
p := Point{1, 2}

// Slice literal
s := []int{1, 2, 3}

// Map literal
m := map[string]Point{
    "origin": {0, 0},  // type name inferred
    "unit":   {1, 1},
}
```

### Making Slices, Maps, Channels

```go
// make — for slices, maps, channels only
s := make([]int, 0, 100)     // pre-allocate capacity
m := make(map[string]int, 100)  // pre-allocate
ch := make(chan int, 10)     // buffered channel

// new — allocates zero value, returns pointer
p := new(Point)  // *Point{0, 0}
```

### Composite Allocation

```go
// Take address of composite literal
type SyncedBuffer struct {
    lock    sync.Mutex
    buffer  bytes.Buffer
}

p := &SyncedBuffer{}  // new variable of type *SyncedBuffer
```

### Constants

```go
// Untyped constants — high precision
const Pi = 3.14159265358979323846264338327950288419716939937510582097494459

// Typed constants
const Pi float64 = 3.14159265358979323846264338327950288419716939937510582097494459

// Enumeration with iota
type Color int
const (
    Red Color = iota
    Green
    Blue
)
```

## Initialization

```go
// init() — runs before main()
func init() {
    // Setup, validation, registration
}

// Multiple init functions — run in order declared
func init() { fmt.Println("first") }
func init() { fmt.Println("second") }

// Package-level initialization
var (
    home   = os.Getenv("HOME")
    cwd, _ = os.Getwd()
)

// init() for complex initialization
var computeComplex = func() int {
    // complex computation
    return 42
}()
```

## Methods

### Pointers vs Values

```go
// Rule of thumb:
// 1. If the method needs to mutate the receiver, use pointer receiver
// 2. If the struct is large, use pointer receiver (avoid copy)
// 3. If the struct has sync.Mutex or similar, use pointer receiver
// 4. Be consistent — all methods on a type should use the same receiver type

// Good — pointer receiver for mutation
func (s *Server) Start() error {
    s.started = true
    return nil
}

// Good — value receiver for small, immutable types
func (p Point) Distance() float64 {
    return math.Sqrt(p.X*p.X + p.Y*p.Y)
}
```

## Interfaces and Conversions

### Empty Interface

```go
// interface{} (or `any` in Go 1.18+) — holds any value
func describe(i any) {
    fmt.Printf("(%T, %v)\n", i, i)
}

// Type assertion
s, ok := i.(string)
```

### Type Assertions

```go
// Safe type assertion
if str, ok := i.(string); ok {
    fmt.Println(str)
}

// Type switch
switch v := i.(type) {
case string:
    fmt.Printf("string: %s\n", v)
case int:
    fmt.Printf("int: %d\n", v)
case error:
    fmt.Printf("error: %v\n", v)
default:
    fmt.Printf("unknown: %T\n", v)
}
```

### Generalization

```go
// Accept interface, return struct
// Good API design — be flexible in what you accept

func ReadFrom(r io.Reader) ([]byte, error) {
    // Accepts any io.Reader — *os.File, *bytes.Buffer, net.Conn, etc.
    return io.ReadAll(r)
}
```

## The Blank Import

```go
// Side-effect import — runs init() but doesn't use the package
import _ "image/png"  // register PNG decoder

import _ "github.com/lib/pq"  // register PostgreSQL driver
```

## Embedding

```go
// Composition through embedding — not inheritance
type Job struct {
    Command string
    *log.Logger  // embedded — Job gets Logger's methods
}

func (job *Job) Run() {
    job.Logf("running %s", job.Command)
    // job.Log() — promoted from embedded *log.Logger
}

job := &Job{Command: "ls", Logger: log.New(os.Stderr, "Job: ", log.LstdFlags)}
job.Run()
job.Printf("done")  // promoted from Logger
```

## Concurrency

### Share by Communicating

```go
// Don't communicate by sharing memory; share memory by communicating

// Good — use channels
func worker(jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- j * 2
    }
}

// Avoid — shared variable with mutex (use only when channels don't fit)
var (
    mu      sync.Mutex
    counter int
)
```

### Goroutines

```go
// Lightweight thread — ~2KB stack, grows as needed
go func() {
    time.Sleep(time.Second)
    fmt.Println("done")
}()

// With parameters
for i := 0; i < 10; i++ {
    go func(i int) {  // pass i as parameter — avoid closure capture bug
        fmt.Println(i)
    }(i)
}
```

### Channels

```go
// Unbuffered — synchronous (rendezvous)
ch := make(chan int)
go func() { ch <- 42 }()  // blocks until received
v := <-ch                  // blocks until sent

// Buffered — asynchronous up to capacity
ch := make(chan int, 10)
ch <- 1  // doesn't block (buffer has space)

// Direction — restrict channel type
func producer(out chan<- int) { out <- 42 }  // send-only
func consumer(in <-chan int) { v := <-in }   // receive-only

// Close — signals no more values
close(ch)
// Receiver checks: v, ok := <-ch  // ok=false when closed
// Range: for v := range ch  // exits when closed

// Select — multiplex channels
select {
case v := <-ch1:
    fmt.Println("ch1:", v)
case ch2 <- 42:
    fmt.Println("sent to ch2")
default:
    fmt.Println("no activity")
}

// Select with timeout
select {
case v := <-ch:
    fmt.Println(v)
case <-time.After(5 * time.Second):
    fmt.Println("timeout")
}
```

## Errors

### Error Handling Patterns

```go
// 1. Return error immediately
if err != nil {
    return err
}

// 2. Wrap with context
if err != nil {
    return fmt.Errorf("processing item %d: %w", i, err)
}

// 3. Check specific errors
if errors.Is(err, sql.ErrNoRows) {
    // handle not found
}

// 4. Extract error type
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    log.Printf("path error: %s", pathErr.Path)
}
```

## A Web Server

```go
// Simple HTTP server
package main

import (
    "flag"
    "log"
    "net/http"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
    flag.Parse()
    http.Handle("/", http.HandlerFunc(handler))
    err := http.ListenAndServe(*addr, nil)
    if err != nil {
        log.Fatal("ListenAndServe:", err)
    }
}

func handler(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    fmt.Fprintf(w, "Method: %s\n", req.Method)
    fmt.Fprintf(w, "URL: %s\n", req.URL)
}
```

## Formatting and Printing

```go
// fmt.Print family
fmt.Print("hello")           // no newline
fmt.Println("hello")         // with newline
fmt.Printf("%v\n", x)        // formatted

// Verbs
// %v   — default format
// %+v  — struct with field names
// %#v  — Go syntax representation
// %T   — type of value
// %d   — integer
// %s   — string
// %q   — quoted string
// %x   — hex
// %f   — float
// %t   — boolean
// %p   — pointer address

type Person struct{ Name string; Age int }
p := Person{Name: "Alice", Age: 30}
fmt.Printf("%v\n", p)    // {Alice 30}
fmt.Printf("%+v\n", p)   // {Name:Alice Age:30}
fmt.Printf("%#v\n", p)   // main.Person{Name:"Alice", Age:30}
fmt.Printf("%T\n", p)    // main.Person

// Sprintf — format to string
s := fmt.Sprintf("Name: %s, Age: %d", p.Name, p.Age)

// Fprintf — format to writer
fmt.Fprintf(w, "Hello, %s!", name)

// Errorf — format error
err := fmt.Errorf("invalid value: %d", x)
```

## Append

```go
// append is variadic — powerful and flexible
s := []int{1, 2, 3}
s = append(s, 4)           // [1 2 3 4]
s = append(s, 5, 6, 7)    // [1 2 3 4 5 6 7]
s = append(s, []int{8, 9}...)  // [1 2 3 4 5 6 7 8 9]

// Copy with append trick
dst = append(dst, src...)
```
