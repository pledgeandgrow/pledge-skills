# Getting Started with Go — Go 1.26

## Installation

### Download

Download from https://go.dev/dl/ — choose your platform:
- Linux, macOS, Windows, FreeBSD
- amd64, arm64, 386, armv6, ppc64le, riscv64, s390x, wasm

### Install

```bash
# Linux — extract to /usr/local
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.26.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin

# macOS — use the .pkg installer or Homebrew
brew install go

# Windows — use the MSI installer or winget
winget install GoLang.Go
```

### Verify

```bash
go version
# go version go1.26.0 linux/amd64
```

### Environment Variables

```bash
# GOROOT — Go installation directory (auto-detected)
# GOPATH — Default: ~/go (modules go here)
# GOBIN  — Default: $GOPATH/bin
# GOPROXY — Default: https://proxy.golang.org,direct
# GOSUMDB — Default: sum.golang.org
# GOOS / GOARCH — Cross-compilation targets

# Set module proxy (useful behind firewalls)
go env -w GOPROXY=https://proxy.golang.org,direct
go env -w GOSUMDB=sum.golang.org
go env -w GOPRIVATE=*.corp.example.com
```

## Hello, World

```bash
# Create a module
mkdir hello && cd hello
go mod init example.com/hello
```

```go
// hello.go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

```bash
go run .
# Hello, World!

go build -o hello
./hello
```

## How to Write Go Code

### Module Structure

```
example.com/hello/
├── go.mod
├── go.sum
├── main.go
├── hello/
│   └── hello.go
└── morestring/
    └── morestring.go
```

### Creating a Module

```bash
go mod init example.com/greetings
```

```go
// greetings/greetings.go
package greetings

import "errors"

func Hello(name string) (string, error) {
    if name == "" {
        return "", errors.New("empty name")
    }
    message := "Hi, " + name + "!"
    return message, nil
}
```

### Calling Code from Another Module

```bash
# Replace the module path with a local directory
go mod edit -replace example.com/greetings=../greetings
go mod tidy
```

```go
// main.go
package main

import (
    "fmt"
    "log"
    "example.com/greetings"
)

func main() {
    log.SetFlags(0)
    message, err := greetings.Hello("Gladys")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(message)
}
```

## Tutorials

### Tutorial: Create a Module

Covers functions, error handling, arrays, maps, unit testing, and compiling.

```go
// greetings.go
package greetings

import (
    "errors"
    "fmt"
    "math/rand/v2"
)

func Hello(name string) (string, error) {
    if name == "" {
        return "", errors.New("empty name")
    }
    message := fmt.Sprintf(randomFormat(), name)
    return message, nil
}

func Hellos(names []string) (map[string]string, error) {
    messages := make(map[string]string)
    for _, name := range names {
        message, err := Hello(name)
        if err != nil {
            return nil, err
        }
        messages[name] = message
    }
    return messages, nil
}

func randomFormat() string {
    formats := []string{
        "Hi, %v. Welcome!",
        "Great to see you, %v!",
        "Hail, %v! Well met.",
    }
    return formats[rand.IntN(len(formats))]
}
```

### Tutorial: Getting Started with Generics

```go
package main

import "fmt"

func Sum[T int | float64](values []T) T {
    var sum T
    for _, v := range values {
        sum += v
    }
    return sum
}

func main() {
    fmt.Println(Sum([]int{1, 2, 3}))       // 6
    fmt.Println(Sum([]float64{1.5, 2.5}))  // 4.0
}
```

### Tutorial: Getting Started with Fuzzing

```go
package main

import (
    "fmt"
    "strings"
)

func Reverse(s string) string {
    b := []byte(s)
    for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
        b[i], b[j] = b[j], b[i]
    }
    return string(b)
}

