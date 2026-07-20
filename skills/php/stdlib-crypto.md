# Standard Library: Cryptography

## Hash (Message Digest)

```php
// One-way hashing
$hash = hash('sha256', $data);
$hash = hash('md5', $data);
$hash = hash('sha512', $data);

// HMAC
$hmac = hash_hmac('sha256', $data, $secretKey);

// Hex vs raw binary
$binary = hash('sha256', $data, true); // raw binary
$hex = hash('sha256', $data);          // hex string

// File hashing
$fileHash = hash_file('sha256', 'file.txt');
$fileHmac = hash_hmac_file('sha256', 'file.txt', $key);

// Available algorithms
$algos = hash_algos();
$hmacAlgos = hash_hmac_algos();

// Incremental hashing
$ctx = hash_init('sha256');
hash_update($ctx, 'part1');
hash_update($ctx, 'part2');
$result = hash_final($ctx);

// HashContext object
$ctx = new HashContext('sha256'); // PHP 8.0+
$ctx->update('data');
$hash = $ctx->final();

// Common algorithms
// md5, sha1, sha224, sha256, sha384, sha512, sha512/256
// crc32, crc32b, adler32, fnv1a64
// blake2b, blake2s (if available)
// sha3-224, sha3-256, sha3-512
```

## Password Hashing

```php
// Hash password (auto-salts, uses bcrypt or argon2)
$hash = password_hash('password', PASSWORD_DEFAULT);
$hash = password_hash('password', PASSWORD_BCRYPT, ['cost' => 12]);
$hash = password_hash('password', PASSWORD_ARGON2ID, [
    'memory_cost' => 65536,  // 64MB
    'time_cost'   => 4,       // iterations
    'threads'     => 2,
]);

// Verify
$valid = password_verify('password', $hash);

// Check if needs rehash (e.g., algorithm upgraded)
if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
    $newHash = password_hash('password', PASSWORD_DEFAULT);
}

// Get hash info
$info = password_get_info($hash);
// ['algo' => '2y', 'algoName' => 'bcrypt', 'options' => ['cost' => 10]]

// Constants
PASSWORD_DEFAULT;     // current recommended algorithm
PASSWORD_BCRYPT;      // '2y'
PASSWORD_ARGON2I;     // 'argon2i'
PASSWORD_ARGON2ID;    // 'argon2id'
```

## OpenSSL

```php
// Symmetric encryption
$cipher = 'aes-256-gcm';
$ivLength = openssl_cipher_iv_length($cipher);
$iv = random_bytes($ivLength);
$tag = '';

$encrypted = openssl_encrypt($data, $cipher, $key, OPENSSL_RAW_DATA, $iv, $tag);
$decrypted = openssl_decrypt($encrypted, $cipher, $key, OPENSSL_RAW_DATA, $iv, $tag);

// AES-256-CBC (legacy)
$encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
$decrypted = openssl_decrypt($encrypted, 'aes-256-cbc', $key, 0, $iv);

// Asymmetric key generation
$config = [
    "digest_alg" => "sha512",
    "private_key_bits" => 4096,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
];
$keys = openssl_pkey_new($config);
openssl_pkey_export($keys, $privateKey);
$publicKey = openssl_pkey_get_details($keys)['key'];

// Sign and verify
openssl_sign($data, $signature, $privateKey, OPENSSL_ALGO_SHA256);
$valid = openssl_verify($data, $signature, $publicKey, OPENSSL_ALGO_SHA256);

// RSA encrypt/decrypt
openssl_public_encrypt($data, $encrypted, $publicKey);
openssl_private_decrypt($encrypted, $decrypted, $privateKey);

// X.509 certificates
$cert = openssl_x509_read(file_get_contents('cert.pem'));
$certInfo = openssl_x509_parse(file_get_contents('cert.pem'));

// CSR
$csr = openssl_csr_new($dn, $privateKey, $config);
$cert = openssl_csr_sign($csr, null, $privateKey, 365);

// Key types
OpenSSLAsymmetricKey — returned by openssl_pkey_new()
OpenSSLCertificate — returned by openssl_x509_read()
OpenSSLCertificateSigningRequest — returned by openssl_csr_new()
```

## Sodium (Libsodium)

```php
// Symmetric encryption (authenticated)
$key = sodium_crypto_secretbox_keygen();
$nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
$encrypted = sodium_crypto_secretbox($message, $nonce, $key);
$decrypted = sodium_crypto_secretbox_open($encrypted, $nonce, $key);

// Public-key encryption (anonymous)
$keypair = sodium_crypto_box_keypair();
$publicKey = sodium_crypto_box_publickey($keypair);
$secretKey = sodium_crypto_box_secretkey($keypair);

$encrypted = sodium_crypto_box_seal($message, $publicKey);
$decrypted = sodium_crypto_box_seal_open($encrypted, $keypair);

// Signatures
$keypair = sodium_crypto_sign_keypair();
$publicKey = sodium_crypto_sign_publickey($keypair);
$secretKey = sodium_crypto_sign_secretkey($keypair);

$signature = sodium_crypto_sign_detached($message, $secretKey);
$valid = sodium_crypto_sign_verify_detached($signature, $message, $publicKey);

// Hashing
$hash = sodium_crypto_generichash($message); // BLAKE2b

// Password hashing (Argon2)
$hash = sodium_crypto_pwhash_str('password', SODIUM_CRYPTO_PWHASH_OPSLIMIT_INTERACTIVE, SODIUM_CRYPTO_PWHASH_MEMLIMIT_INTERACTIVE);
$valid = sodium_crypto_pwhash_str_verify($hash, 'password');

// Key derivation
$subKey = sodium_crypto_kdf_derive_from_key(32, 1, 'context', $masterKey);

// Constants
SODIUM_CRYPTO_AEAD_AES256GCM_KEYBYTES;
SODIUM_CRYPTO_SECRETBOX_KEYBYTES;
SODIUM_CRYPTO_SIGN_BYTES;

// Wipe sensitive data from memory
sodium_memzero($sensitiveString);
```

## Mcrypt (Deprecated — removed in PHP 7.2)

Use OpenSSL or Sodium instead.

## Mhash (Deprecated)

Use `hash()` or `hash_hmac()` instead.
