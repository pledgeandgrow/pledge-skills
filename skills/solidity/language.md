# Solidity Language — Types, Operators, Control Structures

## Types

### Value Types

Value types are passed by value (copied). They are stored on the stack.

#### Booleans

```solidity
bool public isActive = true;
```

Operators: `!`, `&&`, `||`, `==`, `!=`. Short-circuit evaluation applies.

#### Integers

```solidity
int public signedInt = -42;     // int256 alias
uint public unsignedInt = 42;   // uint256 alias
uint8 small; int256 big;
```

Sizes: `uint8` to `uint256` in steps of 8. `int8` to `int256` similarly.

**Operators:**
- Comparisons: `<=`, `<`, `==`, `!=`, `>=`, `>`
- Bit: `&`, `|`, `^`, `~`
- Shift: `<<`, `>>`
- Arithmetic: `+`, `-`, `*`, `/`, `%`, `**`

**Range access:**
```solidity
type(uint256).min  // 0
type(uint256).max  // 2**256 - 1
type(int256).min   // -2**255
type(int256).max   // 2**255 - 1
```

**Checked vs Unchecked:** Since 0.8.0, arithmetic reverts on overflow/underflow by default. Use `unchecked { ... }` for wrapping behavior:

```solidity
unchecked {
    result = a - b;  // wraps on underflow
}
```

Division truncates toward zero. Modulo follows the sign of the dividend.

#### Fixed Point Numbers

```solidity
ufixed128x18 fixedValue;  // 128 bits, 18 decimals
fixed128x18 signedFixed;
```

> **Note:** Fixed point numbers are not fully supported. Can be declared but not assigned to or from.

#### Address

```solidity
address public owner;
address payable public treasury;
```

- `address` — 20-byte Ethereum address
- `address payable` — has `transfer()` and `send()` members

**Conversions:**
```solidity
address payable pay = payable(addr);
address addr = pay;  // implicit, allowed
```

**Members:**
- `.balance` (uint256) — balance in Wei
- `.code` (bytes memory) — code at address
- `.codehash` (bytes32) — codehash
- `.transfer(uint256)` — send Wei, reverts on failure (2300 gas, deprecated)
- `.send(uint256) returns (bool)` — send Wei, returns false on failure (2300 gas, deprecated)
- `.call(bytes) returns (bool, bytes)` — low-level CALL, forwards all gas
- `.delegatecall(bytes) returns (bool, bytes)` — low-level DELEGATECALL
- `.staticcall(bytes) returns (bool, bytes)` — low-level STATICCALL

```solidity
// Recommended way to send Ether
(bool success, ) = payable(to).call{value: amount}("");
require(success);
```

#### Contract Types

Every contract defines its own type. Contracts can be explicitly converted to `address` or `address payable` (if they have receive/fallback).

#### Fixed-size Byte Arrays

```solidity
bytes1 a = 0xb5;
bytes32 hash = keccak256(abi.encodePacked(data));
```

Sizes: `bytes1` to `bytes32`. Members: `.length` (read-only).

#### Address Literals

Hexadecimal literals that pass the EIP-55 checksum are treated as `address` type:

```solidity
address addr = 0xdCad3a6d3569DF655070DEd36cb7C636A68E5Ce5;
```

#### Rational and Integer Literals

```solidity
uint256 a = 1234;       // decimal
uint256 b = 0x123;      // hexadecimal
uint256 c = 2e10;       // scientific notation
```

#### String Literals

```solidity
string memory s = "hello";
bytes memory b = "hello";  // stored as bytes
```

Double or single quotes. `\xNN` escapes and `\uNNNN` unicode escapes supported.

#### Unicode Literals

```solidity
string memory emoji = unicode"Hello 😃";
```

#### Hexadecimal Literals

```solidity
bytes32 hexValue = hex"414243";
```

#### Enums

```solidity
enum State { Created, Locked, Inactive }
State public state = State.Created;
```

Enums can be converted to/from uint. First value is default (0).

#### User-defined Value Types

```solidity
type UFixed256x18 is uint256;
```

Wraps an underlying value type. Provides explicit conversion via `UFixed256x18.wrap()` and `UFixed256x18.unwrap()`.

#### Function Types

```solidity
function (uint) external returns (bool) callback;
```

**Visibility:** `internal` (default) or `external`

**Mutability:** `pure`, `view`, `payable`, or default (non-payable)

```solidity
// Internal function type
function(uint) internal returns (uint) internalFn;

// External function type
function(uint) external returns (uint) externalFn;
```

Function types can be assigned, passed as parameters, and returned. External function types are addresses + function selectors.

### Reference Types

Reference types: structs, arrays, mappings. Must specify **data location**.

#### Data Locations

