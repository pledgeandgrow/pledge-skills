# Solidity Security, Patterns, NatSpec, and Style Guide

## Security Considerations

### Pitfalls

#### Private Information and Randomness

Everything in a smart contract is publicly visible — even `private` state variables. Never store sensitive data on-chain. Randomness is difficult because block miners can manipulate block properties.

#### Reentrancy

The most critical Solidity vulnerability. An external call can trigger a callback into your contract before state is updated:

```solidity
// VULNERABLE — do not use
function withdraw() public {
    (bool success,) = msg.sender.call{value: balances[msg.sender]}("");
    if (success) balances[msg.sender] = 0;  // state updated AFTER external call
}
```

**Fix — Checks-Effects-Interactions Pattern:**

```solidity
function withdraw() public {
    uint share = balances[msg.sender];
    balances[msg.sender] = 0;  // Effect: update state FIRST
    (bool success,) = payable(msg.sender).call{value: share}("");
    require(success);  // Interaction: external call LAST
}
```

**Reentrancy Guard Pattern:**

```solidity
uint256 private _status;
modifier nonReentrant() {
    require(_status != 2, "Reentrant call");
    _status = 2;
    _;
    _status = 1;
}
```

> Reentrancy is not limited to Ether transfers — any external call can trigger it.

#### Gas Limit and Loops

Loops with variable iteration counts can exceed the block gas limit, stalling the contract:

```solidity
// DANGEROUS — if users.length grows large
for (uint i = 0; i < users.length; i++) {
    pay(users[i]);
}
```

**Fix:** Use pagination, withdrawal pattern, or off-chain processing.

#### Sending and Receiving Ether

- `transfer()` and `send()` forward only 2300 gas — may fail if recipient is a contract
- `call{value:}("")` forwards all gas — but enables reentrancy
- Always check return value of `send()` and `call()`
- `transfer()` and `send()` are deprecated — use `call{value:}("")` with reentrancy guard

**Forcing Ether:** A contract can receive Ether without `receive`/`fallback` via:
- `selfdestruct` (pre-Cancun)
- Block rewards / coinbase transactions
- EIP-1559 priority fees

Never use `address(this).balance == 0` as a condition.

#### tx.origin

Never use `tx.origin` for authentication:

```solidity
// VULNERABLE
require(tx.origin == owner);
```

An attacker can trick the owner into calling a malicious contract that calls your contract.

#### Two's Complement / Underflows / Overflows

Since 0.8.0, arithmetic is checked by default. Use `unchecked` only when you're certain overflow/underflow is safe.

#### Clearing Mappings

Mappings cannot be fully cleared. You must track keys or use a pattern:

```solidity
mapping(address => uint) balances;
address[] keys;

function clearAll() public {
    for (uint i = 0; i < keys.length; i++) {
        delete balances[keys[i]];
    }
    delete keys;
}
```

#### Internal Function Pointers in Upgradeable Contracts

Avoid storing internal function pointers in storage when using upgradeable contracts — function indices may change between versions.

### Recommendations

1. **Take Warnings Seriously** — Compiler warnings often indicate real bugs
2. **Restrict the Amount of Ether** — Limit how much Ether a contract can hold
3. **Keep it Small and Modular** — Smaller contracts are easier to audit
4. **Use the Checks-Effects-Interactions Pattern** — Always update state before external calls
5. **Include a Fail-Safe Mode** — Add a circuit breaker / pause mechanism
6. **Ask for Peer Review** — Have your contract audited
7. **Use `require` for input validation** — Fail fast on invalid input
8. **Use `assert` for invariants** — Catch logic errors
9. **Prefer custom errors over strings** — Cheaper and more descriptive
10. **Use OpenZeppelin contracts** — Battle-tested implementations

## Common Patterns

### Withdrawal Pattern

Instead of pushing Ether to recipients, let them pull it:

```solidity
contract WithdrawalContract {
    mapping(address => uint) pendingWithdrawals;

    function becomeRichest() public payable {
        if (msg.value <= mostSent) revert NotEnoughEther();
        pendingWithdrawals[richest] += msg.value;
        richest = msg.sender;
        mostSent = msg.value;
    }

    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success);
    }
}
```

### Restricting Access

Use modifiers for access control:

```solidity
contract AccessRestriction {
    address public owner = msg.sender;
    uint public creationTime = block.timestamp;

    error Unauthorized();
    error TooEarly();

    modifier onlyBy(address account) {
        if (msg.sender != account) revert Unauthorized();
        _;
    }

    modifier onlyAfter(uint time) {
        if (block.timestamp < time) revert TooEarly();
        _;
    }

    function changeOwner(address newOwner) public onlyBy(owner) {
        owner = newOwner;
    }

    function disown() public onlyBy(owner) onlyAfter(creationTime + 6 weeks) {
        delete owner;
    }
}
```

