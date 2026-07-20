# Standard Library: Data Structures & Math — Go 1.26

## container/heap

```go
import "container/heap"

// Implement heap.Interface
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *IntHeap) Push(x any) { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

// Usage
h := &IntHeap{3, 1, 4, 1, 5, 9, 2, 6}
heap.Init(h)
heap.Push(h, 0)
min := heap.Pop(h)  // 0
min = heap.Pop(h)   // 1

// Priority queue
type Item struct {
    Value    string
    Priority int
    Index    int
}

type PriorityQueue []*Item

func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].Priority > pq[j].Priority }
func (pq PriorityQueue) Swap(i, j int) {
    pq[i], pq[j] = pq[j], pq[i]
    pq[i].Index = i
    pq[j].Index = j
}

func (pq *PriorityQueue) Push(x any) {
    n := len(*pq)
    item := x.(*Item)
    item.Index = n
    *pq = append(*pq, item)
}

func (pq *PriorityQueue) Pop() any {
    old := *pq
    n := len(old)
    item := old[n-1]
    old[n-1] = nil
    *pq = old[:n-1]
    return item
}
```

## container/list

```go
import "container/list"

// Doubly linked list
l := list.New()
e1 := l.PushBack(1)
e2 := l.PushBack(2)
e3 := l.PushFront(0)

l.InsertBefore(1.5, e2)
l.InsertAfter(2.5, e2)

l.Remove(e1)

// Iterate
for e := l.Front(); e != nil; e = e.Next() {
    fmt.Println(e.Value)
}

// Move
l.MoveToFront(e2)
l.MoveToBack(e3)
l.MoveBefore(e2, e3)
l.MoveAfter(e3, e2)

// Length
n := l.Len()
```

## container/ring

```go
import "container/ring"

// Circular list
r := ring.New(5)
for i := 0; i < 5; i++ {
    r.Value = i
    r = r.Next()
}

// Iterate
r.Do(func(v any) {
    fmt.Println(v)
})

// Link/unlink
s := ring.New(2)
r.Link(s)  // insert s after r
r.Unlink(2)  // remove n elements
```

## sort

```go
import "sort"

// Sort slice
sort.Ints([]int{3, 1, 4, 1, 5})
sort.Float64s([]float64{3.14, 1.41, 2.71})
sort.Strings([]string{"banana", "apple", "cherry"})

// Sort with custom comparator (pre-1.21)
sort.Slice(items, func(i, j int) bool {
    return items[i].Priority > items[j].Priority
})

sort.SliceStable(items, func(i, j int) bool {
    return items[i].Name < items[j].Name
})

// Sort with sort.Interface
type ByAge []Person
func (a ByAge) Len() int           { return len(a) }
func (a ByAge) Less(i, j int) bool { return a[i].Age < a[j].Age }
func (a ByAge) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
sort.Sort(ByAge(people))

// Search (binary search)
i := sort.SearchInts([]int{1, 3, 5, 7, 9}, 5)  // 2
i := sort.SearchStrings(names, "Alice")

// Generic search
i := sort.Search(len(data), func(i int) bool {
    return data[i] >= target
})

// IsSorted
sort.IsSorted(sort.IntSlice(nums))
```

## slices

