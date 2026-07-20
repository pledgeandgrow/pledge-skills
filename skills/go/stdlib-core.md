# Standard Library: Core — Go 1.26

## fmt

Formatted I/O with verbs and format specifiers.

```go
import "fmt"

// Print family
fmt.Print("hello")           // no newline
fmt.Println("hello", "world") // spaces between args, newline
fmt.Printf("%d %s %f\n", 42, "x", 3.14)

// Sprint family — return string
s := fmt.Sprintln("hello")
s := fmt.Sprintf("%d-%d", 1, 2)
s := fmt.Sprint(42)

// Fprint family — write to io.Writer
fmt.Fprintf(w, "%s\n", "hello")
n, err := fmt.Fprintln(os.Stdout, "hello")

// Scan family — read input
var name string
var age int
fmt.Scan(&name, &age)
fmt.Sscan("Alice 30", &name, &age)
fmt.Sscanf("Alice 30", "%s %d", &name, &age)

// Verbs
// %v   default format
// %+v  struct with field names
// %#v  Go syntax
// %T   type
// %d   decimal integer
// %b   binary
// %o   octal
// %x   hex (lowercase), %X hex (uppercase)
// %f   float
// %e   scientific notation
// %g   %e for large exponents, %f otherwise
// %s   string
// %q   quoted string
// %c   character (rune)
// %p   pointer
// %t   boolean
// %%   literal percent

// Width and precision
fmt.Printf("%10d\n", 42)     // width 10, right-aligned
fmt.Printf("%-10d|\n", 42)   // width 10, left-aligned
fmt.Printf("%010d\n", 42)    // zero-padded
fmt.Printf("%.2f\n", 3.14159) // 2 decimal places
fmt.Printf("%10.2f\n", 3.14) // width 10, 2 decimal places

// Errorf with %w for wrapping
err := fmt.Errorf("processing %s: %w", file, err)
```

## strings

```go
import "strings"

// Comparison
strings.EqualFold("Go", "go")  // true — case-insensitive
strings.Compare("a", "b")      // -1 (a < b)

// Contains / search
strings.Contains("hello", "ell")    // true
strings.ContainsAny("hello", "ae")  // true (any char)
strings.ContainsRune("hello", 'e')  // true
strings.HasPrefix("hello", "he")    // true
strings.HasSuffix("hello", "lo")    // true
strings.Index("hello", "ll")        // 2
strings.IndexAny("hello", "ae")     // 1
strings.IndexByte("hello", 'e')     // 1
strings.IndexRune("hello", 'l')     // 2
strings.LastIndex("hello", "l")     // 3
strings.Count("hello", "l")         // 2

// Manipulation
strings.ToUpper("hello")            // "HELLO"
strings.ToLower("HELLO")            // "hello"
strings.ToTitle("hello world")      // "Hello World"
strings.Title("hello world")        // deprecated — use cases.Title
strings.TrimSpace("  hello  ")      // "hello"
strings.TrimPrefix("hello", "he")   // "llo"
strings.TrimSuffix("hello", "lo")   // "hel"
strings.Trim("hello", "hlo")        // "ell"
strings.TrimLeft("hello", "h")      // "ello"
strings.TrimRight("hello", "o")     // "hell"
strings.Replace("aabb", "a", "x", 1)  // "xabb"
strings.ReplaceAll("aabb", "a", "x")  // "xxbb"
strings.Repeat("ab", 3)             // "ababab"
strings.Split("a,b,c", ",")         // ["a", "b", "c"]
strings.SplitN("a,b,c", ",", 2)     // ["a", "b,c"]
strings.SplitAfter("a,b,c", ",")    // ["a,", "b,", "c"]
strings.Join([]string{"a", "b"}, "-") // "a-b"
strings.Fields("  hello  world  ")  // ["hello", "world"]
strings.Map(func(r rune) rune { return r + 1 }, "abc")  // "bcd"

// Builder — efficient string concatenation
var b strings.Builder
b.WriteString("hello")
b.WriteString(" ")
b.WriteString("world")
b.WriteString("!")
result := b.String()
b.Reset()

// Reader — read from string
r := strings.NewReader("hello world")
buf := make([]byte, 5)
r.Read(buf)  // buf = "hello"

// Cut (Go 1.18+)
before, after, found := strings.Cut("hello,world", ",")
// before="hello", after="world", found=true

// CutPrefix / CutSuffix (Go 1.20+)
s, found := strings.CutPrefix("hello", "he")  // "llo", true
s, found := strings.CutSuffix("hello", "lo")  // "hel", true

// Clone (Go 1.20+) — ensures unique allocation
s := strings.Clone(original)
```

## bytes

