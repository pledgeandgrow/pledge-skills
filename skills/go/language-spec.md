# Language Specification — Go 1.26

## Program Structure

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    fmt.Printf("Pi is approximately %g\n", math.Pi)
}
```

## Packages and Imports

```go
// Single import
import "fmt"

// Grouped imports
import (
    "fmt"
    "os"
    "strings"
)

// Aliased imports
import (
    f "fmt"
    _ "image/png"  // side-effect import (init only)
    str "strings"
)

// Import with dot (use package names directly — avoid in production)
import . "fmt"
```

## Variables and Constants

### Variables

```go
// Declaration with type
var x int
var s string = "hello"
var b bool = true

// Type inference
var x = 42
var s = "hello"

// Short variable declaration (function scope only)
x := 42
s := "hello"

// Multiple variables
var (
    name   string  = "Go"
    version float64 = 1.26
)

a, b := 1, 2
a, b = b, a  // swap
```

### Constants

```go
const Pi = 3.14159
const (
    StatusOK    = 200
    StatusError = 500
)

// iota — enumerated constants
const (
    Sunday    = iota  // 0
    Monday            // 1
    Tuesday           // 2
    Wednesday         // 3
    Thursday          // 4
    Friday            // 5
    Saturday          // 6
)

// Bit flags with iota
const (
    Read    = 1 << iota  // 1
    Write                // 2
    Execute              // 4
)

// Untyped constants
const x = 1.0  // untyped float
var y float64 = x  // implicitly converted
var z int = x      // implicitly converted (untyped constant)
```

## Basic Types

```go
// Boolean
bool  // true, false

// Numeric
int     // platform-dependent (32 or 64 bit)
int8    // -128 to 127
int16   // -32768 to 32767
int32   // -2147483648 to 2147483647
int64   // -9223372036854775808 to 9223372036854775807
uint    // platform-dependent
uint8   // 0 to 255 (byte is alias)
uint16  // 0 to 65535
uint32  // 0 to 4294967295
uint64  // 0 to 18446744073709551615
uintptr // unsigned int for pointer arithmetic

float32    // IEEE 754 32-bit
float64    // IEEE 754 64-bit

complex64  // float32 real + imaginary
complex128 // float64 real + imaginary

// String
string  // immutable sequence of bytes (UTF-8)

// Byte and Rune aliases
byte = uint8   // raw byte
rune = int32   // Unicode code point

// Zero values
// int: 0, float: 0.0, bool: false, string: "", pointer: nil
```

## Type Conversions

```go
// Explicit conversion required — no implicit conversions
var i int = 42
var f float64 = float64(i)
var u uint = uint(f)

// String conversions
s := string(65)        // "A" (from integer — Unicode code point)
b := []byte("hello")   // string to byte slice
s2 := string(b)        // byte slice to string
r := []rune("héllo")   // string to rune slice (Unicode)

// strconv for formatted conversions
import "strconv"
s := strconv.Itoa(42)          // int to string
i, err := strconv.Atoi("42")   // string to int
f, err := strconv.ParseFloat("3.14", 64)
```

## Control Flow

### If

```go
if x > 0 {
    fmt.Println("positive")
} else if x < 0 {
    fmt.Println("negative")
} else {
    fmt.Println("zero")
}

// If with initialization statement
if err := doSomething(); err != nil {
    log.Fatal(err)
}
```

### For

```go
// Classic for
for i := 0; i < 10; i++ {
    fmt.Println(i)
}

// While-style
for x < 100 {
    x *= 2
}

// Infinite loop
for {
    break
}

// Range
for index, value := range slice {
    fmt.Printf("%d: %v\n", index, value)
}

// Range — omit index
for _, value := range slice {
    fmt.Println(value)
}

// Range over string (yields runes)
for i, r := range "héllo" {
    fmt.Printf("%d: %c\n", i, r)
}

// Range over map (unordered)
for key, value := range m {
    fmt.Printf("%s: %v\n", key, value)
}

// Range over channel
for value := range ch {
    fmt.Println(value)
}

