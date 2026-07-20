# Standard Library: IO & OS — Go 1.26

## io

```go
import "io"

// Core interfaces
type Reader interface { Read(p []byte) (n int, err error) }
type Writer interface { Write(p []byte) (n int, err error) }
type Closer interface { Close() error }
type Seeker interface { Seek(offset int64, whence int) (int64, error) }
type ReadWriter interface { Reader; Writer }
type ReadCloser interface { Reader; Closer }
type WriteCloser interface { Writer; Closer }
type ReadWriteCloser interface { Reader; Writer; Closer }
type ReadSeeker interface { Reader; Seeker }
type ReaderAt interface { ReadAt(p []byte, off int64) (n int, err error) }
type WriterAt interface { WriteAt(p []byte, off int64) (n int, err error) }
type ReaderFrom interface { ReadFrom(r Reader) (n int64, err error) }
type WriterTo interface { WriteTo(w Writer) (n int64, err error) }

// Copy — copy from Reader to Writer
n, err := io.Copy(dst, src)
n, err := io.CopyN(dst, src, 1024)  // copy at most N bytes

// ReadAll — read everything
data, err := io.ReadAll(r)

// ReadFull — read exactly N bytes
n, err := io.ReadFull(r, buf)

// LimitReader — wrap Reader with max bytes
r = io.LimitReader(r, 1024)

// MultiReader — concatenate readers
r := io.MultiReader(r1, r2, r3)

// MultiWriter — write to multiple writers
w := io.MultiWriter(w1, w2, w3)

// TeeReader — read and duplicate
r := io.TeeReader(src, logWriter)

// Pipe — synchronous in-memory pipe
r, w := io.Pipe()
go func() {
    w.Write([]byte("hello"))
    w.Close()
}()
data, _ := io.ReadAll(r)

// Discard — null writer
io.Copy(io.Discard, r)

// EOF
if err == io.EOF { }  // end of file
```

## io/fs

```go
import "io/fs"

// FS interface — file system
type FS interface { Open(name string) (File, error) }
type File interface {
    Stat() (FileInfo, error)
    Read([]byte) (int, error)
    Close() error
}

// FileInfo
type FileInfo interface {
    Name() string
    Size() int64
    Mode() FileMode
    ModTime() time.Time
    IsDir() bool
    Sys() any
}

// DirEntry
type DirEntry interface {
    Name() string
    IsDir() bool
    Type() FileMode
    Info() (FileInfo, error)
}

// WalkDir — traverse directory tree
err := fs.WalkDir(fsys, ".", func(path string, d fs.DirEntry, err error) error {
    if err != nil {
        return err
    }
    fmt.Println(path, d.IsDir())
    return nil
})

// ReadDir — list directory
entries, err := fs.ReadDir(fsys, ".")

// Stat — get file info
info, err := fs.Stat(fsys, "file.txt")

// Sub — create sub-filesystem
sub, err := fs.Sub(fsys, "subdir")

// ValidPath — check if path is valid
ok := fs.ValidPath("dir/file.txt")
```

## os