// Fuzz target
func FuzzReverse(f *testing.F) {
    testcases := []string{"Hello", " ", "!12345"}
    for _, tc := range testcases {
        f.Add(tc)
    }
    f.Fuzz(func(t *testing.T, orig string) {
        rev := Reverse(orig)
        doubleRev := Reverse(rev)
        if orig != doubleRev {
            t.Errorf("Before: %q, after double rev: %q", orig, doubleRev)
        }
        if utf8.ValidString(orig) && !utf8.ValidString(rev) {
            t.Errorf("Reverse produced invalid UTF-8: %q", rev)
        }
    })
}
```

### Tutorial: Developing a RESTful API with Go and Gin

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

type album struct {
    ID     string  `json:"id"`
    Title  string  `json:"title"`
    Artist string  `json:"artist"`
    Price  float64 `json:"price"`
}

var albums = []album{
    {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
    {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
}

func getAlbums(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, albums)
}

func postAlbums(c *gin.Context) {
    var newAlbum album
    if err := c.BindJSON(&newAlbum); err != nil {
        return
    }
    albums = append(albums, newAlbum)
    c.IndentedJSON(http.StatusCreated, newAlbum)
}

func getAlbumByID(c *gin.Context) {
    id := c.Param("id"
    for _, a := range albums {
        if a.ID == id {
            c.IndentedJSON(http.StatusOK, a)
            return
        }
    }
    c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}

func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.GET("/albums/:id", getAlbumByID)
    router.POST("/albums", postAlbums)
    router.Run("localhost:8080")
}
```

### Tutorial: Accessing a Database with Go

```go
package main

import (
    "context"
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func main() {
    var err error
    db, err = sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/recordings")
    if err != nil {
        log.Fatal(err)
    }

    // Test connection
    err = db.Ping()
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Connected!")

    // Query
    type Album struct {
        ID     int64
        Title  string
        Artist string
        Price  float32
    }

    rows, err := db.Query("SELECT id, title, artist, price FROM album")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()

    var albums []Album
    for rows.Next() {
        var a Album
        if err := rows.Scan(&a.ID, &a.Title, &a.Artist, &a.Price); err != nil {
            log.Fatal(err)
        }
        albums = append(albums, a)
    }

    for _, a := range albums {
        fmt.Printf("%d: %s by %s ($%.2f)\n", a.ID, a.Title, a.Artist, a.Price)
    }

    // Insert with prepared statement
    newAlbum := Album{Title: "New Album", Artist: "New Artist", Price: 19.99}
    result, err := db.ExecContext(context.Background(),
        "INSERT INTO album (title, artist, price) VALUES (?, ?, ?)",
        newAlbum.Title, newAlbum.Artist, newAlbum.Price)
    if err != nil {
        log.Fatal(err)
    }
    id, _ := result.LastInsertId()
    fmt.Printf("Inserted album ID: %d\n", id)
}
```

## Multi-Module Workspaces

```bash
# Create a workspace
mkdir workspace && cd workspace
go work init ./hello
go work use ./example
```

```go
// go.work file
go 1.26.0

use (
    ./hello
    ./example
)
```

```bash
# Run from workspace
go run example.com/hello

# Add more modules to workspace
go work use ./another-module

# Sync workspace
go work sync
```

## A Tour of Go

Interactive tour at https://go.dev/tour/ covering:
1. **Basics** — syntax, data structures, control flow
2. **Methods and Interfaces** — methods, interfaces, type assertions, type switches
3. **Generics** — type parameters, constraints, type inference
4. **Concurrency** — goroutines, channels, select, sync.WaitGroup

Install locally:
```bash
go install golang.org/x/website/tour@latest
tour
```

## Writing Web Applications

Building a simple wiki web application:

```go
package main

import (
    "html/template"
    "log"
    "net/http"
    "os"
)

type Page struct {
    Title string
    Body  []byte
}

func (p *Page) save() error {
    filename := p.Title + ".txt"
    return os.WriteFile(filename, p.Body, 0600)
}

func loadPage(title string) (*Page, error) {
    filename := title + ".txt"
    body, err := os.ReadFile(filename)
    if err != nil {
        return nil, err
    }
    return &Page{Title: title, Body: body}, nil
}

var templates = template.Must(template.ParseFiles("edit.html", "view.html"))

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
    err := templates.ExecuteTemplate(w, tmpl+".html", p)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
    title := r.URL.Path[len("/view/"):]
    p, err := loadPage(title)
    if err != nil {
        http.Redirect(w, r, "/edit/"+title, http.StatusFound)
        return
    }
    renderTemplate(w, "view", p)
}

func main() {
    http.HandleFunc("/view/", viewHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```
