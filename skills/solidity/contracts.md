# Solidity Contracts — Inheritance, Libraries, Interfaces, Modifiers

## Creating Contracts

Contracts are created via Ethereum transactions or from within other contracts:

```solidity
Contract newContract = new Contract(constructorArg);
```

The constructor runs once during creation. Only one constructor is allowed (no overloading).

## Visibility and Getters

### State Variable Visibility

- **`public`** — Compiler generates a getter function. Accessible externally.
- **`internal`** (default) — Accessible within contract and derived contracts.
- **`private`** — Accessible only within the defining contract. NOT hidden from the world — all blockchain data is public.

### Function Visibility

- **`public`** — Visible externally and internally. Part of the external interface.
- **`external`** — Only visible externally (message-called via `this.func`). Cannot be called internally directly.
- **`internal`** — Only visible internally and in derived contracts.
- **`private`** — Only visible within the defining contract.

### Getter Functions

`public` state variables automatically generate getter functions:

```solidity
mapping(address => uint) public balances;
// Generates: function balances(address account) external view returns (uint)
```

## Function Modifiers

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

modifier validAddress(address addr) {
    require(addr != address(0), "Invalid address");
    _;
}

function withdraw() public onlyOwner validAddress(msg.sender) {
    // ...
}
```

- `_;` is replaced by the function body
- Modifiers can have arguments
- Modifiers can be overridden (virtual/override)
- Modifiers cannot be overloaded

## Transient Storage

Transient storage is reset at the end of each transaction. It persists across function calls within the same transaction but is cheaper than regular storage.

```solidity
uint transient value;
```

> **Caveat:** Transient storage does not revert on sub-call failure. Use carefully in composability scenarios.

## Constant and Immutable State Variables

### Constant

```solidity
uint constant MAX_SUPPLY = 1000000;
address constant TOKEN = 0x...;
```

Evaluated at compile time. Must be assigned a value at declaration. Cannot use non-constant expressions.

### Immutable

```solidity
address immutable owner;

constructor() {
    owner = msg.sender;  // assigned once in constructor
}
```

Evaluated at construction time. Stored in code (not storage). Cheaper to read than storage.

## Custom Storage Layout

Solidity allows custom storage layout via `erc7201()` and manual slot assignment for namespace isolation:

```solidity
library MyStorage {
    constant SLOT = uint256(keccak256("my.storage")) - 1;
}
```

## Functions

### Function Parameters and Return Variables

```solidity
function transfer(address to, uint amount) public returns (bool success) {
    // ...
    return true;
}

// Multiple return values
function divide(uint a, uint b) public pure returns (uint quotient, uint remainder) {
    quotient = a / b;
    remainder = a % b;
}
```

### State Mutability

- **`pure`** — No read/write of state. No access to `msg.sender`, `block.*`, etc.
- **`view`** — Can read state but not modify.
- **`payable`** — Can receive Ether.
- **(default)** — Non-payable, can read and write state.

### Special Functions

#### receive

```solidity
receive() external payable {
    // Called on plain Ether transfer (no calldata)
}
```

A contract can have at most one `receive` function. It must be `external payable`, cannot have arguments, cannot return anything.

#### fallback

```solidity
fallback() external payable {
    // Called when no function matches the calldata
}

fallback() external {
    // Called when no function matches and no Ether sent
}
```

### Function Overloading

```solidity
function f(uint a) public pure returns (uint) { return a; }
function f(uint a, uint b) public pure returns (uint) { return a + b; }
```

## Events

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);

emit Transfer(msg.sender, to, amount);
```

- `indexed` parameters (max 3) are stored in topic log for filtering
- Non-indexed parameters stored in data portion
- Events are not accessible from within contracts (only from off-chain)

### Anonymous Events

```solidity
event Transfer(address indexed from, address indexed to, uint256 value) anonymous;
```

Anonymous events have 4 indexed parameters but no signature in topics.

## Custom Errors

```solidity
error NotEnoughFunds(uint requested, uint available);
error Unauthorized();

function transfer(address to, uint amount) public {
    if (amount > balances[msg.sender])
        revert NotEnoughFunds(amount, balances[msg.sender]);
    if (msg.sender != owner)
        revert Unauthorized();
    // ...
}
```

Custom errors are gas-efficient — only error selector + encoded data stored, no string.

## Inheritance

Solidity supports multiple inheritance with polymorphism:

