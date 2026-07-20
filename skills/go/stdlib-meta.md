# Standard Library: Go Meta & Reflection — Go 1.26

## go/ast

```go
import (
    "go/ast"
    "go/parser"
    "go/token"
)

// Parse Go source file
fset := token.NewFileSet()
f, err := parser.ParseFile(fset, "main.go", nil, parser.ParseComments)

// Walk AST
ast.Inspect(f, func(n ast.Node) bool {
    switch x := n.(type) {
    case *ast.FuncDecl:
        fmt.Println("function:", x.Name.Name)
    case *ast.CallExpr:
        fmt.Println("call at", fset.Position(x.Pos()))
    case *ast.ImportSpec:
        fmt.Println("import:", x.Path.Value)
    }
    return true
})

// Node types
// *ast.File          — entire file
// *ast.FuncDecl      — func declaration
// *ast.GenDecl       — var/const/type/import declaration
// *ast.ValueSpec     — var/const spec
// *ast.TypeSpec      — type spec
// *ast.ImportSpec    — import spec
// *ast.BlockStmt     — { ... }
// *ast.IfStmt        — if statement
// *ast.ForStmt       — for statement
// *ast.RangeStmt     — for range
// *ast.SwitchStmt    — switch
// *ast.ReturnStmt    — return
// *ast.AssignStmt    — =
// *ast.CallExpr      — function call
// *ast.SelectorExpr  — x.y
// *ast.Ident         — identifier
// *ast.BasicLit      — literal
// *ast.BinaryExpr    — a op b
// *ast.UnaryExpr     — op a
// *ast.StructType    — struct{...}
// *ast.InterfaceType — interface{...}
// *ast.FuncType      — func(...)
```

## go/parser

```go
import "go/parser"

// Parse file
fset := token.NewFileSet()
f, err := parser.ParseFile(fset, "main.go", nil, 0)

// Parse from string
f, err := parser.ParseFile(fset, "main.go", src, parser.ParseComments)

// Parse directory
pkgs, err := parser.ParseDir(fset, "./mypkg", nil, 0)

// Parse expression
expr, err := parser.ParseExpr("a + b * c")

// Parse flags
// parser.ParseComments  — include comments
// parser.ImportsOnly    — only parse imports
// parser.Trace          — print parse trace
// parser.AllErrors      — return all errors
```

## go/token

```go
import "go/token"

// FileSet — manages positions
fset := token.NewFileSet()
f := fset.AddFile("main.go", fset.Base(), len(src))

// Position
pos := token.Pos(42)
posn := fset.Position(pos)
fmt.Printf("%s:%d:%d\n", posn.Filename, posn.Line, posn.Column)

// Tokens
token.IDENT
token.INT
token.FLOAT
token.STRING
token.FUNC
token.RETURN
token.IF
token.FOR
token.LBRACE  // {
token.RBRACE  // }
token.SEMICOLON
token.ASSIGN  // =
token.EQL     // ==
token.ADD     // +
token.SUB     // -
token.MUL     // *
token.QUO     // /
token.LSS     // <
token.GTR     // >

// Token string
tok := token.IDENT
fmt.Println(tok.String())  // "IDENT"
fmt.Println(tok.IsOperator())
fmt.Println(tok.IsKeyword())
```

## go/types

```go
import (
    "go/types"
    "go/importer"
)

// Type checking
fset := token.NewFileSet()
f, _ := parser.ParseFile(fset, "main.go", src, 0)

conf := types.Config{Importer: importer.Default()}
info := &types.Info{
    Types:      make(map[ast.Expr]types.TypeAndValue),
    Defs:       make(map[*ast.Ident]types.Object),
    Uses:       make(map[*ast.Ident]types.Object),
    Implicits:  make(map[ast.Node]types.Object),
    Selections: make(map[*ast.SelectorExpr]*types.Selection),
    Scopes:     make(map[ast.Node]*types.Scope),
}

pkg, err := conf.Check("main", fset, []*ast.File{f}, info)

// Type info
for expr, tv := range info.Types {
    fmt.Printf("%v: type=%v, value=%v\n", expr, tv.Type, tv.Value)
}

// Type kinds
// *types.Basic       — int, string, etc.
// *types.Pointer     — *T
// *types.Slice       — []T
// *types.Array       — [N]T
// *types.Map         — map[K]V
// *types.Chan        — chan T
// *types.Struct      — struct{...}
// *types.Interface   — interface{...}
// *types.Signature   — func(...)
// *types.Named       — user-defined type
// *types.TypeParam   — generic type parameter

// Basic types
types.Typ[types.Int]
types.Typ[types.String]
types.Typ[types.Bool]
types.Universe.Lookup("error")  // error type

// Type checking options
conf := types.Config{
    Error:    func(err error) { log.Println(err) },
    Importer: importer.Default(),
}
```

## go/format

```go
import "go/format"

// Format Go source
src := []byte(`package main
func main(){fmt.Println("hello")}
`)
formatted, err := format.Source(src)
// package main
// func main() { fmt.Println("hello") }

// Format AST node
var buf bytes.Buffer
err := format.Node(&buf, fset, astNode)

// Format with options
formatted, err := format.Source(src)
```

## go/doc

```go
import "go/doc"

// Generate documentation from AST
fset := token.NewFileSet()
f, _ := parser.ParseFile(fset, "main.go", nil, parser.ParseComments)

d, err := doc.NewFromFiles(fset, []*ast.File{f}, "example.com/mypkg")

// Package documentation
d.Name        // package name
d.Doc         // package doc comment
d.Consts      // []*doc.Value
d.Vars        // []*doc.Value
d.Funcs       // []*doc.Func
d.Types       // []*doc.Type
d.Examples    // []*doc.Example

for _, fn := range d.Funcs {
    fmt.Printf("func %s: %s\n", fn.Name, fn.Doc)
}
```

