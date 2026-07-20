# Standard Library: Encoding — Go 1.26

## encoding/json (v1)

```go
import "encoding/json"

// Marshal — struct to JSON
type Person struct {
    Name  string `json:"name"`
    Age   int    `json:"age"`
    Email string `json:"email,omitempty"`
    Addr  string `json:"-"`
}

p := Person{Name: "Alice", Age: 30}
data, err := json.Marshal(p)
// {"name":"Alice","age":30}

data, err := json.MarshalIndent(p, "", "  ")
// pretty-printed

// Unmarshal — JSON to struct
var p Person
err := json.Unmarshal(data, &p)

// Decode from reader
dec := json.NewDecoder(r)
err := dec.Decode(&p)

// Stream multiple JSON objects
dec := json.NewDecoder(r)
for {
    var msg Message
    if err := dec.Decode(&msg); err == io.EOF {
        break
    } else if err != nil {
        log.Fatal(err)
    }
    process(msg)
}

// Encode to writer
enc := json.NewEncoder(w)
enc.SetIndent("", "  ")
enc.SetEscapeHTML(false)
err := enc.Encode(p)

// RawMessage — defer parsing
var raw json.RawMessage
json.Unmarshal(data, &raw)
// later: json.Unmarshal(raw, &target)

// Marshaler / Unmarshaler interfaces
type MyType struct{ Value int }
func (m MyType) MarshalJSON() ([]byte, error) {
    return json.Marshal(m.Value * 2)
}
func (m *MyType) UnmarshalJSON(data []byte) error {
    return json.Unmarshal(data, &m.Value)
}

// JSONEncoder for non-standard types
import "encoding/json"
json.NewEncoder(w).Encode(map[string]any{
    "time":  time.Now().Format(time.RFC3339),
    "value": 42,
})

// Map to JSON
m := map[string]any{"key": "value", "count": 42}
data, _ := json.Marshal(m)

// Slice of any
data, _ := json.Marshal([]any{1, "two", true, nil})

// Field tags
type Config struct {
    Host     string `json:"host"`
    Port     int    `json:"port"`
    Debug    bool   `json:"debug,omitempty"`
    Secret   string `json:"-"`              // never serialized
    Internal string `json:",omitempty"`     // uses field name
    Raw      json.RawMessage `json:"raw"`   // defer parsing
}
```

## encoding/json/v2 (Go 1.26 — Experimental)

```go
import "encoding/json/v2"

// New experimental JSON v2 with improved API
// Uses jsontext for low-level control

// Marshal
data, err := json.Marshal(v)

// Unmarshal
err := json.Unmarshal(data, &v)

// With options
opts := json.JoinOptions(
    json.Deterministic(true),
    json.OmitZero(true),
    json.WithMarshalers(json.MarshalFunc(func(time.Time) ([]byte, error) {
        return jsontext.AppendValue(nil, time.Now().Format(time.RFC3339)), nil
    })),
)
data, err := json.MarshalWith(v, opts)
```

## encoding/json/jsontext

```go
import "encoding/json/jsontext"

// Low-level JSON encoding/decoding
enc := jsontext.NewEncoder(w)
enc.WriteToken(jsontext.String("hello"))
enc.WriteValue(jsontext.Value(`42`))

dec := jsontext.NewDecoder(r)
tok, err := dec.ReadToken()
val, err := dec.ReadValue()
```

## encoding/xml

```go
import "encoding/xml"

// Marshal
type Person struct {
    XMLName xml.Name `xml:"person"`
    Name    string   `xml:"name"`
    Age     int      `xml:"age"`
    Emails  []string `xml:"emails>email"`
}

p := Person{Name: "Alice", Age: 30, Emails: []string{"a@b.com", "c@d.com"}}
data, err := xml.Marshal(p)
data, err := xml.MarshalIndent(p, "", "  ")
output := xml.Header + string(data)

// Unmarshal
var p Person
err := xml.Unmarshal(data, &p)

// Decoder — streaming
dec := xml.NewDecoder(r)
for {
    t, err := dec.Token()
    if err == io.EOF { break }
    switch se := t.(type) {
    case xml.StartElement:
        // handle element
    case xml.EndElement:
        // handle end
    case xml.CharData:
        // handle text
    }
}

// Encoder
enc := xml.NewEncoder(w)
enc.Encode(p)
enc.Flush()

// Field tags
type Config struct {
    XMLName     xml.Name `xml:"config"`
    Version     string   `xml:"version,attr"`
    Debug       bool     `xml:"debug,attr"`
    Server      string   `xml:"server>host"`
    Port        int      `xml:"server>port"`
    Description string   `xml:",chardata"`
    Comment     string   `xml:",comment"`
}
```

## encoding/base64

```go
import "encoding/base64"

// Standard encoding
s := base64.StdEncoding.EncodeToString([]byte("hello"))
// "aGVsbG8="

data, err := base64.StdEncoding.DecodeString(s)

// URL-safe encoding (uses - and _ instead of + and /)
s := base64.URLEncoding.EncodeToString([]byte("hello"))

// Raw (no padding)
s := base64.RawStdEncoding.EncodeToString([]byte("hello"))
s := base64.RawURLEncoding.EncodeToString([]byte("hello"))

// Custom buffer
dst := make([]byte, base64.StdEncoding.EncodedLen(len(src)))
base64.StdEncoding.Encode(dst, src)

dst := make([]byte, base64.StdEncoding.DecodedLen(len(src)))
n, err := base64.StdEncoding.Decode(dst, src)
```

