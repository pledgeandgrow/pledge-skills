# Concurrency — Go 1.26

## Goroutines

```go
// Goroutine — lightweight thread managed by Go runtime (~2KB stack)
go func() {
    fmt.Println("running in goroutine")
}()

// With parameters (avoid closure capture in loops)
for i := 0; i < 5; i++ {
    go func(n int) {
        fmt.Printf("goroutine %d\n", n)
    }(i)
}

// Named function as goroutine
go processItem(item)
```

## Channels

### Unbuffered Channels

```go
// Synchronous — sender blocks until receiver is ready
ch := make(chan int)

go func() {
    ch <- 42  // blocks until someone receives
}()

v := <-ch  // blocks until someone sends
fmt.Println(v)  // 42
```

### Buffered Channels

```go
// Asynchronous up to capacity — sender blocks when full
ch := make(chan int, 3)

ch <- 1  // doesn't block
ch <- 2
ch <- 3
// ch <- 4  // would block — buffer full

v := <-ch  // 1
```

### Channel Direction

```go
// Send-only channel
func producer(out chan<- int) {
    for i := 0; i < 10; i++ {
        out <- i
    }
    close(out)
}

// Receive-only channel
func consumer(in <-chan int) {
    for v := range in {
        fmt.Println(v)
    }
}

ch := make(chan int)
go producer(ch)
consumer(ch)
```

### Closing Channels

```go
// Close signals no more values will be sent
ch := make(chan int)
go func() {
    for i := 0; i < 5; i++ {
        ch <- i
    }
    close(ch)
}()

// Receive until closed
for v := range ch {
    fmt.Println(v)  // 0, 1, 2, 3, 4
}

// Check if closed
v, ok := <-ch
fmt.Println(v, ok)  // 0 false

// Only sender should close — never close from receiver
// Closing a closed channel panics
// Sending on a closed channel panics
```

## Select

```go
// Multiplex multiple channel operations
select {
case v := <-ch1:
    fmt.Println("from ch1:", v)
case v := <-ch2:
    fmt.Println("from ch2:", v)
case ch3 <- 42:
    fmt.Println("sent to ch3")
default:
    fmt.Println("no activity")
}

// Select with timeout
select {
case v := <-ch:
    fmt.Println("received:", v)
case <-time.After(5 * time.Second):
    fmt.Println("timeout")
}

// Select with context cancellation
select {
case v := <-ch:
    fmt.Println("received:", v)
case <-ctx.Done():
    fmt.Println("cancelled:", ctx.Err())
}

// Non-blocking send
select {
case ch <- value:
    // sent
default:
    // channel full, drop or handle
}

// Select in loop (event loop pattern)
for {
    select {
    case v := <-events:
        handle(v)
    case <-done:
        return
    }
}
```

## sync Package

### WaitGroup

```go
var wg sync.WaitGroup

for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        fmt.Printf("worker %d\n", n)
    }(i)
}
wg.Wait()  // blocks until all Done() calls
```

### Mutex

```go
var (
    mu      sync.Mutex
    counter int
)

func increment() {
    mu.Lock()
    defer mu.Unlock()
    counter++
}

func getValue() int {
    mu.Lock()
    defer mu.Unlock()
    return counter
}
```

### RWMutex

```go
var (
    rwmu sync.RWMutex
    data map[string]string
)

func read(key string) string {
    rwmu.RLock()
    defer rwmu.RUnlock()
    return data[key]
}

func write(key, value string) {
    rwmu.Lock()
    defer rwmu.Unlock()
    data[key] = value
}
```

### Once

```go
var (
    once  sync.Once
    instance *Config
)

func GetConfig() *Config {
    once.Do(func() {
        instance = loadConfig()
    })
    return instance
}
```

### Cond

```go
var (
    mu    sync.Mutex
    cond  = sync.NewCond(&mu)
    ready bool
)

// Waiter
func waitForReady() {
    mu.Lock()
    for !ready {
        cond.Wait()  // releases mu, waits, reacquires mu
    }
    mu.Unlock()
}

// Signaler
func setReady() {
    mu.Lock()
    ready = true
    cond.Broadcast()  // wake all waiters
    // cond.Signal()   // wake one waiter
    mu.Unlock()
}
```

### Pool

```go
var bufPool = sync.Pool{
    New: func() any {
        return new(bytes.Buffer)
    },
}

func process(data []byte) {
    buf := bufPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufPool.Put(buf)
    }()
    buf.Write(data)
    // use buf...
}
```

### Map (concurrent map)

```go
var m sync.Map

// Store
m.Store("key", "value")

// Load
v, ok := m.Load("key")

// LoadOrStore
actual, loaded := m.LoadOrStore("key", "default")

// Delete
m.Delete("key")

// Range
m.Range(func(key, value any) bool {
    fmt.Printf("%v: %v\n", key, value)
    return true  // continue iteration
})
```

## sync/atomic

```go
import "sync/atomic"

// Atomic int64
var counter atomic.Int64
counter.Add(1)
counter.Store(42)
v := counter.Load()
counter.CompareAndSwap(1, 2)

// Atomic pointer
var p atomic.Pointer[Config]
p.Store(&Config{...})
cfg := p.Load()

// Atomic bool
var ready atomic.Bool
ready.Store(true)
if ready.Load() {
    // ...
}

// Generic atomic types (Go 1.19+)
var x atomic.Int32
var y atomic.Uint64
var flag atomic.Bool
var ptr atomic.Pointer[MyType]

// Low-level functions (pre-1.19 style)
var val int64
atomic.AddInt64(&val, 1)
atomic.StoreInt64(&val, 42)
v := atomic.LoadInt64(&val)
```

