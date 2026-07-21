# Solidity Advanced — Compiler, Internals, ABI, Yul, SMTChecker

## Using the Compiler

### Command-line Compiler (solc)

```bash
# Basic compilation
solc Contract.sol

# Compile with output
solc --bin Contract.sol
solc --abi Contract.sol
solc --bin --abi --optimize Contract.sol

# Combined JSON output
solc --combined-json bin,abi,devdoc,userdoc Contract.sol

# Standard JSON input/output
solc --standard-json < input.json > output.json
```

### Optimizer Options

```bash
solc --optimize Contract.sol
solc --optimize-runs 200 Contract.sol
```

- `--optimize` — Enable optimizer (default 200 runs)
- `--optimize-runs N` — Number of optimization runs. Lower = smaller bytecode. Higher = more expensive compilation but potentially cheaper runtime.

### Base Path and Import Remapping

```bash
solc Contract.sol --base-path . --include-path node_modules
solc Contract.sol =github.com/OpenZeppelin/openzeppelin-contracts/=lib/openzeppelin-contracts/
```

### Library Linking

```bash
solc Contract.sol --libraries "SafeMath:0x..."
```

### EVM Version Targeting

```bash
solc --evm-version paris Contract.sol
```

| Version | Features |
|---------|----------|
| `homestead` | Basic EVM |
| `tangerineWhistle` | Gas cost changes |
| `spuriousDragon` | Gas cost changes |
| `byzantium` | `staticcall`, `returndatacopy` |
| `constantinople` | `create2`, `bitshift` |
| `petersburg` | Gas cost fix |
| `istanbul` | `chainid`, `selfbalance`, gas changes |
| `berlin` | Gas cost changes |
| `london` | `basefee` (EIP-1559) |
| `paris` | `prevrandao` (EIP-4399, The Merge) |
| `shanghai` | `push0` |
| `cancun` | `blobhash`, `blobbasefee`, transient storage, `mcopy` |

### Compiler Input/Output JSON

**Input:**
```json
{
  "language": "Solidity",
  "sources": {
    "Contract.sol": { "urls": ["./Contract.sol"] }
  },
  "settings": {
    "optimizer": { "enabled": true, "runs": 200 },
    "evmVersion": "paris",
    "outputSelection": {
      "*": { "*": ["abi", "evm.bytecode.object", "devdoc", "userdoc"] }
    }
  }
}
```

**Output:** Contains `contracts`, `sources`, `errors`, and optionally `ast`.

### Experimental Mode

```bash
solc --experimental-via-ir Contract.sol
```

Since Solidity 0.8.13, the IR-based pipeline (`--via-ir`) is available and recommended for complex contracts.

## Internals

### Storage Layout

State variables are packed into storage slots (256-bit words) in order of declaration:

- First variable goes to slot 0
- Multiple variables packed if they fit in 256 bits
- Structs and arrays always start a new slot
- Mappings and dynamic arrays use keccak256 for slot computation

```solidity
contract Layout {
    uint256 a;           // slot 0
    uint128 b;           // slot 1 (packed with c)
    uint128 c;           // slot 1
    uint256[] arr;       // slot 2 (length), data at keccak256(2)
    mapping(uint => uint) m;  // slot 3, values at keccak256(key, 3)
}
```

**Dynamic array element location:** `keccak256(slot) + index`
**Mapping value location:** `keccak256(h(key) . slot)` where `.` is concatenation

### Memory Layout

- `0x00`–`0x3f`: Scratch space (64 bytes)
- `0x40`–`0x5f`: Free memory pointer
- `0x60`–`0x7f`: Zero slot
- `0x80`+: Allocated memory

Memory is expanded in 32-byte increments. Cost grows quadratically.

### The Optimizer

The optimizer operates on:
1. **Opcode-based optimization** — Simplify expressions, constant folding
2. **IR-based optimization** — Full program analysis when using `--via-ir`

`--optimize-runs` controls the tradeoff:
- Low runs (1-10): Smaller bytecode, less optimization for repeated calls
- High runs (200+): Larger bytecode, more optimization for repeated calls
- Default: 200