```go
import "slices"

// Sort (Go 1.21+ — generic, replaces sort functions)
slices.Sort([]int{3, 1, 4, 1, 5})
slices.SortStable([]int{3, 1, 4, 1, 5})

// Sort with key function
slices.SortFunc(items, func(a, b Item) int {
    return cmp.Compare(a.Priority, b.Priority)
})

// SortStable with function
slices.SortStableFunc(items, func(a, b Item) int {
    return strings.Compare(a.Name, b.Name)
})

// Binary search
i, found := slices.BinarySearch(nums, 42)
i, found := slices.BinarySearchFunc(items, target, func(a, b Item) int {
    return cmp.Compare(a.ID, b.ID)
})

// Contains
slices.Contains(nums, 42)
slices.ContainsFunc(items, func(e Item) bool { return e.ID == 42 })

// Index
i := slices.Index(nums, 42)
i := slices.IndexFunc(items, func(e Item) bool { return e.ID == 42 })

// Min / Max
m := slices.Min(nums)  // requires cmp.Ordered
m := slices.Max(nums)
m := slices.MinFunc(items, func(a, b Item) int { return cmp.Compare(a.Priority, b.Priority) })

// Reverse
slices.Reverse(nums)

// Clone
dst := slices.Clone(src)

// Compact — remove consecutive duplicates
slices.Compact(nums)
slices.CompactFunc(items, func(a, b Item) bool { return a.ID == b.ID })

// Concat
result := slices.Concat(a, b, c)

// Insert / Delete / Replace
s := slices.Insert(nums, 2, 99)  // insert 99 at index 2
s = slices.Delete(nums, 1, 3)    // remove indices 1..2
s = slices.Replace(nums, 1, 3, 99)  // replace indices 1..2 with 99

// Grow / Clip
s = slices.Grow(s, 10)  // ensure capacity
s = slices.Clip(s)      // trim capacity to length

// Equal
slices.Equal(a, b)
slices.EqualFunc(a, b, func(x, y int) bool { return x == y })

// Compare
n := slices.Compare(a, b)  // -1, 0, 1

// Repeat (Go 1.23+)
s := slices.Repeat([]int{1, 2}, 3)  // [1, 2, 1, 2, 1, 2]

// Reverse (in-place)
slices.Reverse(nums)

// Collect from iterator
s := slices.Collect(iter.Seq[T])
```

## maps

```go
import "maps"

// Clone
m2 := maps.Clone(m1)

// Copy
maps.Copy(dst, src)

// Equal
maps.Equal(m1, m2)
maps.EqualFunc(m1, m2, func(v1, v2 V) bool { return v1 == v2 })

// Keys
keys := maps.Keys(m)  // iter.Seq[K] (Go 1.23+)
keysSlice := slices.Collect(maps.Keys(m))

// Values
values := maps.Values(m)  // iter.Seq[V]
valuesSlice := slices.Collect(maps.Values(m))

// Insert from iterator
maps.Insert(m, iter.Seq2[K, V])

// DeleteFunc
maps.DeleteFunc(m, func(k K, v V) bool { return v == nil })
```

## math

```go
import "math"

// Constants
math.Pi       // 3.141592653589793
math.E        // 2.718281828459045
math.Phi      // 1.618033988749895 (golden ratio)
math.Sqrt2    // 1.4142135623730951
math.Inf(1)   // +Inf
math.NaN()    // NaN

// Basic functions
math.Abs(-5)          // 5
math.Ceil(3.2)        // 4
math.Floor(3.8)       // 3
math.Round(3.5)       // 4
math.RoundToEven(3.5) // 4 (banker's rounding)
math.Trunc(3.7)       // 3
math.Sqrt(16)         // 4
math.Cbrt(27)         // 3
math.Pow(2, 10)       // 1024
math.Max(1, 2)        // 2
math.Min(1, 2)        // 1

// Logarithms
math.Log(2.718)       // ~1
math.Log2(8)          // 3
math.Log10(1000)      // 3
math.Exp(1)           // ~2.718

// Trigonometry
math.Sin(math.Pi/2)   // 1
math.Cos(0)           // 1
math.Tan(0)           // 0
math.Asin(1)          // Pi/2
math.Acos(1)          // 0
math.Atan(1)          // Pi/4
math.Atan2(1, 1)      // Pi/4

// Hyperbolic
math.Sinh(0)  // 0
math.Cosh(0)  // 1
math.Tanh(0)  // 0

// Special
math.IsNaN(x)
math.IsInf(x, 1)
math.Signbit(-1.5)  // true
math.Copysign(1, -1)  // -1
math.Mod(10, 3)  // 1
math.Hypot(3, 4)  // 5
math.Gamma(5)  // 24
math.Erf(0)  // 0

// Integer limits
math.MaxInt8   // 127
math.MinInt8   // -128
math.MaxInt16  // 32767
math.MaxInt32  // 2147483647
math.MaxInt64  // 9223372036854775807
math.MaxUint8  // 255
math.MaxUint16 // 65535
math.MaxUint32 // 4294967295
math.MaxUint64 // 18446744073709551615
math.MaxFloat32
math.MaxFloat64
math.SmallestNonzeroFloat32
math.SmallestNonzeroFloat64
```