## encoding/base32

```go
import "encoding/base32"

s := base32.StdEncoding.EncodeToString([]byte("hello"))
// "NBSWY3DP"

data, err := base32.StdEncoding.DecodeString(s)

// Hex (no padding, lowercase)
s := base32.HexEncoding.EncodeToString([]byte("hello"))

// Raw (no padding)
s := base32.RawStdEncoding.EncodeToString([]byte("hello"))
```

## encoding/binary

```go
import "encoding/binary"

// Byte order
var buf [8]byte
binary.LittleEndian.PutUint64(buf[:], 42)
v := binary.LittleEndian.Uint64(buf[:])

binary.BigEndian.PutUint64(buf[:], 42)
v := binary.BigEndian.Uint64(buf[:])

// Write/Read
err := binary.Write(w, binary.LittleEndian, uint32(42))
var u32 uint32
err := binary.Read(r, binary.LittleEndian, &u32)

// Write struct (fixed-size fields only)
type Header struct {
    Magic   uint32
    Version uint16
    Length  uint32
}
err := binary.Write(w, binary.LittleEndian, &Header{Magic: 0x1234, Version: 1, Length: 100})

// Size
n := binary.Size(Header{})  // 10
```

## encoding/csv

```go
import "encoding/csv"

// Read
r := csv.NewReader(strings.NewReader("a,b,c\n1,2,3\n"))
r.Comma = ','
r.Comment = '#'

records, err := r.ReadAll()
// [["a","b","c"], ["1","2","3"]]

// Read line by line
for {
    record, err := r.Read()
    if err == io.EOF { break }
    fmt.Println(record)
}

// Write
var buf bytes.Buffer
w := csv.NewWriter(&buf)
w.Write([]string{"a", "b", "c"})
w.Write([]string{"1", "2", "3"})
w.Flush()
```

## encoding/gob

```go
import "encoding/gob"

// Encode
var buf bytes.Buffer
enc := gob.NewEncoder(&buf)
err := enc.Encode(p)
err := enc.Encode(data)

// Decode
dec := gob.NewDecoder(&buf)
var p Person
err := dec.Decode(&p)

// Register types for interfaces
gob.Register(&MyType{})
```

## encoding/hex

```go
import "encoding/hex"

// Encode
s := hex.EncodeToString([]byte{0x48, 0x65, 0x6c, 0x6c, 0x6f})
// "48656c6c6f"

data, err := hex.DecodeString("48656c6c6f")
// []byte("Hello")

// Dumper
dumper := hex.Dumper(os.Stdout)
dumper.Write([]byte("hello"))
// 00000000  68 65 6c 6c 6f                                    |hello|
```

## encoding/pem

```go
import "encoding/pem"

// Encode
block := &pem.Block{
    Type:  "RSA PRIVATE KEY",
    Bytes: derBytes,
}
var buf bytes.Buffer
pem.Encode(&buf, block)
// -----BEGIN RSA PRIVATE KEY-----
// ...

// Decode
block, rest := pem.Decode(pemData)
block.Type   // "RSA PRIVATE KEY"
block.Bytes  // DER bytes

// Multiple blocks
for {
    block, rest = pem.Decode(rest)
    if block == nil { break }
    process(block)
}
```

## encoding/asn1

```go
import "encoding/asn1"

// Marshal
data, err := asn1.Marshal(42)
data, err := asn1.Marshal("hello")
data, err := asn1.Marshal(struct {
    Version int
    Name    string
}{1, "test"})

// Unmarshal
var n int
err := asn1.Unmarshal(data, &n)

// With parameters
type Certificate struct {
    Version int `asn1:"optional,explicit,default:0,tag:0"`
    Serial  *big.Int
}
```

## encoding (base package)

```go
import "encoding"

// Interfaces implemented by types that can marshal/unmarshal themselves
// to/from text or binary formats.

// TextMarshaler / TextUnmarshaler — used by json, xml, etc.
type TextMarshaler interface {
    MarshalText() (text []byte, err error)
}

type TextUnmarshaler interface {
    UnmarshalText(text []byte) error
}

// BinaryMarshaler / BinaryUnmarshaler — used by gob, etc.
type BinaryMarshaler interface {
    MarshalBinary() (data []byte, err error)
}

type BinaryUnmarshaler interface {
    UnmarshalBinary(data []byte) error
}

// Appender (Go 1.24+) — append-encoded-form-to-slice
type Appender interface {
    AppendAppend(b []byte) ([]byte, error)
}

// Example: custom text marshaling
type Color struct{ R, G, B uint8 }

func (c Color) MarshalText() ([]byte, error) {
    return []byte(fmt.Sprintf("#%02x%02x%02x", c.R, c.G, c.B)), nil
}

func (c *Color) UnmarshalText(text []byte) error {
    s := string(text)
    if len(s) != 7 || s[0] != '#' {
        return fmt.Errorf("invalid color: %s", s)
    }
    _, err := fmt.Sscanf(s, "#%02x%02x%02x", &c.R, &c.G, &c.B)
    return err
}

// Now json.Marshal uses MarshalText instead of struct tags
data, _ := json.Marshal(Color{255, 128, 0})  // "#ff8000"
```
