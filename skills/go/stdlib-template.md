# Standard Library: Templates, Text, Media — Go 1.26

## text/template

```go
import "text/template"

// Parse and execute
tmpl := template.Must(template.New("test").Parse("Hello, {{.Name}}!"))
err := tmpl.Execute(os.Stdout, struct{ Name string }{"Alice"})
// Hello, Alice!

// Template with multiple named templates
tmpl := template.Must(template.New("base").Parse(`
{{define "header"}}Header{{end}}
{{define "content"}}Content{{end}}
{{template "header"}}
{{template "content"}}
`))
tmpl.Execute(os.Stdout, nil)

// Parse from files
tmpl, err := template.ParseFiles("header.tmpl", "footer.tmpl")
tmpl, err := template.ParseGlob("templates/*.tmpl")

// Execute specific template
err := tmpl.ExecuteTemplate(os.Stdout, "header", data)

### Actions

```
{{.}}              — the value itself
{{.Field}}         — field access
{{.Method}}        — method call
{{.MapKey}}        — map key access
{{if .Cond}}...{{end}}
{{if .Cond}}...{{else}}...{{end}}
{{range .Items}}...{{end}}
{{range .Items}}...{{else}}empty{{end}}
{{template "name" .Data}}
{{with .Value}}...{{end}}
{{define "name"}}...{{end}}
{{block "name" .Data}}...{{end}}
```

### Functions

```go
// Built-in functions
// {{len .}} — length
// {{printf "%d" .}} — formatted print
// {{index .Map "key"}} — index into map/slice
// {{slice .Slice 1 3}} — slice operation

// Custom functions
funcMap := template.FuncMap{
    "upper": strings.ToUpper,
    "repeat": func(s string, n int) string { return strings.Repeat(s, n) },
}

tmpl := template.New("test").Funcs(funcMap)
tmpl.Parse(`{{upper .Name}} {{repeat "*" 3}}`)
tmpl.Execute(os.Stdout, struct{ Name string }{"hello"})
// HELLO ***
```

### Pipelines

```
{{.Name | upper}}                    — pipe to function
{{.Name | printf "%q"}}              — pipe to printf
{{printf "%d" .Count | upper}}       — chain
{{if eq .Type "admin"}}...{{end}}    — comparison
{{and .A .B}}                        — logical
{{or .A .B}}
{{not .A}}
```

### Variables

```
{{$x := .Value}}
{{$x}}
{{$x = "new value"}}
{{range $i, $v := .Items}}{{$i}}: {{$v}}{{end}}
```

### Comparison

```
{{eq .A .B}}   — equal
{{ne .A .B}}   — not equal
{{lt .A .B}}   — less than
{{le .A .B}}   — less than or equal
{{gt .A .B}}   — greater than
{{ge .A .B}}   — greater than or equal
```

## html/template

```go
import "html/template"

// Same API as text/template but with HTML auto-escaping
tmpl := template.Must(template.New("page").Parse(`
<h1>{{.Title}}</h1>
<p>{{.Body}}</p>
<ul>
{{range .Items}}
  <li>{{.}}</li>
{{end}}
</ul>
`))

type Page struct {
    Title string
    Body  string
    Items []string
}

tmpl.Execute(os.Stdout, Page{
    Title: "Hello",
    Body:  "<b>World</b>",  // auto-escaped
    Items: []string{"a", "b"},
})

// Auto-escaping context:
// HTML: <b> → &lt;b&gt;
// HTML attribute: quotes escaped
// URL: query parameters escaped
// JS: string escaped
// CSS: string escaped

// SafeHTML — bypass escaping (use with caution)
tmpl.Funcs(template.FuncMap{
    "safe": func(s string) template.HTML { return template.HTML(s) },
})

// Parse files
tmpl, err := template.ParseFiles("layout.html", "content.html")
tmpl, err := template.ParseGlob("templates/*.html")

// Template inheritance with clone
base := template.Must(template.ParseFiles("base.html"))
derived, _ := base.Clone()
derived.Parse(`{{define "content"}}custom{{end}}`)
```

## text/scanner

```go
import "text/scanner"

var s scanner.Scanner
s.Init(strings.NewReader("hello 42 'world'"))

for tok := s.Scan(); tok != scanner.EOF; tok = s.Scan() {
    fmt.Printf("%s: %s\n", s.Position, s.TokenText())
}
// :1:1: hello
// :1:7: 42
// :1:10: 'world'

// Modes
s.Mode = scanner.ScanIdents | scanner.ScanInts | scanner.ScanStrings

// Custom whitespace
s.Whitespace = 1 << ' ' | 1 << '\t' | 1 << '\n'
```

## text/tabwriter

```go
import "text/tabwriter"

// Aligned text output
w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
fmt.Fprintln(w, "Name\tAge\tCity")
fmt.Fprintln(w, "Alice\t30\tNYC")
fmt.Fprintln(w, "Bob\t25\tLA")
w.Flush()
// Name  Age  City
// Alice 30   NYC
// Bob   25   LA