- **`storage`** — Persistent, contract-level. Lifetime = contract lifetime.
- **`memory`** — Temporary, function-level. Lifetime = function call.
- **`calldata`** — Read-only, external function parameters. Lifetime = transaction.

```solidity
uint[] memory tempArray = new uint[](10);
uint[] storage persistentArray = storedArray;
```

**Assignment rules:**
- `storage` → `storage`: reference (no copy)
- `memory` → `memory`: reference (no copy)
- `storage` → `memory`: copy
- `memory` → `storage`: copy
- `calldata` → anything: copy

#### Arrays

```solidity
// Fixed-size
uint[5] fixedArray;

// Dynamic
uint[] dynamicArray;

// Array of arrays
uint[][] nestedArray;

// Initialize
uint[] memory arr = new uint[](5);
```

**Members:**
- `.length` — number of elements
- `.push(element)` — append (dynamic arrays)
- `.push()` — append zero-initialized element, returns reference
- `.pop()` — remove last element
- Array slices (calldata only): `arr[start:end]`

```solidity
uint[] public arr;
arr.push(1);
arr.push(2);
arr.pop();       // removes 2
uint len = arr.length;  // 1
```

#### Structs

```solidity
struct Voter {
    uint weight;
    bool voted;
    address delegate;
    uint vote;
}

Voter voter = Voter({weight: 1, voted: false, delegate: address(0), vote: 0});
```

### Mapping Types

```solidity
mapping(address => uint) public balances;
mapping(address => mapping(address => uint)) allowances;
mapping(address user => uint balance) public namedBalances;
```

- Key types: any built-in value type, `bytes`, `string`, contract, enum
- Value types: any type including mappings, arrays, structs
- Only `storage` data location
- No length, no iteration, no enumeration
- Cannot be erased without extra information

```solidity
// Iterable mapping pattern
mapping(address => uint) balances;
address[] users;
mapping(address => bool) isUser;

function addUser(address user) public {
    if (!isUser[user]) {
        users.push(user);
        isUser[user] = true;
    }
}
```

### Operators

#### Order of Precedence (highest to lowest)

1. `++`, `--`, `~`, `delete`, `!` (unary)
2. `**`
3. `*`, `/`, `%`
4. `+`, `-`
5. `<<`, `>>`
6. `&`
7. `^`
8. `|`
9. `<`, `<=`, `==`, `!=`, `>=`, `>`
10. `&&`
11. `||`
12. ternary `? :`
13. assignment `=`, `+=`, `-=`, etc.

#### delete

```solidity
delete arr[0];       // sets to default value (0)
delete myStruct;     // sets all members to default
delete myMapping[key]; // sets value to default (only for non-mapping values)
```

### Conversions

#### Implicit Conversions

Allowed if no information is lost and semantics are preserved:

```solidity
uint8 a = 1;
uint256 b = a;  // implicit, uint8 → uint256
address payable ap;
address addr = ap;  // implicit
```

#### Explicit Conversions

```solidity
int256 x = int256(uint256(y));
address addr = address(uint160(uint256(bytes32(hash))));
bytes32 b = bytes32(uint256(x));
```

## Units and Globally Available Variables

### Ether Units

```solidity
assert(1 wei == 1);
assert(1 gwei == 1e9);
assert(1 ether == 1e18);
```

### Time Units

```solidity
assert(1 seconds == 1);
assert(1 minutes == 60 seconds);
assert(1 hours == 60 minutes);
assert(1 days == 24 hours);
assert(1 weeks == 7 days);
```

> `years` was removed in 0.5.0 due to leap year complications.

### Block and Transaction Properties

| Property | Type | Description |
|----------|------|-------------|
| `blockhash(uint)` | bytes32 | Hash of given block (last 256) |
| `blobhash(uint)` | bytes32 | Versioned hash of blob at index |
| `block.basefee` | uint | Current block base fee |
| `block.blobbasefee` | uint | Current block blob base fee |
| `block.chainid` | uint | Current chain ID |
| `block.coinbase` | address payable | Miner's address |
| `block.difficulty` | uint | Difficulty (EVM < Paris) / deprecated alias |
| `block.gaslimit` | uint | Block gas limit |
| `block.number` | uint | Block number |
| `block.prevrandao` | uint | Random from beacon chain (EVM >= Paris) |
| `block.timestamp` | uint | Timestamp (seconds since epoch) |
| `gasleft()` | uint256 | Remaining gas |
| `msg.data` | bytes calldata | Complete calldata |
| `msg.sender` | address | Sender of message |
| `msg.sig` | bytes4 | Function identifier (first 4 bytes) |
| `msg.value` | uint | Wei sent with message |
| `tx.gasprice` | uint | Gas price |
| `tx.origin` | address | Transaction originator (full call chain) |

