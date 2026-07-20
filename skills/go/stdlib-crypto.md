# Standard Library: Crypto — Go 1.26

## crypto

```go
import "crypto"

// Hash interfaces
type Hash uint
crypto.MD5       // crypto.Hash
crypto.SHA1
crypto.SHA224
crypto.SHA256
crypto.SHA384
crypto.SHA512
crypto.SHA512_224
crypto.SHA512_256
crypto.SHA3_224
crypto.SHA3_256
crypto.SHA3_384
crypto.SHA3_512
crypto.MD5SHA1
crypto.BLAKE2s_256
crypto.BLAKE2b_256
crypto.BLAKE2b_384
crypto.BLAKE2b_512

h := crypto.SHA256.New()  // hash.Hash
h.Write([]byte("hello"))
hash := h.Sum(nil)  // []byte

// Available — check if hash is linked
crypto.SHA256.Available()  // true

// Size
crypto.SHA256.Size()  // 32 bytes

// Encapsulator / Decapsulator interfaces (Go 1.26)
// Allow abstract KEM key operations
```

## crypto/aes

```go
import (
    "crypto/aes"
    "crypto/cipher"
)

// New cipher
block, err := aes.NewCipher(key)  // key: 16, 24, or 32 bytes (AES-128/192/256)

// GCM (recommended for most use cases)
gcm, err := cipher.NewGCM(block)
nonce := make([]byte, gcm.NonceSize())
rand.Read(nonce)
ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)
// nonce is prepended to ciphertext

// Decrypt
nonce, ciphertext := ciphertext[:gcm.NonceSize()], ciphertext[gcm.NonceSize():]
plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)

// CTR mode
iv := make([]byte, aes.BlockSize)
rand.Read(iv)
stream := cipher.NewCTR(block, iv)
stream.XORKeyStream(ciphertext, plaintext)

// CBC mode
iv := make([]byte, aes.BlockSize)
mode := cipher.NewCBCEncrypter(block, iv)
mode.CryptBlocks(ciphertext, paddedPlaintext)
```

## crypto/cipher

```go
import "crypto/cipher"

// Block interface
type Block interface {
    BlockSize() int
    Encrypt(dst, src []byte)
    Decrypt(dst, src []byte)
}

// Stream interface
type Stream interface {
    XORKeyStream(dst, src []byte)
}

// AEAD interface
type AEAD interface {
    NonceSize() int
    Overhead() int
    Seal(dst, nonce, plaintext, additionalData []byte) []byte
    Open(dst, nonce, ciphertext, additionalData []byte) ([]byte, error)
}

// GCM with custom nonce size
gcm, err := cipher.NewGCMWithNonceSize(block, 12)

// GCM with tag size
gcm, err := cipher.NewGCMWithTagSize(block, 16)
```

## crypto/ecdsa

```go
import (
    "crypto/ecdsa"
    "crypto/elliptic"
    "crypto/rand"
)

// Generate key
key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)

// Sign
r, s, err := ecdsa.Sign(rand.Reader, key, hash)

// Verify
valid := ecdsa.Verify(&key.PublicKey, hash, r, s)

// ASN.1 encoding
sig, err := ecdsa.SignASN1(rand.Reader, key, hash)
valid := ecdsa.VerifyASN1(&key.PublicKey, hash, sig)

// Go 1.26 — random parameter is now ignored (uses secure source)
// big.Int fields of PublicKey and PrivateKey are deprecated
```

## crypto/ed25519

```go
import (
    "crypto/ed25519"
    "crypto/rand"
)

// Generate key
pub, priv, err := ed25519.GenerateKey(rand.Reader)

// Sign
sig := ed25519.Sign(priv, message)

// Verify
valid := ed25519.Verify(pub, message, sig)

// Go 1.26 — if random is nil, uses secure source (not crypto/rand.Reader)
```

## crypto/rsa