// Parameters: minwidth, tabwidth, padding, padchar, flags
w := tabwriter.NewWriter(os.Stdout, 8, 8, 1, '\t', 0)
```

## html

```go
import "html"

// Escape/unescape
html.EscapeString("<script>alert('xss')</script>")
// &lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;

html.UnescapeString("&lt;b&gt;hello&lt;/b&gt;")
// <b>hello</b>
```

## mime

```go
import "mime"

// MIME type detection
typ := mime.TypeByExtension(".json")  // "application/json"
typ := mime.TypeByExtension(".html")  // "text/html; charset=utf-8"

// Extension from MIME type
exts, _ := mime.ExtensionsByType("image/png")  // [".png"]

// Add custom type
mime.AddExtensionType(".xyz", "application/x-custom")

// Parse media type
mediatype, params, err := mime.ParseMediaType("text/html; charset=utf-8")
// mediatype: "text/html", params: {"charset": "utf-8"}

// Format media type
s := mime.FormatMediaType("text/html", map[string]string{"charset": "utf-8"})
```

## mime/multipart

```go
import "mime/multipart"

// Read multipart form
r := multipart.NewReader(body, boundary)
for {
    part, err := r.NextPart()
    if err == io.EOF { break }
    if err != nil { log.Fatal(err) }
    
    fmt.Println(part.FormName())  // field name
    fmt.Println(part.FileName())  // filename (if file)
    
    data, _ := io.ReadAll(part)
    fmt.Println(string(data))
}

// Write multipart form
var buf bytes.Buffer
w := multipart.NewWriter(&buf)

// Add field
fw, _ := w.CreateFormField("name")
fw.Write([]byte("Alice"))

// Add file
fw, _ = w.CreateFormFile("upload", "file.txt")
fw.Write([]byte("file content"))

w.Close()

// Use in HTTP request
req, _ := http.NewRequest("POST", url, &buf)
req.Header.Set("Content-Type", w.FormDataContentType())
```

## image

```go
import (
    "image"
    "image/color"
    "image/draw"
)

// Create image
img := image.NewRGBA(image.Rect(0, 0, 100, 100))

// Set pixel
img.Set(50, 50, color.RGBA{255, 0, 0, 255})

// Fill
draw.Draw(img, img.Bounds(), &image.Uniform{color.White}, image.Point{}, draw.Src)

// Draw image onto image
draw.Draw(dst, dst.Bounds(), src, image.Point{0, 0}, draw.Over)

// Color models
color.RGBA{R: 255, G: 0, B: 0, A: 255}
color.NRGBA{R: 255, G: 0, B: 0, A: 255}
color.Alpha{A: 128}
color.Gray{Y: 128}

// Image types
image.NewRGBA(rect)
image.NewGray(rect)
image.NewAlpha(rect)
image.NewNRGBA(rect)

// Bounds and dimensions
img.Bounds()  // image.Rectangle
img.Bounds().Dx()  // width
img.Bounds().Dy()  // height

// At — get pixel
c := img.At(x, y)
```

## image/jpeg

```go
import "image/jpeg"

// Encode
f, _ := os.Create("output.jpg")
jpeg.Encode(f, img, &jpeg.Options{Quality: 90})
f.Close()

// Decode
f, _ := os.Open("input.jpg")
img, _ := jpeg.Decode(f)
f.Close()

// Decode config (without full decode)
cfg, _ := jpeg.DecodeConfig(f)
cfg.Width
cfg.Height
```

## image/png

```go
import "image/png"

// Encode
f, _ := os.Create("output.png")
png.Encode(f, img)
f.Close()

// Encode with encoder
enc := png.Encoder{CompressionLevel: png.BestCompression}
enc.Encode(f, img)

// Decode
f, _ := os.Open("input.png")
img, _ := png.Decode(f)
f.Close()

// Decode config
cfg, _ := png.DecodeConfig(f)
```

## image/gif

```go
import "image/gif"

// Encode single frame
f, _ := os.Create("output.gif")
gif.Encode(f, img, &gif.Options{NumColors: 256})
f.Close()

// Encode animated GIF
var images []*image.Paletted
var delays []int
for i := 0; i < 10; i++ {
    // create frame
    images = append(images, frame)
    delays = append(delays, 100) // 100ms per frame
}

gif.EncodeAll(f, &gif.GIF{
    Image: images,
    Delay: delays,
    LoopCount: 0, // 0 = loop forever
})

// Decode
f, _ := os.Open("input.gif")
img, _ := gif.Decode(f)

// Decode all frames
g, _ := gif.DecodeAll(f)
for i, frame := range g.Image {
    // process frame
}
```

## image/color

```go
import "image/color"

// Color types
color.RGBA{255, 0, 0, 255}      // Red
color.NRGBA{255, 0, 0, 255}     // Non-premultiplied alpha
color.Alpha{128}                // Alpha only
color.Gray{128}                 // Grayscale
color.Gray16{32768}             // 16-bit grayscale
color.RGBA64{65535, 0, 0, 65535} // 16-bit per channel