## math/big

```go
import "math/big"

// Int — arbitrary precision integer
a := big.NewInt(1)
b := big.NewInt(2)
c := new(big.Int).Add(a, b)  // 3
c.Mul(a, b)  // 2
c.Sub(a, b)  // -1
c.Quo(a, b) // 0
c.Mod(a, b) // 1
c.Exp(a, b, nil)  // 1^2 = 1

// Float — arbitrary precision float
f := big.NewFloat(3.14)
f.SetPrec(200)

// Rat — rational number
r := big.NewRat(1, 3)  // 1/3
r.Add(r, big.NewRat(1, 6))  // 1/2

// Prime testing
n := big.NewInt(17)
n.ProbablyPrime(20)  // true (Miller-Rin, 20 iterations)
```

## math/bits

```go
import "math/bits"

// Bit operations
bits.OnesCount(0xFF)      // 8 (popcount)
bits.LeadingZeros(1)      // 63 (for uint64)
bits.TrailingZeros(8)     // 3
bits.Len(255)             // 8 (position of highest bit)
bits.RotateLeft(0x01, 4)  // 0x10
bits.Reverse(0x01)        // bit reversal
bits.ReverseBytes(0x0102) // byte reversal

// Mul/Div with overflow
hi, lo := bits.Mul64(0xFFFFFFFF, 0xFFFFFFFF)
q, r := bits.Div64(hi, lo, 0xFFFFFFFF)
```

## math/cmplx

```go
import "math/cmplx"

c := complex(3, 4)  // 3+4i
cmplx.Abs(c)        // 5
cmplx.Phase(c)      // ~0.927 (arg)
cmplx.Conj(c)       // 3-4i
cmplx.Sqrt(c)
cmplx.Exp(c)
cmplx.Log(c)
cmplx.Sin(c)
cmplx.Cos(c)
```

## math/rand/v2

```go
import "math/rand/v2"

// Go 1.22+ — math/rand/v2 (improved API, no global seed needed)

// Integers
n := rand.Int()       // random int
n := rand.IntN(100)   // 0..99
n := rand.Int32()
n := rand.Int32N(100)
n := rand.Int64()
n := rand.Int64N(100)
n := rand.Uint32()
n := rand.Uint64()
n := rand.Uint64N(100)

// Floats
f := rand.Float32()
f := rand.Float64()

// Normal distribution
f := rand.NormFloat64()  // mean=0, stddev=1
f := rand.ExpFloat64()   // exponential

// Custom source
r := rand.New(rand.NewPCG(seed1, seed2))
n := r.IntN(100)
```

## regexp

