# Standard Library: System & Runtime — Go 1.26

## os/exec

```go
import "os/exec"

// Run command
cmd := exec.Command("ls", "-la", "/tmp")
output, err := cmd.Output()  // captures stdout

// Combined output (stdout + stderr)
output, err := cmd.CombinedOutput()

// Run with stdin
cmd := exec.Command("cat")
cmd.Stdin = strings.NewReader("hello")
output, _ := cmd.Output()

// Run with stdin, stdout, stderr
cmd := exec.Command("grep", "pattern")
cmd.Stdin = os.Stdin
cmd.Stdout = os.Stdout
cmd.Stderr = os.Stderr
err := cmd.Run()

// Start (non-blocking) + Wait
cmd := exec.Command("sleep", "5")
cmd.Start()
// do other work
err := cmd.Wait()

// Environment
cmd := exec.Command("env")
cmd.Env = append(os.Environ(), "MY_VAR=value")

// LookPath — find executable
path, err := exec.LookPath("go")

// Context with timeout
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
cmd := exec.CommandContext(ctx, "sleep", "100")
err := cmd.Run()  // killed after timeout

// Pipe commands
cmd1 := exec.Command("ls", "-la")
cmd2 := exec.Command("grep", "go")
cmd2.Stdin, _ = cmd1.StdoutPipe()
cmd2.Stdout = os.Stdout
cmd2.Start()
cmd1.Run()
cmd2.Wait()
```

## os/signal

```go
import (
    "os"
    "os/signal"
    "syscall"
)

// Notify — catch signals
ch := make(chan os.Signal, 1)
signal.Notify(ch, os.Interrupt, syscall.SIGTERM, syscall.SIGHUP)

go func() {
    for sig := range ch {
        log.Printf("Received signal: %v", sig)
        if sig == os.Interrupt {
            // graceful shutdown
        }
    }
}()

// NotifyContext (Go 1.16+)
ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
defer stop()

<-ctx.Done()
log.Println("Shutting down:", ctx.Err())

// Stop catching
signal.Stop(ch)

// Ignore a signal
signal.Ignore(syscall.SIGINT)

// Reset to default behavior
signal.Reset(syscall.SIGINT)
```

## runtime

```go
import "runtime"

// Goroutine info
runtime.NumGoroutine()  // current count
runtime.NumCPU()        // logical CPUs
runtime.NumCgoCall()    // cgo call count

// Memory
var m runtime.MemStats
runtime.ReadMemStats(&m)
m.Alloc      // bytes allocated and still in use
m.TotalAlloc // bytes allocated (cumulative)
m.Sys        // bytes from OS
m.NumGC      // number of GC cycles
m.GCCPUFraction

// GC control
runtime.GC()  // force garbage collection
runtime.SetMaxSpace(1 << 30)  // soft memory limit (1GB)

// GOMAXPROCS
n := runtime.GOMAXPROCS(4)  // set and return old value
n := runtime.GOMAXPROCS(0)  // just get current value

// Caller info
func CallerInfo() {
    pc, file, line, ok := runtime.Caller(1)
    if ok {
        fn := runtime.FuncForPC(pc)
        fmt.Printf("%s %s:%d\n", fn.Name(), file, line)
    }
}

// Stack trace
buf := make([]byte, 4096)
n := runtime.Stack(buf, false)
fmt.Println(string(buf[:n]))

// Build info
info, _ := debug.ReadBuildInfo()
fmt.Println(info.GoVersion)
for _, mod := range info.Deps {
    fmt.Printf("%s %s\n", mod.Path, mod.Version)
}

// GOOS / GOARCH
runtime.GOOS   // "linux", "darwin", "windows"
runtime.GOARCH // "amd64", "arm64"

// Version
runtime.Version()  // "go1.26"

// LockOSThread — bind goroutine to OS thread
runtime.LockOSThread()
defer runtime.UnlockOSThread()

// FuncForPC — get function name from PC
fn := runtime.FuncForPC(pc)
fn.Name()  // "main.myFunc"
fn.FileLine(pc)  // file, line

// SetFinalizer — run function before GC collects object
runtime.SetFinalizer(obj, func(o *MyType) {
    o.Close()
})
```