> **Warning:** `msg.sender` and `msg.value` change on every external call. `tx.origin` should never be used for authentication.

### ABI Encoding and Decoding

```solidity
bytes memory encoded = abi.encode(a, b, c);
bytes memory packed = abi.encodePacked(a, b, c);
bytes memory withSelector = abi.encodeWithSelector(selector, a, b);
bytes memory withSig = abi.encodeWithSignature("transfer(address,uint256)", to, amount);
bytes memory withCall = abi.encodeCall(Contract.func, (arg1, arg2));

(uint x, uint y) = abi.decode(data, (uint, uint));
```

### Mathematical and Cryptographic Functions

```solidity
addmod(uint x, uint y, uint k)   // (x + y) % k, arbitrary precision
mulmod(uint x, uint y, uint k)   // (x * y) % k, arbitrary precision
keccak256(bytes memory)          // Keccak-256 hash
sha256(bytes memory)             // SHA-256 hash
ripemd160(bytes memory)          // RIPEMD-160 hash
ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s)  // Recover signer address
erc7201(string memory id)        // ERC-7201 storage namespace base slot
```

### Members of bytes and string

```solidity
bytes.concat(...) returns (bytes memory)
string.concat(...) returns (string memory)
```

### Contract-related

- `this` — current contract instance
- `super` — parent contract in inheritance hierarchy
- `selfdestruct(address payable recipient)` — send all Ether and destroy (pre-Cancun)

### Type Information

```solidity
type(Contract).name          // string — contract name
type(Contract).creationCode  // bytes memory — creation bytecode
type(Contract).runtimeCode   // bytes memory — runtime bytecode
type(Interface).interfaceId  // bytes4 — EIP-165 interface ID
type(uint256).min            // 0
type(uint256).max            // 2**256 - 1
```

## Control Structures

### Available Structures

`if`, `else`, `while`, `do`, `for`, `break`, `continue`, `return`, `try`/`catch`

> No type conversion from non-boolean to boolean. `if (1)` is invalid.

### Function Calls

**Internal calls** — JUMP within the same contract:
```solidity
result = internalFunction(arg);
```

**External calls** — Message call to another contract:
```solidity
(bool success, bytes memory data) = target.call(abi.encodeWithSignature("func(uint256)", arg));
```

### Named Parameters

```solidity
someFunction({value: 42, recipient: addr});
```

### Creating Contracts via new

```solidity
Contract newContract = new Contract(arg1, arg2);

// Salted creation (CREATE2)
Contract newContract = new Contract{salt: bytes32(0)}(arg1, arg2);
```

### Checked and Unchecked Arithmetic

```solidity
unchecked {
    // Wrapping arithmetic — no overflow/underflow checks
    result = a + b;
}
```

### Error Handling: Assert, Require, Revert

#### assert

```solidity
assert(condition);  // Panic(uint256) if false — for invariants
```

**Panic codes:**
- `0x00` — generic compiler panic
- `0x01` — assert(false)
- `0x11` — arithmetic overflow/underflow
- `0x12` — division/modulo by zero
- `0x21` — enum conversion out of range
- `0x22` — incorrectly encoded storage byte array
- `0x31` — pop() on empty array
- `0x32` — array out-of-bounds access
- `0x41` — too much memory allocated
- `0x51` — uninitialized internal function pointer

#### require

```solidity
require(condition);                           // reverts without data
require(condition, "Error message");          // Error(string)
require(condition, CustomError(args));        // Custom error
```

#### revert

```solidity
revert();                          // revert without data
revert("Error message");           // Error(string)
revert CustomError(args);          // Custom error (preferred — cheaper)
```

#### Custom Errors

```solidity
error InsufficientBalance(uint requested, uint available);

function transfer(address to, uint amount) public {
    if (amount > balances[msg.sender])
        revert InsufficientBalance(amount, balances[msg.sender]);
    // ...
}
```

Custom errors are cheaper than string error messages.

#### try/catch

```solidity
try externalContract.func(arg) returns (uint result) {
    // success
} catch Error(string memory reason) {
    // require/revert with string
} catch Panic(uint errorCode) {
    // assert failure
} catch (bytes memory lowLevelData) {
    // catch-all for custom errors
}
```

Only works for external calls and contract creation.

### Scoping and Declarations

Variables are scoped to the block they are declared in. Default scoping is block-level (not function-level like JavaScript).

```solidity
{
    uint x = 1;
    // x is visible here
}
// x is not visible here
```

### Destructuring Assignments

```solidity
(uint a, uint b, , uint d) = (1, 2, 3, 4);  // skip elements
(a, b) = (b, a);  // swap
```