// Range over int (Go 1.22+)
for i := range 10 {
    fmt.Println(i)  // 0..9
}

// Range over function (iterators, Go 1.23+)
for v := range iterator {
    fmt.Println(v)
}
```

### Switch

```go
switch os := runtime.GOOS; os {
case "darwin":
    fmt.Println("macOS")
case "linux":
    fmt.Println("Linux")
default:
    fmt.Println(os)
}

// Switch with no expression — cleaner if-else chain
switch {
case x < 0:
    fmt.Println("negative")
case x == 0:
    fmt.Println("zero")
default:
    fmt.Println("positive")
}

// Multi-value cases
switch day {
case "Saturday", "Sunday":
    fmt.Println("weekend")
default:
    fmt.Println("weekday")
}

// Fallthrough (rarely used)
switch x {
case 1:
    fmt.Println("one")
    fallthrough
case 2:
    fmt.Println("two")
}

// Type switch
switch v := x.(type) {
case int:
    fmt.Printf("int: %d\n", v)
case string:
    fmt.Printf("string: %s\n", v)
default:
    fmt.Printf("unknown: %T\n", v)
}
```

### Defer

```go
// Deferred function calls execute in LIFO order
func main() {
    defer fmt.Println("third")
    defer fmt.Println("second")
    fmt.Println("first")
    // Output: first, second, third
}

// Common pattern — resource cleanup
func processFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close()

    // Process file
    return nil
}

// Deferred arguments are evaluated immediately
func main() {
    i := 1
    defer fmt.Println(i)  // prints 1, not 2
    i = 2
}
```

### Goto, Break, Continue

```go
// Continue — skip to next iteration
for i := 0; i < 10; i++ {
    if i%2 == 0 {
        continue
    }
    fmt.Println(i)
}

// Break — exit loop
for {
    if done {
        break
    }
}

// Labels for break/continue
outer:
    for i := 0; i < 3; i++ {
        for j := 0; j < 3; j++ {
            if i == j {
                break outer
            }
        }
    }
```

## Functions

```go
// Basic function
func add(x int, y int) int {
    return x + y
}

// Shorter syntax — same type for consecutive params
func add(x, y int) int {
    return x + y
}

// Multiple return values
func divmod(a, b int) (int, int) {
    return a / b, a % b
}

q, r := divmod(17, 5)

// Named return values
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return  // "naked" return — uses named values
}

// Variadic functions
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

sum(1, 2, 3)       // 6
sum(1, 2, 3, 4, 5) // 15

nums := []int{1, 2, 3}
sum(nums...)  // spread slice into variadic

// Function as value
func apply(f func(int) int, x int) int {
    return f(x)
}

result := apply(func(x int) int { return x * 2 }, 5)  // 10

// Closure — captures variables
func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

c := counter()
c()  // 1
c()  // 2
c()  // 3

// Init function — runs before main
func init() {
    // initialization logic
}
```

## Pointers

```go
x := 42
p := &x         // p is *int, pointing to x
fmt.Println(*p) // 42 (dereference)
*p = 100        // modify x through pointer
fmt.Println(x)  // 100

// new() — allocate zero-valued variable, return pointer
p := new(int)   // *int, value 0
*p = 42

// Go 1.26 — new() with expression
type Person struct {
    Name string
    Age  *int
}
p := Person{
    Name: "Alice",
    Age:  new(yearsSince(birthday)),  // new with expression (Go 1.26)
}

// Pointers to structs — automatic dereferencing
type Point struct{ X, Y int }
p := &Point{X: 1, Y: 2}
p.X = 10  // (*p).X = 10 — automatic dereference
```

## Structs

```go
type Person struct {
    Name string
    Age  int
    Email string `json:"email,omitempty"`
}

// Create
p := Person{Name: "Alice", Age: 30}
p := Person{Name: "Bob"}  // Age defaults to 0

// Pointer to struct
p := &Person{Name: "Charlie", Age: 25}

// Anonymous structs
p := struct{ Name string }{Name: "Dave"}