## runtime/debug

```go
import "runtime/debug"

// Build info
info, ok := debug.ReadBuildInfo()
info.GoVersion  // "go1.26"
info.Path       // main module path
info.Main.Path
info.Main.Version
for _, dep := range info.Deps {
    fmt.Printf("%s@%s\n", dep.Path, dep.Version)
}

// Stack trace
stack := debug.Stack()  // []byte
fmt.Println(string(stack))

// PrintStack
debug.PrintStack()

// SetGCPercent — control GC frequency
old := debug.SetGCPercent(200)  // GC when heap doubles
debug.SetGCPercent(old)

// SetMemoryLimit (Go 1.19+)
old := debug.SetMemoryLimit(1 << 30)  // 1GB soft limit

// FreeOSMemory — return memory to OS
debug.FreeOSMemory()
```

## runtime/metrics

```go
import "runtime/metrics"

// Read runtime metrics
sample := []metrics.Sample{
    {Name: "/sched/goroutines:goroutines"},
    {Name: "/gc/heap/allocs:bytes"},
    {Name: "/gc/heap/goal:bytes"},
    {Name: "/memory/classes/heap/objects:bytes"},
}
metrics.Read(sample)

for _, s := range sample {
    switch s.Value.Kind() {
    case metrics.KindUint64:
        fmt.Printf("%s: %d\n", s.Name, s.Value.Uint64())
    case metrics.KindFloat64:
        fmt.Printf("%s: %f\n", s.Name, s.Value.Float64())
    }
}

// All metrics
all := metrics.All()
for _, d := range all {
    fmt.Println(d.Name, d.Kind, d.Cumulative)
}
```

## runtime/pprof

```go
import "runtime/pprof"

// CPU profile
f, _ := os.Create("cpu.prof")
defer f.Close()
pprof.StartCPUProfile(f)
defer pprof.StopCPUProfile()

// Run your code here

// Memory profile
f, _ := os.Create("mem.prof")
defer f.Close()
pprof.WriteHeapProfile(f)

// Goroutine profile
f, _ := os.Create("goroutine.prof")
defer f.Close()
pprof.Lookup("goroutine").WriteTo(f, 0)

// Built-in HTTP pprof
import _ "net/http/pprof"
go http.ListenAndServe("localhost:6060", nil)
// Access: http://localhost:6060/debug/pprof/
```

## runtime/trace

```go
import "runtime/trace"

// Execution tracer
f, _ := os.Create("trace.out")
defer f.Close()
trace.Start(f)
defer trace.Stop()

// Run your code here

// Analyze: go tool trace trace.out
```

## runtime/coverage

```go
import "runtime/coverage"

// Runtime coverage (Go 1.20+)
// Build with: go build -cover
// Run binary, then call:
coverage.Snapshot()  // write coverage data

// Or set GOCOVERDIR env var
// GOCOVERDIR=./coverage ./myapp
// go tool covdata textfmt -i=./coverage -o coverage.txt
```

## runtime/secret (Go 1.26 — Experimental)

```go
// Enable with GOEXPERIMENT=runtimesecret
// Securely erase temporaries used in cryptographic operations
// Supports amd64 and arm64 on Linux

import "runtime/secret"

// Ensures forward secrecy by erasing registers, stack, heap allocations
// used when manipulating secret information
```

## plugin

```go
import "plugin"

// Load plugin (Linux/macOS only, not Windows)
p, err := plugin.Open("myplugin.so")

// Look up symbol
sym, err := p.Lookup("MyFunc")
funcPtr, ok := sym.(func() error)
if ok {
    err := funcPtr()
}

// Look up variable
sym, err := p.Lookup("MyVar")
varPtr, ok := sym.(*int)
if ok {
    fmt.Println(*varPtr)
}
```

## syscall