```go
import "bytes"

// Same functions as strings package but for []byte
bytes.Contains([]byte("hello"), []byte("ell"))  // true
bytes.HasPrefix([]byte("hello"), []byte("he"))  // true
bytes.Index([]byte("hello"), []byte("ll"))      // 2
bytes.ToUpper([]byte("hello"))                  // []byte("HELLO")
bytes.Split([]byte("a,b,c"), []byte(","))       // [["a"],["b"],["c"]]

// Buffer — growable byte buffer
var buf bytes.Buffer
buf.WriteString("hello")
buf.WriteByte(' ')
buf.WriteRune('w')
buf.Write([]byte("orld"))
buf.WriteString("!")
fmt.Println(buf.String())  // "hello world!"
buf.Reset()

// Buffer — new in Go 1.26: Peek
n := 5
data := buf.Peek(n)  // returns next n bytes without advancing

// Read from buffer
buf.WriteString("hello")
b := make([]byte, 3)
buf.Read(b)  // b = "hel"

// Reader
r := bytes.NewReader([]byte("hello"))
b := make([]byte, 3)
r.Read(b)

// Compare
bytes.Compare([]byte("a"), []byte("b"))  // -1
bytes.Equal([]byte("a"), []byte("a"))    // true

// Cut
before, after, found := bytes.Cut([]byte("a,b"), []byte(","))
```

## bufio

```go
import "bufio"

// Scanner — read tokens
scanner := bufio.NewScanner(os.Stdin)
for scanner.Scan() {
    line := scanner.Text()
    fmt.Println(line)
}
// Custom split function
scanner.Split(bufio.ScanWords)

// Reader — buffered reading
r := bufio.NewReader(os.Stdin)
line, err := r.ReadString('\n')  // read until newline
line, err := r.ReadString('\n')
byte, err := r.ReadByte()
bytes, err := r.ReadBytes('\n')
r.UnreadByte()

// Peek — read without advancing
data, err := r.Peek(10)  // peek next 10 bytes

// Writer — buffered writing
w := bufio.NewWriter(os.Stdout)
w.WriteString("hello")
w.WriteByte(' ')
w.Flush()  // must flush to write

// NewWriterSize / NewReaderSize — custom buffer size
r := bufio.NewReaderSize(file, 65536)
w := bufio.NewWriterSize(file, 65536)
```

## strconv

```go
import "strconv"

// Integer to string
s := strconv.Itoa(42)           // "42"
s := strconv.FormatInt(42, 10)  // "42"
s := strconv.FormatInt(255, 16) // "ff"
s := strconv.FormatUint(42, 10)

// String to integer
i, err := strconv.Atoi("42")
i, err := strconv.ParseInt("ff", 16, 64)  // 255
i, err := strconv.ParseInt("1010", 2, 64) // 10
u, err := strconv.ParseUint("42", 10, 64)

// Float
s := strconv.FormatFloat(3.14159, 'f', 2, 64)  // "3.14"
f, err := strconv.ParseFloat("3.14", 64)

// Bool
s := strconv.FormatBool(true)  // "true"
b, err := strconv.ParseBool("true")

// Quote — Go string literal
s := strconv.Quote("hello\tworld")  // "\"hello\\tworld\""
s := strconv.QuoteToASCII("héllo")  // "\"h\\u00e9llo\""
s := strconv.Unquote("\"hello\"")   // "hello"

// Append — append to byte slice
b := []byte("int: ")
b = strconv.AppendInt(b, 42, 10)  // "int: 42"
```

## unicode

```go
import (
    "unicode"
    "unicode/utf8"
    "unicode/utf16"
)

// unicode — character classification
unicode.IsLetter('a')      // true
unicode.IsDigit('1')       // true
unicode.IsSpace(' ')       // true
unicode.IsUpper('A')       // true
unicode.IsLower('a')       // true
unicode.IsPunct('!')       // true
unicode.IsPrint('a')       // true
unicode.ToUpper('a')       // 'A'
unicode.ToLower('A')       // 'a'
unicode.ToTitle('a')       // 'A'

// utf8 — UTF-8 encoding
b := []byte("héllo")
utf8.RuneCount(b)              // 5 (runes, not bytes)
utf8.RuneLen('é')              // 2 (bytes for this rune)
utf8.Valid(b)                  // true
r, size := utf8.DecodeRune(b)  // 'h', 1
r, size := utf8.DecodeLastRune(b)

// Encode rune to byte slice
buf := make([]byte, 4)
n := utf8.EncodeRune(buf, 'é')  // n=2, buf=[0xc3 0xa9]

// utf16 — UTF-16 encoding
r := []rune("hello")
u := utf16.Encode(r)        // []uint16
r2 := utf16.Decode(u)       // []rune

// Rune range over string
for i, r := range "héllo" {
    fmt.Printf("%d: %c (U+%04X)\n", i, r, r)
}
```

## errors

```go
import "errors"

// New — create error
err := errors.New("something went wrong")

// Is — check if error matches (including wrapped)
if errors.Is(err, os.ErrNotExist) { }

// As — extract specific error type
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println(pathErr.Path)
}

// Join — combine multiple errors (Go 1.20+)
err := errors.Join(err1, err2, err3)

// Unwrap — unwrap once
inner := errors.Unwrap(err)

// Wrapping pattern
type MyError struct {
    Inner error
    Msg   string
}
func (e *MyError) Error() string { return e.Msg + ": " + e.Inner.Error() }
func (e *MyError) Unwrap() error { return e.Inner }
```

## log