### State Machine

Model contract stages with enums and modifiers:

```solidity
contract StateMachine {
    enum Stage { Accepting, Revealing, Ended }
    Stage public stage = Stage.Accepting;

    modifier atStage(Stage expected) {
        require(stage == expected, "Wrong stage");
        _;
    }

    modifier transitionTo(Stage next) {
        _;
        stage = next;
    }

    function startReveal() public atStage(Stage.Accepting) transitionTo(Stage.Revealing) {
        // ...
    }

    function endAuction() public atStage(Stage.Revealing) transitionTo(Stage.Ended) {
        // ...
    }
}
```

## NatSpec Format

NatSpec (Natural Language Specification) provides documentation for contracts, functions, events, errors, etc.

### Syntax

```solidity
/// Single-line NatSpec

/** Multi-line
    NatSpec */
```

### Tags

| Tag | Context | Description |
|-----|---------|-------------|
| `@title` | contract, library, interface, struct, enum | Title |
| `@author` | contract, library, interface, struct, enum | Author name |
| `@notice` | contract, function, public state variable, event, error | Explain to end user |
| `@dev` | contract, function, state variable, event, error | Explain to developer |
| `@param` | function, event, error | Document a parameter |
| `@return` | function, public state variable | Document return value |
| `@inheritdoc` | function, public state variable | Copy tags from base |
| `@custom:...` | everywhere | Custom tag |

### Example

```solidity
/// @title A simulator for trees
/// @author Larry A. Gardner
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
contract Tree {
    /// @notice Calculate tree age in years, rounded up
    /// @dev The Alexandr N. Tetearing algorithm could increase precision
    /// @param rings The number of rings from dendrochronological sample
    /// @return Age in years, rounded up for partial years
    function age(uint256 rings) external pure returns (uint256) {
        return rings + 1;
    }
}
```

### Documentation Output

- **User Documentation** — From `@notice` tags. Shown to end users.
- **Developer Documentation** — From `@dev` tags. Shown to developers.

## Style Guide

### Order of Layout

**Per file:**
1. Pragma statements
2. Import statements
3. Events
4. Errors
5. Interfaces
6. Libraries
7. Contracts

**Per contract/library/interface:**
1. Type declarations
2. State variables
3. Events
4. Errors
5. Modifiers
6. Functions

### Code Layout

- **Indentation:** 4 spaces
- **Blank lines:** 2 between top-level constructs, 1 between functions
- **Maximum line length:** 120 characters (recommended)
- **Encoding:** UTF-8
- **Imports:** Grouped at top

### Order of Functions

1. `constructor`
2. `receive` (if exists)
3. `fallback` (if exists)
4. `external` functions
5. `public` functions
6. `internal` functions
7. `private` functions

Group by visibility, then by mutability (`payable`, non-payable, `view`, `pure`).

### Naming Conventions

| Element | Style | Example |
|---------|-------|---------|
| Contracts | CapWords | `SimpleStorage` |
| Libraries | CapWords | `SafeMath` |
| Interfaces | CapWords, prefixed with `I` | `IERC20` |
| Structs | CapWords | `VoterData` |
| Events | CapWords | `TransferOccurred` |
| Functions | mixedCase | `transferFunds` |
| Function args | mixedCase | `recipientAddress` |
| Local variables | mixedCase | `tempValue` |
| State variables | mixedCase | `storedData` |
| Constants | UPPER_CASE_WITH_UNDERSCORES | `MAX_SUPPLY` |
| Modifiers | mixedCase | `onlyOwner` |
| Enums | CapWords | `TokenState` |
| Non-external functions/vars | underscore prefix | `_internalData` |

### Function Declaration Style

```solidity
// Single line if short
function foo() public pure returns (uint) { return 42; }

// Multi-line for longer signatures
function transfer(
    address to,
    uint256 amount
) public returns (bool) {
    // ...
}
```

### Mappings

```solidity
mapping(address => uint256) public balances;
mapping(address => mapping(address => uint256)) internal allowances;
```

### Control Structures

```solidity
if (condition) {
    // ...
} else if (otherCondition) {
    // ...
} else {
    // ...
}

while (condition) {
    // ...
}

for (uint i = 0; i < array.length; i++) {
    // ...
}
```

Always use curly braces, even for single statements.