```go
import "syscall"

// Direct system calls (platform-specific)
syscall.Syscall(syscall.SYS_WRITE, 1, uintptr(unsafe.Pointer(&buf)), uintptr(len(buf)))

// Common
syscall.Exit(1)
syscall.Getpid()
syscall.Getppid()
syscall.Getuid()
syscall.Getgid()
syscall.Getwd()

// File
syscall.Open("file.txt", syscall.O_RDONLY, 0)
syscall.Close(fd)
syscall.Read(fd, buf)
syscall.Write(fd, buf)

// Network
syscall.Socket(syscall.AF_INET, syscall.SOCK_STREAM, 0)
syscall.Bind(fd, addr)
syscall.Listen(fd, backlog)
syscall.Accept(fd)

// Mmap
data, err := syscall.Mmap(fd, offset, length, syscall.PROT_READ, syscall.MAP_SHARED)
syscall.Munmap(data)

// Environment
syscall.Getenv("HOME")
syscall.Setenv("KEY", "value")

// Errno
if err == syscall.ENOENT { }  // file not found
if err == syscall.EACCES { }  // permission denied
```

## syscall/js (WebAssembly)

```go
import "syscall/js"

// Access JavaScript from Go (WASM only)
js.Global().Set("goFunc", js.FuncOf(func(this js.Value, args []js.Value) any {
    return js.ValueOf(args[0].Int() * 2)
}))

// Call JS function
result := js.Global().Call("parseInt", "42")

// Get/set properties
doc := js.Global().Get("document")
el := doc.Call("getElementById", "myDiv")
el.Set("innerHTML", "Hello from Go")

// Callbacks
cb := js.FuncOf(func(this js.Value, args []js.Value) any {
    fmt.Println("clicked")
    return nil
})
defer cb.Release()
el.Call("addEventListener", "click", cb)
```

## time

```go
import "time"

// Current time
now := time.Now()

// Parse
t, err := time.Parse("2006-01-02", "2024-01-15")
t, err := time.Parse(time.RFC3339, "2024-01-15T14:30:00Z")
t, err := time.ParseInLocation("2006-01-02", "2024-01-15", time.UTC)

// Format
s := t.Format("2006-01-02 15:04:05")
s := t.Format(time.RFC3339)
s := t.Format(time.RFC822)
s := t.Format("Jan 2, 2006 at 3:04pm (MST)")

// Reference time: Mon Jan 2 15:04:05 MST 2006 (or 01/02 03:04:05PM '06 -0700)

// Predefined formats
time.RFC3339     // "2006-01-02T15:04:05Z07:00"
time.RFC3339Nano // "2006-01-02T15:04:05.999999999Z07:00"
time.RFC822      // "02 Jan 06 15:04 MST"
time.RFC1123     // "Mon, 02 Jan 2006 15:04:05 MST"
time.Kitchen     // "3:04PM"
time.Stamp       // "Jan _2 15:04:05"

// Unix
t.Unix()        // seconds since epoch
t.UnixNano()    // nanoseconds since epoch
t := time.Unix(1705326600, 0)  // from Unix timestamp

// Duration
d := 5 * time.Second
d := 2 * time.Hour + 30 * time.Minute
d := 500 * time.Millisecond
d.String()  // "5s"
d.Seconds() // 5.0
d.Milliseconds() // 5000

// Add / Sub
future := now.Add(24 * time.Hour)
past := now.Add(-1 * time.Hour)
diff := future.Sub(past)  // 48h0m0s

// Since
elapsed := time.Since(start)

// Sleep
time.Sleep(5 * time.Second)

// Timer
timer := time.NewTimer(5 * time.Second)
<-timer.C  // blocks until timer fires
timer.Stop()  // cancel

// Ticker
ticker := time.NewTicker(1 * time.Second)
for t := range ticker.C {
    fmt.Println("Tick at", t)
}
ticker.Stop()

// After
select {
case <-time.After(5 * time.Second):
    fmt.Println("timeout")
}

// Tick (convenience — can't be stopped)
for range time.Tick(time.Second) {
    fmt.Println("tick")
}

// Time zones
loc, _ := time.LoadLocation("America/New_York")
t := time.Now().In(loc)
t.UTC()
t.Local()

// Fixed zone
loc := time.FixedZone("UTC-5", -5*3600)

// Comparison
t1.Before(t2)
t1.After(t2)
t1.Equal(t2)  // use Equal, not ==

// Truncate / Round
t.Truncate(time.Hour)  // round down to hour
t.Round(time.Minute)

// Components
t.Year()
t.Month()       // time.January
t.Day()
t.Hour()
t.Minute()
t.Second()
t.Nanosecond()
t.Weekday()     // time.Sunday
t.YearDay()     // day of year
t.IsZero()

// Date construction
t := time.Date(2024, time.January, 15, 14, 30, 0, 0, time.UTC)

// monotonic clock
// time.Now() includes monotonic clock reading for accurate duration measurement
```

