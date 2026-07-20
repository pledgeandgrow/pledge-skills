# Standard Library: Testing — Go 1.26

## testing

```go
import "testing"

// Basic test
func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    if got != want {
        t.Errorf("Add(2, 3) = %d, want %d", got, want)
    }
}

// Table-driven test
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
        {"mixed", -1, 1, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.expected {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.expected)
            }
        })
    }
}

// Helper functions
func TestProcess(t *testing.T) {
    // t.Helper() — marks function as helper, error reports caller's line
    // t.Skip("not applicable") — skip test
    // t.Skipf("skip: %s", reason)
    // t.Fatal("error") — fail and stop
    // t.Fatalf("error: %d", code)
    // t.Error("error") — fail but continue
    // t.Errorf("error: %v", err)
    // t.Log("info")
    // t.Logf("info: %d", x)
    // t.Parallel() — run in parallel
    // t.Cleanup(func() { /* cleanup */ }) — run after test
    // t.Setenv("KEY", "value") — set env, restored after test
    // t.TempDir() — temporary directory, removed after test
}

// Parallel test
func TestParallel(t *testing.T) {
    t.Parallel()
    // test code
}

// Subtests
func TestSubtests(t *testing.T) {
    t.Run("case1", func(t *testing.T) {
        t.Parallel()
        // ...
    })
    t.Run("case2", func(t *testing.T) {
        t.Parallel()
        // ...
    })
}

// Cleanup
func TestWithCleanup(t *testing.T) {
    dir := t.TempDir()
    file := filepath.Join(dir, "test.txt")
    os.WriteFile(file, []byte("test"), 0644)
    
    t.Cleanup(func() {
        os.RemoveAll(dir)
    })
    
    // test using file
}
```

## Benchmarks

```go
func BenchmarkSum(b *testing.B) {
    nums := make([]int, 1000)
    for i := range nums {
        nums[i] = i
    }
    
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        Sum(nums)
    }
}

// Benchmark with setup
func BenchmarkProcess(b *testing.B) {
    data := setupData()
    b.ResetTimer()
    b.ReportAllocs()  // report allocations
    
    for i := 0; i < b.N; i++ {
        Process(data)
    }
}

// Sub-benchmarks
func BenchmarkSort(b *testing.B) {
    sizes := []int{100, 1000, 10000}
    for _, size := range sizes {
        b.Run(fmt.Sprintf("size-%d", size), func(b *testing.B) {
            data := make([]int, size)
            for i := range data {
                data[i] = rand.IntN(size)
            }
            b.ResetTimer()
            for i := 0; i < b.N; i++ {
                b.StopTimer()
                dataCopy := slices.Clone(data)
                b.StartTimer()
                slices.Sort(dataCopy)
            }
        })
    }
}

// Custom metrics
func BenchmarkCustom(b *testing.B) {
    b.ReportMetric(float64(b.N)/b.Elapsed().Seconds(), "ops/sec")
    for i := 0; i < b.N; i++ {
        // ...
    }
}

// Run benchmarks
// go test -bench=. -benchmem
// go test -bench=BenchmarkSum -benchtime=5s
// go test -bench=. -count=5  // run 5 times for stability
```

## Fuzzing

```go
func FuzzReverse(f *testing.F) {
    // Seed corpus
    f.Add("hello")
    f.Add("world")
    f.Add("12345")
    
    f.Fuzz(func(t *testing.T, orig string) {
        rev := Reverse(orig)
        doubleRev := Reverse(rev)
        if orig != doubleRev {
            t.Errorf("Before: %q, after: %q", orig, doubleRev)
        }
        if utf8.ValidString(orig) && !utf8.ValidString(rev) {
            t.Errorf("Reverse produced invalid UTF-8: %q", rev)
        }
    })
}

// Multiple parameters
func FuzzParse(f *testing.F) {
    f.Add("2024-01-15", "2006-01-02")
    f.Fuzz(func(t *testing.T, input, layout string) {
        _, err := time.Parse(layout, input)
        if err != nil {
            t.Skip()  // expected for invalid inputs
        }
    })
}

// Run fuzzing
// go test -fuzz=FuzzReverse
// go test -fuzz=FuzzReverse -fuzztime=5m
// go test -fuzz=FuzzReverse -fuzzminimizetime=30s

// Corpus location: testdata/fuzz/<TestName>/
```

## testing/synctest (Go 1.25+)