// Color conversion
r, g, b, a := color.RGBA{255, 128, 64, 255}.RGBA()
// Returns 16-bit values (0-65535)

// Palette
palette := color.Palette{
    color.RGBA{255, 0, 0, 255},
    color.RGBA{0, 255, 0, 255},
    color.RGBA{0, 0, 255, 255},
}
c := palette.Convert(color.White)  // nearest color

// Standard colors
color.White
color.Black
color.Transparent
color.Opaque
```

## image/color/palette

```go
import "image/color/palette"

// Standard palettes
palette.Plan9  // 256-color Plan 9 palette
palette.WebSafe // 216 web-safe colors
```

## image/draw

```go
import "image/draw"

// Draw operations
draw.Src  // replace
draw.Over // alpha blend

// Draw
draw.Draw(dst, dst.Bounds(), src, image.Point{0, 0}, draw.Over)

// Draw with mask
draw.DrawMask(dst, dst.Bounds(), src, image.Point{0, 0}, mask, image.Point{0, 0}, draw.Over)

// Scaling
draw.CatmullRom.Scale(dst, dst.Bounds(), src, src.Bounds(), draw.Over, nil)
draw.NearestNeighbor.Scale(dst, dst.Bounds(), src, src.Bounds(), draw.Over, nil)
draw.ApproxBiLinear.Scale(dst, dst.Bounds(), src, src.Bounds(), draw.Over, nil)
```

## mime/quotedprintable

```go
import "mime/quotedprintable"

// Quoted-Printable encoding (RFC 2045) — used in email

// Encode
var buf bytes.Buffer
w := quotedprintable.NewWriter(&buf)
w.Write([]byte("Hello, World!"))
w.Close()

// Decode
r := quotedprintable.NewReader(strings.NewReader("Hello=20World"))
data, _ := io.ReadAll(r)
fmt.Println(string(data))  // "Hello World"
```

## image/font

```go
import (
    "image/font"
    "image/font/basicfont"
    "image/font/sfnt"
    "golang.org/x/image/font/gofont/goregular"  // or use image/font/gofont
)

// font.Face — drawable font face
// font.Drawer — draws text onto an image

// Draw text using basic font
drawer := &font.Drawer{
    Dst:  img,
    Src:  image.NewUniform(color.Black),
    Face: basicfont.Face7x13,
    Dot:  fixed.Point26_6{X: 10 << 6, Y: 30 << 6},
}
drawer.DrawString("Hello, World!")

// Measure string
advance := drawer.MeasureString("Hello")
fmt.Println(advance)  // fixed.Int26_6

// font.Face interface
type Face interface {
    Close() error
    Glyph(dot fixed.Point26_6, r rune) (dr image.Rectangle, mask image.Image, maskp image.Point, advance fixed.Int26_6, ok bool)
    GlyphBounds(r rune) (bounds fixed.Rectangle26_6, advance fixed.Int26_6, ok bool)
    GlyphAdvance(r rune) (advance fixed.Int26_6, ok bool)
    Kern(r0, r1 rune) fixed.Int26_6
    Metrics() Metrics
}
```

## image/font/sfnt

```go
import "image/font/sfnt"

// Parse TrueType/OpenType fonts
fontData, _ := os.ReadFile("font.ttf")
f, err := sfnt.Parse(fontData)

// Create font face with options
face, err := sfnt.NewFace(f, &sfnt.Options{
    Size:    12,        // point size
    DPI:     72,        // dots per inch
    Hinting: font.HintingFull,
})

// Use with font.Drawer
drawer := &font.Drawer{
    Dst:  img,
    Src:  image.NewUniform(color.Black),
    Face: face,
    Dot:  fixed.Point26_6{X: 0, Y: 12 << 6},
}
drawer.DrawString("Hello")

// Font properties
f.Name(sfnt.NameIDFamily)      // "Arial"
f.Name(sfnt.NameIDSubfamily)   // "Regular"
f.UnitsPerEm()                 // 2048

// Close
face.Close()
```

## image/font/gofont

```go
import (
    "image/font"
    "image/font/sfnt"
    "image/font/gofont/goregular"
    "image/font/gofont/gobold"
    "image/font/gofont/goitalic"
    "image/font/gofont/gomono"
    "image/font/gofont/gosmallcaps"
)

// Go fonts — embedded in binary
// goregular, gobold, goitalic, gomono, gosmallcaps, gomedium, gomediumitalic

// Parse embedded Go font
f, _ := sfnt.Parse(goregular.TTF)
face, _ := sfnt.NewFace(f, &sfnt.Options{Size: 16})

drawer := &font.Drawer{
    Dst:  img,
    Src:  image.NewUniform(color.Black),
    Face: face,
    Dot:  fixed.Point26_6{X: 0, Y: 16 << 6},
}
drawer.DrawString("Go fonts!")
face.Close()
```