## flag

```go
import "flag"

// Define flags
var (
    host     = flag.String("host", "localhost", "server host")
    port     = flag.Int("port", 8080, "server port")
    debug    = flag.Bool("debug", false, "enable debug mode")
    timeout  = flag.Duration("timeout", 30*time.Second, "request timeout")
)

flag.Parse()

fmt.Println(*host, *port, *debug, *timeout)

// Custom flag type
type LogLevel string
var level LogLevel
flag.Func("level", "log level", func(s string) error {
    switch s {
    case "debug", "info", "warn", "error":
        level = LogLevel(s)
        return nil
    default:
        return fmt.Errorf("invalid level: %s", s)
    }
})

// Var — custom Value
flag.Var(&customValue, "name", "usage")

// Usage
flag.Usage()  // print default usage
flag.PrintDefaults()

// Custom usage
flag.Usage = func() {
    fmt.Fprintf(os.Stderr, "Usage: %s [options]\n", os.Args[0])
    flag.PrintDefaults()
}

// Subcommand pattern
fooCmd := flag.NewFlagSet("foo", flag.ExitOnError)
fooFlag := fooCmd.String("name", "default", "name for foo")

if len(os.Args) < 2 {
    fmt.Println("expected 'foo' or 'bar' subcommand")
    os.Exit(1)
}

switch os.Args[1] {
case "foo":
    fooCmd.Parse(os.Args[2:])
    // use *fooFlag
case "bar":
    // ...
}
```

## expvar

```go
import "expvar"

// Expose variables via HTTP (/debug/vars)
expvar.Publish("requests", expvar.NewInt("requests"))
expvar.Publish("uptime", expvar.NewString("uptime"))

// Increment
counter := expvar.NewInt("requests")
counter.Add(1)

// Map
m := expvar.NewMap("metrics")
m.Add("errors", 1)
m.Set("status", expvar.NewString("ok"))

// Float
f := expvar.NewFloat("ratio")
f.Set(0.95)

// Register handler (automatic at /debug/vars)
// Just import the package — it registers itself
```

## debug

```go
import (
    "debug/buildinfo"
    "debug/dwarf"
    "debug/elf"
    "debug/macho"
    "debug/pe"
    "debug/gosym"
)

// Build info from binary
info, err := buildinfo.ReadFile("./myapp")
info.GoVersion
info.Main
for _, dep := range info.Deps {
    fmt.Printf("%s@%s\n", dep.Path, dep.Version)
}

// ELF (Linux)
f, err := elf.Open("binary")
f.Sections
f.Symbols

// Mach-O (macOS)
f, err := macho.Open("binary")

// PE (Windows)
f, err := pe.Open("binary")

// DWARF debug info
dwarfData, err := f.DWARF()
```

## debug/plan9obj

```go
import "debug/plan9obj"

// Plan 9 a.out object file format (used on Plan 9 and 9front)
f, err := plan9obj.Open("binary")
f.Sections
f.Symbols
f.Magic
f.PtrSize

// Plan 9 executable parsing
// Used for debugging on Plan 9 systems
```

## os/user

```go
import "os/user"

// Current user
u, err := user.Current()
fmt.Println(u.Username)  // "alice"
fmt.Println(u.Name)      // "Alice Smith"
fmt.Println(u.HomeDir)   // "/home/alice"
fmt.Println(u.Uid)       // "1000"
fmt.Println(u.Gid)       // "1000"

// Lookup by username
u, err := user.Lookup("bob")
u, err = user.LookupId("1001")

// Lookup group
g, err := user.LookupGroup("developers")
g, err = user.LookupGroupId("1000")

// Group IDs for current user
gids, _ := u.GroupIds()  // []string
```