```go
import "os"

// File operations
f, err := os.Open("file.txt")           // read-only
f, err := os.OpenFile("file.txt", os.O_RDWR|os.O_CREATE, 0644)
f, err := os.Create("new.txt")          // create/truncate
f, err := os.CreateTemp("", "prefix-")  // temp file
defer f.Close()

data, err := os.ReadFile("file.txt")    // read entire file
err := os.WriteFile("file.txt", data, 0644)  // write entire file

// File methods
buf := make([]byte, 1024)
n, err := f.Read(buf)
n, err := f.Write([]byte("hello"))
n, err := f.WriteString("hello")
n, err := f.WriteAt([]byte("X"), 5)  // write at offset
n, err := f.ReadAt(buf, 10)          // read at offset
off, err := f.Seek(0, io.SeekStart)  // seek
info, err := f.Stat()

// Directory
entries, err := os.ReadDir(".")
err := os.Mkdir("newdir", 0755)
err := os.MkdirAll("a/b/c", 0755)
err := os.Remove("file.txt")
err := os.RemoveAll("dir")
err := os.Rename("old", "new")
err := os.Chmod("file.txt", 0644)
err := os.Chown("file.txt", uid, gid)

// File info
info, err := os.Stat("file.txt")
info.Name()        // "file.txt"
info.Size()        // bytes
info.Mode()        // os.FileMode
info.ModTime()     // time.Time
info.IsDir()       // bool

// Environment
os.Getenv("HOME")
os.Setenv("KEY", "value")
os.Unsetenv("KEY")
os.LookupEnv("KEY")  // value, found
os.Environ()          // []string of "KEY=VALUE"

// Args
os.Args            // []string, first is program name

// Exit
os.Exit(0)

// Stdin, Stdout, Stderr
os.Stdin  // *os.File
os.Stdout
os.Stderr

// Hostname
name, err := os.Hostname()

// User
user, err := os.UserHomeDir()
user, err := os.UserConfigDir()
user, err := os.UserCacheDir()
user, err := os.UserConfigDir()

// Executable
path, err := os.Executable()

// Signals
sig := make(chan os.Signal, 1)
signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
```

## path/filepath

```go
import "path/filepath"

// Join — platform-specific path joining
p := filepath.Join("dir", "subdir", "file.txt")  // "dir/subdir/file.txt" (Unix)

// Clean — normalize path
p := filepath.Clean("dir/../dir/./file.txt")  // "dir/file.txt"

// Dir / Base / Ext
filepath.Dir("dir/file.txt")   // "dir"
filepath.Base("dir/file.txt")  // "file.txt"
filepath.Ext("file.txt")       // ".txt"

// Split
dir, file := filepath.Split("dir/file.txt")  // "dir/", "file.txt"

// Abs
abs, err := filepath.Abs("relative/path")

// Rel
rel, err := filepath.Rel("/a/b", "/a/b/c/d")  // "c/d"

// Exists (no direct function — use os.Stat)
func exists(path string) bool {
    _, err := os.Stat(path)
    return !os.IsNotExist(err)
}

// Walk — traverse directory tree
err := filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
    if err != nil {
        return err
    }
    fmt.Println(path, info.Size())
    return nil
})

// WalkDir — faster, uses DirEntry
err := filepath.WalkDir(".", func(path string, d fs.DirEntry, err error) error {
    // ...
    return nil
})

// Glob — pattern matching
matches, err := filepath.Glob("*.go")

// Match — test pattern
matched, err := filepath.Match("*.go", "main.go")  // true

// Base name without extension
name := strings.TrimSuffix(filepath.Base(path), filepath.Ext(path))

// VolumeName (Windows)
vol := filepath.VolumeName("C:\\dir\\file")  // "C:"

// ToSlash / FromSlash
filepath.ToSlash("dir\\file")    // "dir/file"
filepath.FromSlash("dir/file")   // "dir\\file" (Windows)

// SplitList — split PATH-like string
paths := filepath.SplitList("/usr/bin:/usr/local/bin")

// EvalSymlinks
real, err := filepath.EvalSymlinks("link")
```

## embed

```go
import "embed"

// Embed files at compile time
//go:embed images/logo.png
var logo []byte

//go:embed templates/*.html
var templates embed.FS

//go:embed static
var staticFS embed.FS

// Use embedded FS
data, err := staticFS.ReadFile("static/index.html")
entries, err := staticFS.ReadDir("static")

// Embed as string
//go:embed schema.sql
var schema string

// Embed multiple files
//go:embed images templates static
var assets embed.FS
```

## archive/tar