```solidity
contract A {
    function foo() public virtual returns (string memory) {
        return "A";
    }
}

contract B is A {
    function foo() public virtual override returns (string memory) {
        return "B";
    }
}

contract C is A, B {
    function foo() public override(A, B) returns (string memory) {
        return super.foo();  // calls most derived: B.foo()
    }
}
```

### Function Overriding

- `virtual` — function can be overridden in derived contracts
- `override` — function overrides a base function
- `override(A, B)` — override from multiple base contracts

### Constructors

```solidity
contract Base {
    constructor(uint value) { /* ... */ }
}

// Option 1: Inheritance declaration
contract Derived is Base(42) { }

// Option 2: Constructor body
contract Derived is Base {
    constructor() Base(42) { }
}
```

### Multiple Inheritance and Linearization

Solidity uses C3 linearization (like Python). The order of base contracts matters:

```solidity
contract C is A, B { }  // A is most base, B is more derived
```

`super` refers to the next contract in the linearization order.

### State Variable Shadowing

State variable shadowing is an error. A derived contract cannot declare a state variable with the same name as a visible state variable in any base.

## Abstract Contracts

```solidity
abstract contract Animal {
    function makeSound() public virtual returns (string memory);
}

contract Dog is Animal {
    function makeSound() public pure override returns (string memory) {
        return "Woof";
    }
}
```

- Cannot be instantiated directly
- Must be marked `abstract` if any function lacks implementation
- Useful for Template Method pattern and code reuse

## Interfaces

```solidity
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value);
}
```

- Cannot have implementations (no function bodies)
- Cannot inherit from contracts, only other interfaces
- Cannot have constructors, state variables
- Can inherit enums, structs
- All functions must be `external`
- `type(I).interfaceId` gives EIP-165 interface ID

## Libraries

Libraries are deployed once and their code is reused via DELEGATECALL:

```solidity
library Set {
    struct Data { mapping(uint => bool) flags; }

    function insert(Data storage self, uint value) public returns (bool) {
        if (self.flags[value]) return false;
        self.flags[value] = true;
        return true;
    }

    function contains(Data storage self, uint value) public view returns (bool) {
        return self.flags[value];
    }
}

contract C {
    Set.Data knownValues;

    function register(uint value) public {
        require(Set.insert(knownValues, value));
    }
}
```

**Key properties:**
- No state variables (stateless)
- Cannot inherit or be inherited
- Internal functions are inlined (JUMP, not DELEGATECALL)
- External functions use DELEGATECALL
- First parameter can be `storage` reference (special — passed by reference)
- Cannot be destroyed
- Cannot receive Ether (no payable/fallback)

### Call Protection for Libraries

Libraries have a mechanism that prevents direct calls to state-modifying functions (only via DELEGATECALL).

## Using For

```solidity
using SafeMath for uint256;

uint256 a = 1;
uint256 b = a.add(2);  // calls SafeMath.add(a, 2)
```

- Attaches library functions to a type
- The first parameter of the library function becomes the object
- Can also be used at file level: `using SafeMath for uint256;`
- Can be used with specific types: `using {add, sub} for uint256;`

## Inline Assembly (Yul)

```solidity
function addAssembly(uint a, uint b) public pure returns (uint) {
    assembly {
        let result := add(a, b)
        mstore(0, result)
        return(0, 0x20)
    }
}
```

### Access to External Variables

```solidity
assembly {
    let slot := sload(0)  // read storage slot 0
    let value := calldataload(4)  // read first argument
}
```

### Things to Avoid in Assembly

- Modifying memory that Solidity manages
- Overwriting the free memory pointer
- Not respecting the 64-byte scratch space convention

### Conventions

- Free memory pointer at `0x40`
- Zero slot at `0x60`
- Scratch space at `0x00`–`0x3f`
- New memory allocations start at `msload(0x40)`

## Cheatsheet — Function Visibility and Modifiers

### Visibility Specifiers

| Specifier | External | Internal | Derived | Description |
|-----------|----------|----------|---------|-------------|
| `public` | ✅ | ✅ | ✅ | Visible everywhere |
| `external` | ✅ | ❌ | ❌ | Only external calls |
| `internal` | ❌ | ✅ | ✅ | Only internal/derived |
| `private` | ❌ | ✅ | ❌ | Only within contract |

### State Mutability Modifiers

| Modifier | Read State | Write State | Receive Ether |
|----------|-----------|-------------|---------------|
| `pure` | ❌ | ❌ | ❌ |
| `view` | ✅ | ❌ | ❌ |
| `payable` | ✅ | ✅ | ✅ |
| (default) | ✅ | ✅ | ❌ |