```go
import (
    "crypto/rsa"
    "crypto/rand"
)

// Generate key
key, err := rsa.GenerateKey(rand.Reader, 2048)

// Sign PKCS1v15
hash := sha256.Sum256(message)
sig, err := rsa.SignPKCS1v15(rand.Reader, key, crypto.SHA256, hash[:])

// Verify
err := rsa.VerifyPKCS1v15(&key.PublicKey, crypto.SHA256, hash[:], sig)

// Sign PSS
sig, err := rsa.SignPSS(rand.Reader, key, crypto.SHA256, hash[:], nil)
err := rsa.VerifyPSS(&key.PublicKey, crypto.SHA256, hash[:], sig, nil)

// Encrypt/Decrypt (OAEP — recommended)
ciphertext, err := rsa.EncryptOAEP(sha256.New(), rand.Reader, &key.PublicKey, plaintext, nil)
plaintext, err := rsa.DecryptOAEP(sha256.New(), rand.Reader, key, ciphertext, nil)
```

## crypto/hmac

```go
import (
    "crypto/hmac"
    "crypto/sha256"
)

// Compute HMAC
mac := hmac.New(sha256.New, key)
mac.Write([]byte("message"))
tag := mac.Sum(nil)

// Verify
expected := hmac.New(sha256.New, key)
expected.Write([]byte("message"))
valid := hmac.Equal(tag, expected.Sum(nil))  // constant-time comparison
```

## crypto/sha256 / sha512 / sha1 / md5 / sha3

```go
import (
    "crypto/sha256"
    "crypto/sha512"
    "crypto/sha1"
    "crypto/md5"
    "crypto/sha3"
)

// SHA-256
sum := sha256.Sum256([]byte("hello"))  // [32]byte
sum := sha256.Sum224([]byte("hello"))  // [28]byte

// Streaming
h := sha256.New()
h.Write([]byte("hello"))
h.Write([]byte(" "))
h.Write([]byte("world"))
sum := h.Sum(nil)  // []byte

// SHA-512
sum := sha512.Sum512([]byte("hello"))  // [64]byte
sum := sha512.Sum384([]byte("hello"))

// SHA-1 (deprecated for security — use SHA-256+)
sum := sha1.Sum([]byte("hello"))  // [20]byte

// MD5 (deprecated for security — use SHA-256+)
sum := md5.Sum([]byte("hello"))  // [16]byte

// SHA-3 (Go 1.26)
sum := sha3.Sum256([]byte("hello"))  // [32]byte
sum := sha3.Sum512([]byte("hello"))  // [64]byte
```

## crypto/rand

```go
import "crypto/rand"

// Read random bytes
b := make([]byte, 32)
rand.Read(b)

// Prime
p, err := rand.Prime(rand.Reader, 256)

// Int
n, err := rand.Int(rand.Reader, max)
```

## crypto/tls

```go
import "crypto/tls"

// Dial TLS
conn, err := tls.Dial("tcp", "example.com:443", &tls.Config{
    ServerName:         "example.com",
    MinVersion:         tls.VersionTLS12,
    InsecureSkipVerify: false,  // never true in production
})

// Load certificate
cert, err := tls.LoadX509KeyPair("cert.pem", "key.pem")

// TLS server
ln, err := tls.Listen("tcp", ":443", &tls.Config{
    Certificates: []tls.Certificate{cert},
    MinVersion:   tls.VersionTLS12,
})

// HTTP client with custom TLS
client := &http.Client{
    Transport: &http.Transport{
        TLSClientConfig: &tls.Config{
            MinVersion: tls.VersionTLS12,
            // RootCAs: pool,
        },
    },
}

// X509KeyPair from memory
cert, err := tls.X509KeyPair(certPEM, keyPEM)

// Config options
config := &tls.Config{
    Certificates:     []tls.Certificate{cert},
    MinVersion:       tls.VersionTLS13,
    MaxVersion:       tls.VersionTLS13,
    CipherSuites:     []uint16{tls.TLS_AES_256_GCM_SHA384},
    CurvePreferences: []tls.CurveID{tls.X25519, tls.CurveP256},
    ServerName:       "example.com",
    RootCAs:          certPool,
    ClientCAs:        certPool,
    ClientAuth:       tls.RequireAndVerifyClientCert,
}
```