## context Package

```go
import "context"

// Background — root of context tree, never cancelled
ctx := context.Background()

// TODO — placeholder, also never cancelled
ctx := context.TODO()

// With cancellation
ctx, cancel := context.WithCancel(context.Background())
defer cancel()

go func() {
    <-ctx.Done()
    fmt.Println("cancelled:", ctx.Err())
}()

// Cancel after timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// With deadline
deadline := time.Now().Add(10 * time.Second)
ctx, cancel := context.WithDeadline(context.Background(), deadline)
defer cancel()

// With value — use sparingly
type key int
const userIDKey key = 0
ctx = context.WithValue(ctx, userIDKey, 42)

uid, _ := ctx.Value(userIDKey).(int)

// Check if done
select {
case <-ctx.Done():
    return ctx.Err()
default:
    // continue
}

// Propagate through function calls
func process(ctx context.Context) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    case result := <-work():
        return result
    }
}
```

## Patterns

### Worker Pool

```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Start workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send jobs
    for j := 1; j <= 10; j++ {
        jobs <- j
    }
    close(jobs)

    // Collect results
    for r := 1; r <= 10; r++ {
        fmt.Println(<-results)
    }
}
```

### Fan-Out/Fan-In

```go
func fanOutFanIn(ctx context.Context, inputs []int, workers int) []int {
    // Fan-out: distribute work
    workCh := make(chan int)
    resultCh := make(chan int)
    
    for i := 0; i < workers; i++ {
        go func() {
            for v := range workCh {
                select {
                case resultCh <- process(v):
                case <-ctx.Done():
                    return
                }
            }
        }()
    }

    go func() {
        defer close(workCh)
        for _, input := range inputs {
            select {
            case workCh <- input:
            case <-ctx.Done():
                return
            }
        }
    }()

    // Fan-in: collect results
    go func() {
        defer close(resultCh)
    }()

    var results []int
    for r := range resultCh {
        results = append(results, r)
    }
    return results
}
```

### Pipeline

```go
func generate(ctx context.Context, nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            select {
            case out <- n:
            case <-ctx.Done():
                return
            }
        }
    }()
    return out
}

func square(ctx context.Context, in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            select {
            case out <- n * n:
            case <-ctx.Done():
                return
            }
        }
    }()
    return out
}

func filter(ctx context.Context, in <-chan int, pred func(int) bool) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            if pred(n) {
                select {
                case out <- n:
                case <-ctx.Done():
                    return
                }
            }
        }
    }()
    return out
}

// Compose pipeline
ctx := context.Background()
nums := generate(ctx, 1, 2, 3, 4, 5)
squared := square(ctx, nums)
evens := filter(ctx, squared, func(n int) bool { return n%2 == 0 })
for v := range evens {
    fmt.Println(v)  // 4, 16
}
```

### ErrGroup

```go
import "golang.org/x/sync/errgroup"

func main() {
    g, ctx := errgroup.WithContext(context.Background())

    for _, url := range urls {
        url := url
        g.Go(func() error {
            return fetch(ctx, url)
        })
    }

    if err := g.Wait(); err != nil {
        log.Fatal(err)
    }
    // All succeeded
}
```

### Rate Limiter

```go
import "golang.org/x/time/rate"

func main() {
    limiter := rate.NewLimiter(rate.Every(100*time.Millisecond), 10)

    for i := 0; i < 100; i++ {
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        if err := limiter.Wait(ctx); err != nil {
            log.Println("rate limit wait error:", err)
            cancel()
            continue
        }
        cancel()
        process(i)
    }
}
```

### Graceful Shutdown

```go
func main() {
    ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
    defer stop()

    srv := &http.Server{Addr: ":8080", Handler: handler}

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatal(err)
        }
    }()

    <-ctx.Done()
    log.Println("shutting down...")

    shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := srv.Shutdown(shutdownCtx); err != nil {
        log.Fatal("server shutdown:", err)
    }
    log.Println("server stopped")
}
```

## The Go Memory Model

Defines the conditions under which reads of a variable in one goroutine can be guaranteed to observe values produced by writes to the same variable in another goroutine.

### Happens-Before Relationship

```go
// 1. Channel send happens-before corresponding receive
ch := make(chan int)
go func() {
    x = 1           // write
    ch <- 0         // send
}()
<-ch                // receive happens-after send
fmt.Println(x)      // guaranteed to see x=1

// 2. Close happens-before receive that returns zero value
ch := make(chan int)
go func() {
    x = 1
    close(ch)
}()
<-ch                // zero value received
fmt.Println(x)      // guaranteed to see x=1

// 3. Mutex Lock happens-before Unlock on same Mutex
var mu sync.Mutex
go func() {
    mu.Lock()
    x = 1
    mu.Unlock()
}()
mu.Lock()
fmt.Println(x)      // guaranteed to see x=1 if write happened
mu.Unlock()

// 4. Once.Do happens-before all returns from Once.Do
var once sync.Once
var x int
go func() {
    once.Do(func() { x = 1 })
}()
once.Do(func() { x = 1 })
fmt.Println(x)      // guaranteed to see x=1
```

### Data Race Detector

```bash
# Run with race detector
go run -race main.go
go build -race -o app
go test -race ./...

# Common race conditions:
// 1. Shared variable without synchronization
// 2. Writing to map from multiple goroutines without sync
// 3. Closing channel from multiple goroutines
```