// Nested structs
type Address struct {
    City    string
    Country string
}

type Employee struct {
    Person          // embedded struct (anonymous field)
    Address         // embedded struct
    Salary   float64
}

e := Employee{
    Person:  Person{Name: "Eve", Age: 28},
    Address: Address{City: "NYC", Country: "USA"},
    Salary:  75000,
}
e.Name     // "Eve" — promoted from Person
e.City     // "NYC" — promoted from Address

// Struct tags
type User struct {
    Name  string `json:"name" validate:"required"`
    Email string `json:"email" validate:"required,email"`
    Age   int    `json:"age,omitempty"`
}

// Struct comparison — only if all fields are comparable
p1 := Point{1, 2}
p2 := Point{1, 2}
fmt.Println(p1 == p2)  // true
```

## Methods

```go
type Rectangle struct {
    Width, Height float64
}

// Value receiver
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// Pointer receiver — can modify the receiver
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

r := Rectangle{Width: 10, Height: 5}
r.Area()        // 50
r.Scale(2)      // modifies r — Width=20, Height=10
(&r).Scale(2)   // explicit pointer

// Methods on non-struct types
type MyInt int

func (m MyInt) IsEven() bool {
    return m%2 == 0
}

x := MyInt(42)
x.IsEven()  // true
```

## Interfaces

```go
// Define interface
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Implicit implementation — no "implements" keyword
type Circle struct{ Radius float64 }
func (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }

type Rectangle struct{ Width, Height float64 }
func (r Rectangle) Area() float64      { return r.Width * r.Height }
func (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }

// Use interface
func printShape(s Shape) {
    fmt.Printf("Area: %.2f, Perimeter: %.2f\n", s.Area(), s.Perimeter())
}

printShape(Circle{Radius: 5})
printShape(Rectangle{Width: 3, Height: 4})

// Empty interface — any type
func describe(i interface{}) {
    fmt.Printf("(%T, %v)\n", i, i)
}

// Type assertion
var i interface{} = "hello"
s := i.(string)  // panics if not string
s, ok := i.(string)  // ok=false if not string

// Type switch
switch v := i.(type) {
case int:
    fmt.Printf("int: %d\n", v)
case string:
    fmt.Printf("string: %s\n", v)
default:
    fmt.Printf("unknown: %T\n", v)
}

// Interface composition
type ReadWriter interface {
    Reader
    Writer
}

// Common interfaces in stdlib
// io.Reader, io.Writer, io.Closer, io.ReadWriter
// fmt.Stringer, error, sort.Interface
// json.Marshaler, json.Unmarshaler

// Stringer interface
type Animal struct{ Name string }
func (a Animal) String() string {
    return "Animal: " + a.Name
}
fmt.Println(Animal{Name: "Cat"})  // Animal: Cat
```

## Generics

### Type Parameters

```go
// Generic function
func Sum[T int | int64 | float64](values []T) T {
    var sum T
    for _, v := range values {
        sum += v
    }
    return sum
}

Sum([]int{1, 2, 3})          // 6
Sum([]float64{1.5, 2.5})     // 4.0

// Generic type
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
    if len(s.items) == 0 {
        var zero T
        return zero, false
    }
    item := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return item, true
}

s := Stack[int]{}
s.Push(1)
s.Push(2)
v, _ := s.Pop()  // 2
```

### Type Constraints

```go
// Custom constraint
type Number interface {
    int | int64 | float64
}

func Sum[T Number](values []T) T {
    var sum T
    for _, v := range values {
        sum += v
    }
    return sum
}

// comparable constraint
func Contains[T comparable](slice []T, target T) bool {
    for _, v := range slice {
        if v == target {
            return true
        }
    }
    return false
}

// constraints package
import "golang.org/x/exp/constraints"

func Max[T constraints.Ordered](a, b T) T {
    if a > b {
        return a
    }
    return b
}

// cmp package (stdlib, Go 1.21+)
import "cmp"