## crypto/x509

```go
import "crypto/x509"

// Parse certificate
cert, err := x509.ParseCertificate(certDER)

// Parse PEM
block, _ := pem.Decode(certPEM)
cert, err := x509.ParseCertificate(block.Bytes)

// Load system cert pool
pool, err := x509.SystemCertPool()
pool.AddCert(cert)

// Create certificate
template := &x509.Certificate{
    SerialNumber: big.NewInt(1),
    Subject: pkix.Name{
        CommonName:   "example.com",
        Organization: []string{"Example Inc"},
    },
    NotBefore:             time.Now(),
    NotAfter:              time.Now().Add(365 * 24 * time.Hour),
    KeyUsage:              x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
    ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
    DNSNames:              []string{"example.com", "www.example.com"},
    BasicConstraintsValid: true,
}

derBytes, err := x509.CreateCertificate(rand.Reader, template, template, &pub, key)

// Verify certificate
opts := x509.VerifyOptions{
    Roots:         pool,
    DNSName:       "example.com",
    Intermediates: intermediatePool,
}
_, err = cert.Verify(opts)

// Marshal PKCS8 private key
der, err := x509.MarshalPKCS8PrivateKey(key)

// Parse PKCS8
key, err := x509.ParsePKCS8PrivateKey(der)

// PKCS1 (RSA only)
der := x509.MarshalPKCS1PrivateKey(rsaKey)
key, err := x509.ParsePKCS1PrivateKey(der)

// PKIX public key
der, err := x509.MarshalPKIXPublicKey(pub)
pub, err := x509.ParsePKIXPublicKey(der)
```

## crypto/hkdf

```go
import "crypto/hkdf"

// HKDF — HMAC-based key derivation
key := make([]byte, 32)
hkdf.New(sha256.New, secret, salt, info).Read(key)
```

## crypto/pbkdf2

```go
import "crypto/pbkdf2"

// PBKDF2 — password-based key derivation
key := pbkdf2.Key(password, salt, 10000, 32, sha256.New)
```

## crypto/hpke (Go 1.26 — New)

```go
import "crypto/hpke"

// Hybrid Public Key Encryption (RFC 9180)
// Supports post-quantum hybrid KEMs

// Setup sender
sender, err := hpke.NewSender(kem, kdf, aead, recipientPubKey, info)

// Seal
ct, err := sender.Seal(aad, plaintext)

// Setup receiver
receiver, err := hpke.NewReceiver(kem, kdf, aead, recipientPrivKey, info)

// Open
plaintext, err := receiver.Open(aad, ct)
```

## crypto/mlkem

```go
import "crypto/mlkem"

// ML-KEM (Module Lattice KEM) — post-quantum key encapsulation

// Generate key pair (768-bit)
decapKey, err := mlkem.GenerateKey768()
encapKey := decapKey.EncapsulationKey()

// Encapsulate
sharedSecret, ciphertext := encapKey.Encapsulate()

// Decapsulate
recoveredSecret, err := decapKey.Decapsulate(ciphertext)
// sharedSecret == recoveredSecret

// 1024-bit variant
decapKey, err := mlkem.GenerateKey1024()
```

## crypto/ecdh

```go
import "crypto/ecdh"

// Generate key pair
priv, err := ecdh.P256().GenerateKey(rand.Reader)
pub := priv.PublicKey()

// ECDH — derive shared secret
theirPub := ecdh.P256().NewPublicKey(theirPubBytes)
sharedSecret, err := priv.ECDH(theirPub)

// Go 1.26 — KeyExchanger interface
// Go 1.26 — random parameter ignored (uses secure source)
```

## crypto/fips140

```go
import "crypto/fips140"

// FIPS 140-3 compliance
// Build with GOFIPS140 to use a frozen module

// Check if FIPS mode is enforced
if fips140.Enabled() {
    // FIPS 140-3 mode is active
}

// Version
v := fips140.Version()

// WithoutEnforcement — run without strict checks
fips140.WithoutEnforcement(func() {
    // non-FIPS crypto operations
})
```