### Metadata

The compiler embeds a metadata hash in the bytecode. Metadata includes:
- Compiler version
- Source file hashes
- ABI
- NatSpec documentation
- Settings used

Used for source verification (e.g., Etherscan).

### Source Mapping

The compiler provides source mappings in AST output, linking bytecode positions to source file positions. Used for debugging and stack traces.

## ABI Specification

The Contract ABI (Application Binary Interface) is the standard way to interact with contracts from outside the blockchain.

### Function Selector

First 4 bytes of `keccak256("functionName(param1Type,param2Type,...)")`:

```solidity
bytes4 selector = bytes4(keccak256("transfer(address,uint256)"));
// 0xa9059cbb
```

### ABI Encoding

**Basic types:**
- `uint<N>`, `int<N>`, `address`, `bool`, `bytes<N>` — padded to 32 bytes
- Dynamic types (`bytes`, `string`, arrays`) — offset + data
- `tuple`/`struct` — head/tail encoding

**Example encoding:**
```
transfer(address,uint256)
address: 0x000000000000000000000000<20-byte address>
uint256: 0x<32-byte value>
```

### ABI Encoding Variants

- `abi.encode(...)` — Standard ABI encoding (padded)
- `abi.encodePacked(...)` — Packed encoding (no padding, can be ambiguous)
- `abi.encodeWithSelector(selector, ...)` — Selector + standard encoding
- `abi.encodeWithSignature(sig, ...)` — keccak256(sig) → selector + standard encoding
- `abi.encodeCall(fn, (args))` — Type-checked encoding

### Events ABI

Events are encoded as:
- Topic 0: `keccak256("EventName(type1,type2,...)")` (or anonymous events skip this)
- Topic 1-3: Indexed parameters
- Data: Non-indexed parameters (ABI-encoded)

### Errors ABI

Custom errors are encoded similarly to functions:
- Selector: `bytes4(keccak256("ErrorName(type1,type2,...)"))`
- Data: ABI-encoded parameters

## Yul

Yul is an intermediate programming language that compiles to various backends (EVM, eWASM).

### Yul Example

```yul
{
    function power(base, exponent) -> result {
        result := 1
        for { let i := 0 } lt(i, exponent) { i := add(i, 1) } {
            result := mul(result, base)
        }
    }

    let result := power(calldataload(4), calldataload(36))
    mstore(0, result)
    return(0, 32)
}
```

### Yul in Solidity (Inline Assembly)

```solidity
function getAddress() public view returns (address result) {
    assembly {
        result := caller()
    }
}
```

### Yul EVM Instructions

| Instruction | Description |
|-------------|-------------|
| `add(a, b)` | a + b |
| `sub(a, b)` | a - b |
| `mul(a, b)` | a * b |
| `div(a, b)` | a / b |
| `mod(a, b)` | a % b |
| `exp(a, b)` | a ** b |
| `not(a)` | bitwise NOT |
| `and(a, b)` | bitwise AND |
| `or(a, b)` | bitwise OR |
| `xor(a, b)` | bitwise XOR |
| `lt(a, b)` | less than |
| `gt(a, b)` | greater than |
| `eq(a, b)` | equal |
| `mload(p)` | memory[p..p+32] |
| `mstore(p, v)` | memory[p..p+32] = v |
| `sload(p)` | storage[p] |
| `sstore(p, v)` | storage[p] = v |
| `calldataload(p)` | calldata[p..p+32] |
| `caller()` | msg.sender |
| `callvalue()` | msg.value |
| `selfbalance()` | address(this).balance |
| `keccak256(p, n)` | hash of memory[p..p+n] |

### Control Flow in Yul

```yul
if lt(calldatasize(), 4) { revert(0, 0) }

for { let i := 0 } lt(i, 10) { i := add(i, 1) } {
    // loop body
}

switch x
case 0 { /* ... */ }
case 1 { /* ... */ }
default { /* ... */ }
```

## SMTChecker

The SMTChecker is a built-in formal verification module that checks for:
- Integer underflows/overflows (pre-0.8.0 behavior)
- Reentrancy issues
- Unchecked assertions
- Reachability conditions

### Usage

```solidity
pragma experimental SMTChecker;
```

### Verification Targets

```solidity
pragma experimental SMTChecker;
contract C {
    function f(uint x) public pure {
        assert(x > 0);  // SMTChecker will try to find counterexample
    }
}
```

### Limitations

- Can be slow on complex contracts
- May produce false positives
- External calls are modeled conservatively
- Supports bounded model checking and constrained Horn clauses

## Import Path Resolution

### Context-Dependent Imports

Solidity resolves import paths based on:

1. **Relative paths** — Relative to the importing file
2. **Base path** — Set via `--base-path` (default: current directory)
3. **Include paths** — Additional search directories
4. **Remappings** — `prefix=target` mappings

### Remapping Examples

```bash
# Map a prefix to a local directory
solc =openzeppelin/=./node_modules/@openzeppelin/contracts/ Contract.sol

# Map a GitHub-style path
solc =github.com/OpenZeppelin/=lib/openzeppelin/ Contract.sol

# In JSON input
{
  "settings": {
    "remappings": [
      "openzeppelin/=./node_modules/@openzeppelin/contracts/"
    ]
  }
}
```

### Import Path Resolution Order

1. If path starts with `/` — absolute path (relative to base path)
2. If path starts with `./` or `../` — relative to importing file
3. Try remappings
4. Try include paths
5. Try base path

## Breaking Changes

### 0.8.x Key Changes (from 0.7.x)

- **Checked arithmetic by default** — Overflow/underflow reverts
- **`unchecked` block** — For wrapping behavior
- **No more ` SafeMath`** — Built-in overflow checks
- **`address payable` explicit** — Must use `payable()` conversion
- **Custom errors** — `error ErrorName(...)` and `revert ErrorName(...)`
- **`bytes.concat()` and `string.concat()`** — Built-in concatenation
- **`block.basefee`** — EIP-3198
- **`block.prevrandao`** — Replaces `block.difficulty` post-Merge (EIP-4399)
- **`push0`** — EIP-3855 (Shanghai)
- **Transient storage** — EIP-1153 (Cancun)
- **`mcopy`** — EIP-5656 (Cancun)
- **`blobbasefee`** — EIP-7516 (Cancun)

### 0.8.0 Breaking Changes

- `int256`/`uint256` no longer allow implicit conversion to/from `address`
- Exponentiation is right-associative (`2**3**2` = `2**(3**2)` = 512)
- Division by zero reverts (even in `unchecked`)
- `abi.decode` now requires explicit types
- `now` keyword removed (use `block.timestamp`)

### Notable Version Changes

| Version | Change |
|---------|--------|
| 0.8.0 | Checked arithmetic, custom errors |
| 0.8.4 | `revert CustomError()` syntax |
| 0.8.8 | `override` for multiple base contracts |
| 0.8.13 | `--via-ir` recommended |
| 0.8.17 | `selfdestruct` semantics changed |
| 0.8.22 | `push0` support (Shanghai) |
| 0.8.24 | Transient storage (Cancun) |
| 0.8.25 | `mcopy` support |
| 0.8.26 | `blobbasefee`, `blobhash` |

## Resources

- **Official Documentation:** https://docs.soliditylang.org/en/v0.8.36/
- **Solidity GitHub:** https://github.com/ethereum/solidity
- **Remix IDE:** https://remix.ethereum.org/
- **OpenZeppelin Contracts:** https://docs.openzeppelin.com/contracts/
- **Solidity by Example:** https://solidity-by-example.org/
- **EIPs:** https://eips.ethereum.org/
- **ERC-20:** https://eips.ethereum.org/EIPS/eip-20
- **ERC-721:** https://eips.ethereum.org/EIPS/eip-721
- **ERC-1155:** https://eips.ethereum.org/EIPS/eip-1155
- **ERC-7201 (Namespaces):** https://eips.ethereum.org/EIPS/eip-7201