func Max[T cmp.Ordered](a, b T) T {
    return max(a, b)  // built-in max (Go 1.21+)
}

// ~ (tilde) — includes underlying type
type MyString string

func Print[T ~string](s T) {
    fmt.Println(s)
}

Print(MyString("hello"))  // works with MyString
Print("hello")            // works with string
```

### Self-Referential Type Constraints (Go 1.26)

```go
// New in Go 1.26 — generic types can refer to themselves in constraints
type Adder[A Adder[A]] interface {
    Add(A) A
}

func algo[A Adder[A]](x, y A) A {
    return x.Add(y)
}

// Previously, the self-reference to Adder was not allowed
```

### Type Inference

```go
// Type parameter inferred from arguments
Sum([]int{1, 2, 3})  // T=int inferred

// Partial inference
func Map[T, U any](slice []T, f func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = f(v)
    }
    return result
}

doubled := Map([]int{1, 2, 3}, func(x int) int { return x * 2 })
// T=int, U=int inferred

// Explicit type arguments when inference fails
result := Map[int, string]([]int{1, 2, 3}, func(x int) string {
    return strconv.Itoa(x)
})
```

## Error Handling

```go
// Basic error
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

result, err := divide(10, 0)
if err != nil {
    log.Fatal(err)
}

// fmt.Errorf with %w (wrapping)
func loadConfig(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return fmt.Errorf("opening config %s: %w", path, err)
    }
    defer f.Close()
    return nil
}

// errors.Is — check if error matches target
if errors.Is(err, os.ErrNotExist) {
    // file doesn't exist
}

// errors.As — extract specific error type
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println("Path:", pathErr.Path)
}

// Sentinel errors
var ErrNotFound = errors.New("not found")

func find(id int) (*Item, error) {
    // ...
    return nil, ErrNotFound
}

if errors.Is(err, ErrNotFound) {
    // handle not found
}

// Custom error type
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// errors.Join (Go 1.20+)
err := errors.Join(err1, err2, err3)

// Panic and recover
func safeDivide(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
        }
    }()
    return a / b, nil
}
```

## Type Declarations

```go
// Type alias — fully interchangeable
type Text = string
var s Text = "hello"  // same as string

// Type definition — distinct type
type Celsius float64
type Fahrenheit float64

func CToF(c Celsius) Fahrenheit {
    return Fahrenheit(c*9/5 + 32)
}

// Cannot directly assign — must convert
var c Celsius = 100
var f Fahrenheit = CToF(c)
// f = c  // compile error — different types
```

## Slices and Maps

```go
// Slices
s := []int{1, 2, 3}
s := make([]int, 5)       // length 5, capacity 5
s := make([]int, 5, 10)   // length 5, capacity 10

append(s, 4)              // add element
append(s, 4, 5, 6)       // add multiple
append(s, other...)       // append another slice

len(s)                    // length
cap(s)                    // capacity

s[1:3]                    // subslice (indices 1, 2)
s[:3]                     // first 3 elements
s[2:]                     // from index 2 to end
s[:]                      // full slice

// Copy
dst := make([]int, len(src))
copy(dst, src)

// Maps
m := map[string]int{"a": 1, "b": 2}
m := make(map[string]int)

m["c"] = 3
delete(m, "a")

v, ok := m["a"]  // ok=false if key doesn't exist

for k, v := range m {
    fmt.Printf("%s: %d\n", k, v)
}
```

## The Go Memory Model

Defines when writes to a variable are visible to reads in other goroutines:

- A send on a channel happens-before the corresponding receive completes
- A receive from an unbuffered channel happens-before the send completes
- A close on a channel happens-before a receive that returns zero value
- A Lock on a Mutex happens-before an Unlock on the same Mutex

```go
// Correct synchronization
var (
    counter int
    mu      sync.Mutex
)

func increment() {
    mu.Lock()
    defer mu.Unlock()
    counter++
}

// Data race — UNDEFINED BEHAVIOR
// var data int
// go func() { data = 1 }()
// fmt.Println(data)  // race!
```