```go
import "archive/tar"

// Create tar archive
var buf bytes.Buffer
tw := tar.NewWriter(&buf)

hdr := &tar.Header{
    Name: "file.txt",
    Mode: 0644,
    Size: int64(len(data)),
}
tw.WriteHeader(hdr)
tw.Write(data)
tw.Close()

// Read tar archive
tr := tar.NewReader(&buf)
for {
    hdr, err := tr.Next()
    if err == io.EOF { break }
    if err != nil { log.Fatal(err) }
    fmt.Printf("%s (%d bytes)\n", hdr.Name, hdr.Size)
    io.Copy(os.Stdout, tr)
}
```

## archive/zip

```go
import "archive/zip"

// Create zip archive
zipFile, _ := os.Create("archive.zip")
defer zipFile.Close()
zw := zip.NewWriter(zipFile)

w, _ := zw.Create("file.txt")
w.Write([]byte("hello"))

w2, _ := zw.Create("dir/file2.txt")
w2.Write([]byte("world"))
zw.Close()

// Read zip archive
r, _ := zip.OpenReader("archive.zip")
defer r.Close()

for _, f := range r.File {
    fmt.Printf("%s (%d bytes)\n", f.Name, f.UncompressedSize64)
    rc, _ := f.Open()
    io.Copy(os.Stdout, rc)
    rc.Close()
}

// Create with compression level
zw := zip.NewWriter(zipFile)
w, _ := zw.CreateHeader(&zip.FileHeader{
    Name:   "file.txt",
    Method: zip.Deflate,
})
```

## compress/gzip

```go
import "compress/gzip"

// Write gzip
f, _ := os.Create("file.gz")
w := gzip.NewWriter(f)
w.Write([]byte("hello"))
w.Close()
f.Close()

// Read gzip
f, _ := os.Open("file.gz")
r, _ := gzip.NewReader(f)
defer r.Close()
data, _ := io.ReadAll(r)

// With compression level
w, _ := gzip.NewWriterLevel(f, gzip.BestCompression)
// Levels: BestSpeed(1) to BestCompression(9), DefaultCompression(-1)
```

## compress/zlib

```go
import "compress/zlib"

// Similar to gzip but without file headers
var buf bytes.Buffer
w := zlib.NewWriter(&buf)
w.Write([]byte("hello"))
w.Close()

r, _ := zlib.NewReader(&buf)
data, _ := io.ReadAll(r)
r.Close()
```

## compress/flate

```go
import "compress/flate"

// Low-level DEFLATE compression
var buf bytes.Buffer
w, _ := flate.NewWriter(&buf, flate.BestCompression)
w.Write([]byte("hello"))
w.Close()

r := flate.NewReader(&buf)
data, _ := io.ReadAll(r)
r.Close()
```

## path

```go
import "path"

// path operates on slash-separated paths (URLs, etc.)
// Use path/filepath for OS-specific paths

path.Base("a/b/c")      // "c"
path.Dir("a/b/c")       // "a/b"
path.Ext("file.txt")    // ".txt"
path.Join("a", "b", "c") // "a/b/c"
path.Clean("a/../b/./c") // "b/c"
path.Split("a/b/c")     // "a/b/", "c"
path.Match("*.go", "main.go")  // true
path.IsAbs("/foo")      // true

// Different from path/filepath:
// path always uses forward slashes
// path/filepath uses OS-specific separator
```

## compress/bzip2

```go
import "compress/bzip2"

// Decompress bzip2 data (read-only — no compression)
r := bzip2.NewReader(bzip2Data)
data, err := io.ReadAll(r)
```

## compress/lzw

```go
import "compress/lzw"

// LZW compression (used in GIF, PDF, etc.)

// Compress
var buf bytes.Buffer
w := lzw.NewWriter(&buf, lzw.MSB, 8)
w.Write([]byte("hello"))
w.Close()

// Decompress
r := lzw.NewReader(&buf, lzw.MSB, 8)
data, _ := io.ReadAll(r)
r.Close()

// Order: lzw.MSB (most significant first) or lzw.LSB
// LitWidth: literal width in bits (typically 8)
```