## go/build

```go
import "go/build"

// Build context
ctx := build.Default
ctx.GOOS = "linux"
ctx.GOARCH = "arm64"

// Import package
pkg, err := ctx.Import("example.com/mypkg", ".", 0)
pkg.Name         // "mypkg"
pkg.Dir          // directory path
pkg.GoFiles      // []string of .go files
pkg.Imports      // []string of import paths
pkg.TestImports  // test imports

// Build constraints
// //go:build linux && amd64
// // +build linux,amd64
```

## go/version

```go
import "go/version"

// Version comparison (Go 1.21+)
version.IsValid("go1.26")          // true
version.Compare("go1.26", "go1.25") // 1 (1.26 > 1.25)
version.Max("go1.26", "go1.25")     // "go1.26"

// Lang returns Go language version
v := version.Lang("go1.26.0")  // "go1.26"
```

## reflect

```go
import "reflect"

// Type
t := reflect.TypeOf(42)
t.Kind()   // reflect.Int
t.Name()   // "int"
t.Size()   // 8
t.String() // "int"

// Value
v := reflect.ValueOf(42)
v.Kind()   // reflect.Int
v.Int()    // 42
v.Type()   // reflect.Type

// Struct fields
type Person struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}

t := reflect.TypeOf(Person{})
for i := 0; i < t.NumField(); i++ {
    f := t.Field(i)
    fmt.Printf("%s %s tag=%s\n", f.Name, f.Type, f.Tag.Get("json"))
}

// Get/Set field by name
v := reflect.ValueOf(&p).Elem()
nameField := v.FieldByName("Name")
fmt.Println(nameField.String())
nameField.SetString("Alice")

// Methods
t := reflect.TypeOf(p)
for i := 0; i < t.NumMethod(); i++ {
    m := t.Method(i)
    fmt.Println(m.Name, m.Type)
}

// Call method
m := v.MethodByName("Greet")
result := m.Call([]reflect.Value{reflect.ValueOf("world")})

// Create new value
t := reflect.TypeOf(Person{})
v := reflect.New(t)  // *Person
v.Elem().FieldByName("Name").SetString("Bob")

// Slice operations
v := reflect.ValueOf([]int{1, 2, 3})
v.Len()         // 3
v.Index(0).Int() // 1
v = reflect.Append(v, reflect.ValueOf(4))

// Map operations
v := reflect.ValueOf(map[string]int{"a": 1})
v.MapKeys()  // []reflect.Value
v.MapIndex(reflect.ValueOf("a"))  // 1

// CanSet — check if value is settable
v := reflect.ValueOf(&p).Elem()
v.FieldByName("Name").CanSet()  // true (exported)
v.FieldByName("name").CanSet()  // false (unexported)

// Kind types
reflect.Bool
reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64
reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64
reflect.Float32, reflect.Float64
reflect.Complex64, reflect.Complex128
reflect.Array, reflect.Slice, reflect.Map, reflect.Chan
reflect.Func, reflect.Interface, reflect.Struct
reflect.Pointer, reflect.String
reflect.UnsafePointer

// Make functions
reflect.MakeSlice(t, len, cap)
reflect.MakeMap(t)
reflect.MakeMapWithSize(t, n)
reflect.MakeChan(t, buffer)
reflect.MakeFunc(t, fn)

// Type assertions and conversions
v := reflect.ValueOf(42)
if v.CanConvert(reflect.TypeOf(float64(0))) {
    fv := v.Convert(reflect.TypeOf(float64(0)))
}

// Walk — visit fields recursively
func walk(v reflect.Value, visited map[uintptr]bool) {
    if v.CanAddr() {
        ptr := v.UnsafeAddr()
        if visited[ptr] { return }
        visited[ptr] = true
    }
    switch v.Kind() {
    case reflect.Struct:
        for i := 0; i < v.NumField(); i++ {
            walk(v.Field(i), visited)
        }
    }
}
```

## go/scanner

```go
import "go/scanner"

// Lexical scanner for Go source
var s scanner.Scanner
fset := token.NewFileSet()
file := fset.AddFile("example.go", fset.Base(), len(src))
s.Init(file, src, nil, scanner.ScanComments)

for {
    pos, tok, lit := s.Scan()
    if tok == token.EOF { break }
    fmt.Printf("%s: %s %q\n", fset.Position(pos), tok, lit)
}

// Error handler
s.Init(file, src, func(pos token.Position, msg string) {
    fmt.Fprintf(os.Stderr, "%s: %s\n", pos, msg)
}, 0)
```

## go/printer

```go
import "go/printer"

// Print AST back to Go source code
fset := token.NewFileSet()
f, _ := parser.ParseFile(fset, "main.go", nil, parser.ParseComments)

var buf bytes.Buffer
cfg := printer.Config{Mode: printer.UseSpaces | printer.TabIndent, Tabwidth: 8}
cfg.Fprint(&buf, fset, f)
fmt.Println(buf.String())

// Print single node
printer.Fprint(os.Stdout, fset, f.Decls[0])
```

## go/importer

```go
import "go/importer"

// Import packages for type checking
imp := importer.Default()  // uses go/build

// ForCompiler — specify compiler
imp := importer.ForCompiler(fset, "gc", nil)
imp := importer.ForCompiler(fset, "source", nil)  // source-based

// Used with go/types
conf := types.Config{Importer: imp}
pkg, err := conf.Check("main", fset, files, info)

// Import a package
pkg, err := imp.Import("fmt")
fmt.Println(pkg.Path())  // "fmt"
```