## crypto/subtle

```go
import "crypto/subtle"

// Constant-time comparison
subtle.ConstantTimeCompare(a, b)  // 1 if equal, 0 otherwise

// Constant-time byte comparison
subtle.ConstantTimeByteEq(a, b)  // 1 if equal

// Constant-time int comparison
subtle.ConstantTimeLessOrEq(x, y)  // 1 if x <= y

// XORBytes (constant-time)
subtle.XORBytes(dst, x, y)
```

## crypto/elliptic

```go
import "crypto/elliptic"

// Elliptic curves — used by crypto/ecdsa and crypto/ecdh
curve := elliptic.P256()    // NIST P-256 (secp256r1)
curve := elliptic.P384()    // NIST P-384
curve := elliptic.P521()    // NIST P-521

// Curve params
curve.Params().BitSize  // 256
curve.Params().N        // order
curve.Params().Bx, By   // base point

// Point operations
x, y := curve.Add(x1, y1, x2, y2)       // point addition
x, y := curve.Double(x1, y1)             // point doubling
x, y := curve.ScalarMult(x, y, k)        // k * P
x, y := curve.ScalarBaseMult(k)          // k * G

// IsOnCurve
onCurve := curve.IsOnCurve(x, y)

// Marshal/Unmarshal
data := elliptic.Marshal(curve, x, y)
data := elliptic.MarshalCompressed(curve, x, y)
x, y := elliptic.Unmarshal(curve, data)
x, y := elliptic.UnmarshalCompressed(curve, data)
```

## crypto/dsa

```go
import "crypto/dsa"

// DSA — Digital Signature Algorithm (deprecated, use ECDSA/Ed25519)
// Go 1.26 — random parameter to GenerateKey is now ignored

var priv dsa.PrivateKey
params := &dsa.Parameters{}
dsa.GenerateParameters(params, rand.Reader, dsa.L1024N160)
dsa.GenerateKey(&priv, rand.Reader)

// Sign
r, s, _ := dsa.Sign(rand.Reader, &priv, hash)

// Verify
valid := dsa.Verify(&priv.PublicKey, hash, r, s)
```

## crypto/des

```go
import (
    "crypto/des"
    "crypto/cipher"
)

// DES — Data Encryption Standard (deprecated, use AES)
// 56-bit key — insecure for modern use

block, _ := des.NewCipher(key)  // 8-byte key
// 3DES — Triple DES (168-bit key, more secure)
block, _ := des.NewTripleDESCipher(key)  // 24-byte key

// Use with cipher modes (CBC, CTR, etc.)
iv := make([]byte, des.BlockSize)  // 8 bytes
mode := cipher.NewCBCEncrypter(block, iv)
mode.CryptBlocks(ciphertext, plaintext)
```

## crypto/rc4

```go
import "crypto/rc4"

// RC4 — stream cipher (deprecated, use AES)
// Insecure — do not use in new code

c, _ := rc4.NewCipher(key)  // 1-256 byte key
c.XORKeyStream(dst, src)    // encrypt/decrypt (same operation)
```

## crypto/x509/pkix

```go
import "crypto/x509/pkix"

// PKIX — Public Key Infrastructure (X.509)
// Used for certificate subject/issuer names

name := pkix.Name{
    CommonName:         "example.com",
    Organization:       []string{"Example Inc"},
    OrganizationalUnit: []string{"Engineering"},
    Country:            []string{"US"},
    Province:           []string{"California"},
    Locality:           []string{"San Francisco"},
}

// String representation
fmt.Println(name.String())  // "O=Example Inc,OU=Engineering,..."

// AlgorithmIdentifier
alg := pkix.AlgorithmIdentifier{
    Algorithm: oidSHA256,
}

// Extension
ext := pkix.Extension{
    Id:       oidExtension,
    Critical: false,
    Value:    extValue,
}
```