```go
import "regexp"

// Compile
re := regexp.MustCompile(`\d+`)
re := regexp.MustCompile(`(?i)hello`)  // case-insensitive

// Match
re.MatchString("hello123")  // true
re.Match([]byte("hello123"))
re.MatchReader(strings.NewReader("hello123"))

// Find
match := re.FindString("hello123world")  // "123"
matches := re.FindAllString("a1b2c3", -1)  // ["1", "2", "3"]
index := re.FindStringIndex("hello123")  // [5, 8]
indices := re.FindAllStringIndex("a1b2c3", -1)

// Capture groups
re := regexp.MustCompile(`(\w+)@(\w+)\.(\w+)`)
sub := re.FindStringSubmatch("user@example.com")
// ["user@example.com", "user", "example", "com"]

subs := re.FindAllStringSubmatch("a@b.com c@d.com", -1)

// Replace
result := re.ReplaceAllString("hello123", "NUM")
result := re.ReplaceAllString("hello123", "$1")  // backreference
result := re.ReplaceAllLiteralString("hello123", "X")

// Replace with function
result := re.ReplaceAllStringFunc("a1b2c3", func(s string) string {
    n, _ := strconv.Atoi(s)
    return strconv.Itoa(n * 2)
})

// Split
parts := re.Split("a,b,c", -1)  // ["a", "b", "c"]

// QuoteMeta — escape regex metacharacters
escaped := regexp.QuoteMeta("a.b*c")

// Named groups
re := regexp.MustCompile(`(?P<year>\d{4})-(?P<month>\d{2})`)
match := re.FindStringSubmatchMatch("2024-01")
year := match.GroupByName("year").String()
```

## hash

```go
import (
    "hash"
    "hash/adler32"
    "hash/crc32"
    "hash/crc64"
    "hash/fnv"
    "hash/maphash"
)

// CRC32
h := crc32.NewIEEE()
h.Write([]byte("hello"))
sum := h.Sum32()  // 0x3610a686

// CRC64
h := crc64.New(crc64.MakeTable(crc64.ISO))
h.Write([]byte("hello"))
sum := h.Sum64()

// FNV
h := fnv.New32a()
h.Write([]byte("hello"))
sum := h.Sum32()

// Adler32
h := adler32.New()
h.Write([]byte("hello"))
sum := h.Sum32()

// maphash — for map keys
var h maphash.Hash
h.Write([]byte("hello"))
sum := h.Sum64()

// Seed — randomized per process
seed := maphash.MakeSeed()
h := maphash.Hash{Seed: seed}
```

## unique

```go
import "unique"

// Intern values — deduplicate (Go 1.23+)
type Name struct{ First, Last string }

var intern = unique.Make[Name]

n1 := intern(Name{"Alice", "Smith"})
n2 := intern(Name{"Alice", "Smith"})
// n1 == n2 — same Value, deduplicated

fmt.Println(n1.Value())  // Name{"Alice", "Smith"}
```

## weak

```go
import "weak"

// Weak pointers — don't prevent GC (Go 1.24+)
type Cache struct {
    m map[string]weak.Pointer[*Entry]
}

func (c *Cache) Get(key string) *Entry {
    if wp, ok := c.m[key]; ok {
        if e := wp.Value(); e != nil {
            return e  // still alive
        }
        delete(c.m, key)  // collected
    }
    e := &Entry{...}
    c.m[key] = weak.Make(e)
    return e
}
```

## index/suffixarray

```go
import "index/suffixarray"

// Build suffix array for fast substring search
sa := suffixarray.New([]byte("banana"))
indices := sa.Lookup([]byte("ana"), -1)  // [1, 3] — all occurrences
indices := sa.Lookup([]byte("ana"), 1)   // [1] — first occurrence only
```

## regexp/syntax

```go
import "regexp/syntax"

// Parse regexp into AST
re, err := syntax.Parse(`(\w+)@(\w+)\.com`, syntax.Perl)
// re is *syntax.Regexp

// AST node types
re.Op    // syntax.OpCapture, OpStar, OpPlus, OpConcat, etc.
re.Sub   // child expressions
re.Rune  // literal runes
re.Min, re.Max  // repetition bounds
re.Cap    // capture group index
re.Name   // named capture group

// Tree traversal
func walk(re *syntax.Regexp, depth int) {
    fmt.Printf("%s%s\n", strings.Repeat("  ", depth), re.Op)
    for _, sub := range re.Sub {
        walk(sub, depth+1)
    }
}

// Compile to instructions
insts, prefix, complete := syntax.Compile(re)

// Simplify
re = re.Simplify()
```