```go
import "testing/synctest"

// Test goroutine timing in a deterministic way
func TestWithSynctest(t *testing.T) {
    synctest.Test(func(t *testing.T) {
        // All goroutines started here are in a bubble
        // Time is fake — timers fire in order
        
        done := make(chan struct{})
        go func() {
            time.Sleep(1 * time.Hour)  // fires immediately in synctest
            close(done)
        }()
        
        <-done  // doesn't block forever
    })
}

// Run
func TestWithRun(t *testing.T) {
    synctest.Run(func() {
        // deterministic goroutine scheduling
    })
}
```

## testing/quick

```go
import "testing/quick"

// Property-based testing
func TestAddQuick(t *testing.T) {
    f := func(x, y int) bool {
        return Add(x, y) == Add(y, x)  // commutative property
    }
    if err := quick.Check(f, nil); err != nil {
        t.Error(err)
    }
}

// With config
config := &quick.Config{
    MaxCount: 1000,
    Rand:     rand.New(rand.NewSource(42)),
}
quick.Check(f, config)

// Multiple values
func TestStringOps(t *testing.T) {
    f := func(s string) bool {
        return Reverse(Reverse(s)) == s
    }
    quick.Check(f, &quick.Config{MaxCount: 100})
}
```

## testing/fstest

```go
import "testing/fstest"

// Test io/fs.FS implementations
func TestMyFS(t *testing.T) {
    fsys := MyFS{}
    if err := fstest.TestFS(fsys, "file1.txt", "dir/file2.txt"); err != nil {
        t.Fatal(err)
    }
}
```

## testing/iotest

```go
import "testing/iotest"

// Test readers
r := iotest.TimeoutReader(strings.NewReader("hello"))  // times out
r := iotest.HalfReader(strings.NewReader("hello"))     // reads half at a time
r := iotest.OneByteReader(strings.NewReader("hello"))  // reads 1 byte at a time
r := iotest.DataErrReader(r)                           // returns data with error
```

## testing/slogtest

```go
import "testing/slogtest"

// Test custom slog.Handler
func TestMyHandler(t *testing.T) {
    var buf bytes.Buffer
    handler := NewMyHandler(&buf)
    err := slogtest.TestHandler(handler, func() []map[string]any {
        return parseLogEntries(buf.String())
    })
    if err != nil {
        t.Fatal(err)
    }
}
```

## testing/cryptotest (Go 1.26)

```go
import "testing/cryptotest"

// Set global random source for deterministic testing
cryptotest.SetGlobalRandom(rand.Reader)

// Used when crypto functions ignore their random parameter (Go 1.26)
// Allows deterministic testing of crypto operations
```

## Coverage

```bash
# Basic coverage
go test -cover
go test -coverprofile=coverage.out

# HTML report
go tool cover -html=coverage.out -o coverage.html

# Func report
go tool cover -func=coverage.out

# Binary coverage (Go 1.20+)
go build -cover -o myapp
GOCOVERDIR=./coverage ./myapp
go tool covdata textfmt -i=./coverage -o coverage.txt

# Merge coverage files
go tool covdata merge -i=./cov1,./cov2 -o=./merged
```

## Test Commands

```bash
# Run all tests
go test ./...

# Verbose
go test -v ./...

# Run specific test
go test -run TestAdd ./...
go test -run TestAdd/positive ./...

# Run with race detector
go test -race ./...

# Run with timeout
go test -timeout 30s ./...

# Run with short flag (skip long tests)
go test -short ./...

# Update test fixtures
go test -update ./...

# Fail fast
go test -failfast ./...

# Show test coverage
go test -coverprofile=c.out && go tool cover -html=c.out

# Benchmark
go test -bench=. -benchmem
go test -bench=BenchmarkName -benchtime=5s

# Fuzz
go test -fuzz=FuzzName -fuzztime=5m

# Run in parallel (default: GOMAXPROCS)
go test -parallel 4 ./...

# Skip tests
go test -run '^TestAdd$' ./...  # regex match
go test -skip TestSlow ./...
```

## Test Main

```go
func TestMain(m *testing.M) {
    // Setup
    setupDB()
    
    // Run tests
    code := m.Run()
    
    // Teardown
    teardownDB()
    
    os.Exit(code)
}
```

## Build Tags for Tests

```go
//go:build integration
// +build integration

package main

import "testing"

func TestDatabase(t *testing.T) {
    // Only runs with: go test -tags=integration
}
```

## Test Helpers

```go
// Helper — error reports caller's location
func assertEqual(t *testing.T, got, want any) {
    t.Helper()
    if !reflect.DeepEqual(got, want) {
        t.Errorf("got %v, want %v", got, want)
    }
}

// Usage
func TestSomething(t *testing.T) {
    assertEqual(t, result, expected)
}
```
