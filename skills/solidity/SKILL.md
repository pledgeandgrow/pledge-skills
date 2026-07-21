# Solidity — Smart Contract Programming Language

**Version:** 0.8.36
**Documentation:** https://docs.soliditylang.org/en/v0.8.36/
**License:** GPL-3.0

Solidity is an object-oriented, high-level language for implementing smart contracts on blockchain platforms, primarily Ethereum. It is statically typed, supports inheritance, libraries, and complex user-defined types.

## Quick Start

### Installation

```bash
# npm
npm install --global solc

# Docker
docker run ethereum/solc:0.8.36 --version

# macOS
brew install solidity

# Linux (Ubuntu)
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install solc
```

### Remix IDE

For quick experimentation, use [Remix](https://remix.ethereum.org/) — no installation required.

### First Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract SimpleStorage {
    uint256 storedData;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
```

### Subcurrency Example

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

contract Coin {
    address public minter;
    mapping(address => uint) public balances;

    event Sent(address from, address to, uint amount);

    constructor() {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        balances[receiver] += amount;
    }

    error InsufficientBalance(uint requested, uint available);

    function send(address receiver, uint amount) public {
        require(amount <= balances[msg.sender], InsufficientBalance(amount, balances[msg.sender]));
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
```

## Architecture

### The Ethereum Virtual Machine (EVM)

The EVM is the runtime environment for smart contracts. It is a stack-based architecture with:

- **Storage** — Persistent key-value store (256-bit words → 256-bit words). Survives between transactions. Costly to read/write.
- **Transient Storage** — Like storage but reset at end of each transaction. Significantly cheaper than storage.
- **Memory** — Freshly cleared per message call. Linear, byte-addressable. Expands by 256-bit words. Cost scales quadratically.
- **Stack** — 1024 elements max, 256-bit words. Access limited to top 16 elements.
- **Calldata** — Read-only data sent with transaction. ABI-encoded.
- **Returndata** — Return values from external calls.

### Accounts

- **Externally Owned Accounts (EOA)** — Controlled by private keys, no code.
- **Contract Accounts** — Controlled by contract code, have storage.

### Gas

Every operation costs gas. Transactions specify a gas limit and gas price. Unused gas is refunded. Gas prevents infinite loops and abuse.

### Key Concepts

- **Smart Contracts** — Programs that execute on the EVM
- **Transactions** — State-changing operations initiated by EOAs
- **Message Calls** — Contracts calling other contracts
- **Delegatecall** — Execute another contract's code in the context of the caller
- **Events/Logs** — EVM logging facilities for dapp integration
- **selfdestruct** — Send all Ether to an address and destroy the contract (behavior changed post-Cancun)

## Source File Layout

### SPDX License Identifier

```solidity
// SPDX-License-Identifier: MIT
```

Required at the top of every file. Use `UNLICENSED` for closed-source.

### Pragmas

```solidity
// Version pragma — restrict to specific compiler version
pragma solidity ^0.8.26;
pragma solidity >=0.8.0 <0.9.0;

// ABI coder pragma
pragma abicoder v2;

// Experimental features
pragma experimental SMTChecker;
```

### Imports

```solidity
import "filename";
import * as symbolName from "filename";
import {symbol1 as alias, symbol2} from "filename";
import "filename" as symbolName;
```

### Comments

```solidity
// Single-line comment

/*
Multi-line comment
*/

/// NatSpec single-line
/** NatSpec multi-line */
```

## Contract Structure

Contracts can contain: **State Variables**, **Functions**, **Function Modifiers**, **Events**, **Errors**, **Struct Types**, **Enum Types**.

```solidity
contract MyContract {
    // State variables
    uint public count;

    // Events
    event Counted(uint newCount);

    // Errors
    error CountTooLow(uint provided);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Functions
    function increment() public {
        count++;
        emit Counted(count);
    }

    // Structs
    struct Data { uint value; address owner; }

    // Enums
    enum State { Created, Active, Closed }
}
```

## Skill Files

| File | Content |
|------|---------|
| `SKILL.md` | This file — overview, quick start, EVM architecture, source file layout, contract structure |
| `language.md` | Types (value, reference, mapping), operators, conversions, units, global variables, control structures, error handling, function types |
| `contracts.md` | Contracts in depth — visibility, getters, modifiers, transient storage, constants/immutables, functions, events, custom errors, inheritance, abstract contracts, interfaces, libraries, using for, inline assembly |
| `security.md` | Security considerations — pitfalls (reentrancy, gas limits, tx.origin), recommendations, common patterns (withdrawal, access restriction, state machine), NatSpec format, style guide |
| `advanced.md` | Compiler usage, IR-based codegen, internals (storage/memory/calldata layout, optimizer, metadata), ABI specification, Yul, SMTChecker, import path resolution, breaking changes |