```go
import "log"

// Basic logging
log.Println("message")
log.Printf("value: %d", 42)
log.Fatal("fatal error")  // prints and calls os.Exit(1)
log.Panic("panic error")  // prints and panics

// Custom logger
logger := log.New(os.Stderr, "PREFIX: ", log.LstdFlags|log.Lshortfile)
logger.Println("hello")
logger.Printf("value: %d", 42)

// Flags
log.SetFlags(log.LstdFlags | log.Lshortfile | log.LUTC)
// Ldate         — date (2009/01/23)
// Ltime         — time (01:23:23)
// Lmicroseconds — microsecond precision
// Llongfile     — full file path
// Lshortfile    — short file name
// LUTC          — use UTC
// Lmsgprefix    — prefix before message instead of before timestamp

// Output — write to custom writer
log.SetOutput(os.Stdout)
log.SetOutput(io.Discard)  // disable logging

// Prefix
log.SetPrefix("APP: ")
```

## log/slog

Structured logging (Go 1.21+).

```go
import "log/slog"

// Default logger
slog.Info("hello", "user", "Alice", "age", 30)
// {"time":"2024-01-15T14:30:00Z","level":"INFO","msg":"hello","user":"Alice","age":30}

slog.Debug("debugging", "key", "value")
slog.Warn("warning")
slog.Error("error", "err", err)

// With attributes
logger := slog.With("component", "server", "version", "1.0")
logger.Info("started")

// Custom handler
logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelDebug,
    AddSource: true,
}))

// Text handler
logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

// Group attributes
slog.Info("request",
    slog.Group("user",
        slog.String("name", "Alice"),
        slog.Int("age", 30),
    ),
    slog.String("method", "GET"),
)

// Typed attributes
slog.String("key", "value")
slog.Int("count", 42)
slog.Float64("pi", 3.14)
slog.Bool("active", true)
slog.Duration("elapsed", time.Since(start))
slog.Time("timestamp", time.Now())
slog.Any("data", customValue)

// Log levels
slog.LevelDebug  // -4
slog.LevelInfo   // 0
slog.LevelWarn   // 4
slog.LevelError  // 8

// With group
logger = logger.WithGroup("request").With("id", "123")
logger.Info("processed")  // request.id=123, msg=processed

// Context-aware logging
ctx := context.Background()
slog.InfoContext(ctx, "message", "key", "value")
```

## cmp

Comparison utilities (Go 1.21+).

```go
import "cmp"

// Ordered constraint
func Max[T cmp.Ordered](a, b T) T {
    return max(a, b)  // built-in
}

// Compare
cmp.Compare(1, 2)   // -1
cmp.Compare(2, 2)   // 0
cmp.Compare(3, 2)   // 1

// Less
cmp.Less(1, 2)  // true

// cmp.Ordered types: ~int, ~uint, ~float, ~string
// (all numeric types and strings)
```

## iter

Iterator support (Go 1.23+).

```go
import "iter"

// Seq — single-value iterator
type Seq[V any] func(yield func(V) bool)

// Seq2 — two-value iterator (key, value)
type Seq2[K, V any] func(yield func(K, V) bool)

// Creating an iterator
func Count(n int) iter.Seq[int] {
    return func(yield func(int) bool) {
        for i := 0; i < n; i++ {
            if !yield(i) {
                return
            }
        }
    }
}

// Using with range
for v := range Count(5) {
    fmt.Println(v)  // 0, 1, 2, 3, 4
}

// Two-value iterator
func Enumerate[V any](slice []V) iter.Seq2[int, V] {
    return func(yield func(int, V) bool) {
        for i, v := range slice {
            if !yield(i, v) {
                return
            }
        }
    }
}

for i, v := range Enumerate(items) {
    fmt.Printf("%d: %v\n", i, v)
}

// Pull — convert to pull-based (next, stop)
next, stop := iter.Pull(Count(5))
defer stop()
for {
    v, ok := next()
    if !ok {
        break
    }
    fmt.Println(v)
}
```

## context

See `concurrency.md` for full context coverage.

## builtin

Predeclared identifiers available without import:

```go
// Types
any          // alias for interface{}
bool         // boolean
byte         // alias for uint8
comparable   // constraint for == and !=
complex64    // complex number
complex128
error        // error interface
float32      // floating point
float64
int          // signed integer
int8
int16
int32
int64
rune         // alias for int32 (Unicode code point)
string       // string
uint         // unsigned integer
uint8
uint16
uint32
uint64
uintptr

// Functions
append       // append to slice
cap          // capacity
clear        // clear map or slice (Go 1.21+)
close        // close channel
complex      // create complex number
copy         // copy slice
delete       // delete map key
imag         // imaginary part
len          // length
make         // create slice/map/channel
max          // maximum (Go 1.21+)
min          // minimum (Go 1.21+)
new          // allocate and return pointer
panic        // stop execution
print        // raw print (debugging)
println      // raw print with newline (debugging)
real         // real part
recover      // recover from panic

// Zero value
nil
```

## structs

```go
import "structs"

// HostLayout — for C interop, ensures predictable memory layout
type CPoint struct {
    _ [0]func()
    X int32
    Y int32
}
```
