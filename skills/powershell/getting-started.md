# PowerShell — Getting Started

## What is PowerShell?

PowerShell is a task-based command-line shell and scripting language built on .NET. It's designed for system administration and automation across Windows, Linux, and macOS.

### Key Characteristics

- **Object-based**: Pipeline passes .NET objects (not text)
- **Cross-platform**: PowerShell 7.x runs on Windows, Linux, macOS
- **Extensible**: Modules, functions, classes, providers
- **Cmdlet model**: Verb-Noun naming convention (e.g., `Get-Process`, `New-Item`)

### PowerShell vs Windows PowerShell

| Feature | PowerShell 7.x | Windows PowerShell 5.1 |
|---------|----------------|----------------------|
| Runtime | .NET 8/9 | .NET Framework 4.x |
| Platforms | Windows, Linux, macOS | Windows only |
| Pipeline | ForEach-Object -Parallel | Sequential only |
| Status | Active development | Maintenance only |
| Installation | Separate install | Built into Windows |

**Source**: [What is PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/getting-started/getting-started-with-windows-powershell) | [Migrating from 5.1 to 7](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7)

## Installation

### Windows

```powershell
# Install via winget
winget install --id Microsoft.PowerShell --source winget

# Install via MSI
# Download from: https://github.com/PowerShell/PowerShell/releases

# Verify
$PSVersionTable
```

### Linux (Ubuntu/Debian)

```bash
# Install via package repository
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/ubuntu/22.04/prod jammy main"
sudo apt update && sudo apt install -y powershell

# Launch
pwsh
```

### macOS

```bash
# Install via Homebrew
brew install --cask powershell

# Launch
pwsh
```

### Docker

```bash
docker run -it mcr.microsoft.com/powershell
```

**Source**: [Installing PowerShell on Windows](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) | [Installing PowerShell on Linux](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux) | [Installing PowerShell on macOS](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-macos) | [Docker](https://learn.microsoft.com/en-us/powershell/scripting/install/PowerShell-in-Docker)

## Host Applications

### Console (pwsh.exe / pwsh)

- Default terminal for PowerShell 7
- Cross-platform (`pwsh` on Linux/macOS, `pwsh.exe` on Windows)

### Windows PowerShell ISE

- Legacy GUI editor (Windows PowerShell 5.1 only)
- Not supported in PowerShell 7

### VS Code (Recommended)

- [PowerShell Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell)
- Integrated terminal, IntelliSense, debugging, PSScriptAnalyzer integration
- Recommended editor for PowerShell 7+

```powershell
# Open profile in VS Code
code $PROFILE
```

**Source**: [Using VS Code](https://learn.microsoft.com/en-us/powershell/scripting/dev-cross-plat/vscode/using-vscode) | [PowerShell Extension](https://learn.microsoft.com/en-us/powershell/scripting/dev-cross-plat/vscode/using-vscode-for-powershell)

## Determining Your Version

```powershell
# Display version information
$PSVersionTable

# Key properties:
# PSVersion      - PowerShell version (7.6, 5.1, etc.)
# PSEdition      - "Core" (PowerShell 7) or "Desktop" (Windows PowerShell 5.1)
# OS             - Operating system
# Platform       - Win32NT, Unix, etc.
```

**Source**: [$PSVersionTable](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables) | [Determine your version](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started#determine-your-version-of-powershell)

## Execution Policies

Execution policies control whether and how scripts can run.

| Policy | Description |
|--------|-------------|
| `Restricted` | No scripts (default on Windows) |
| `AllSigned` | Only signed scripts |
| `RemoteSigned` | Local scripts OK, remote must be signed |
| `Unrestricted` | All scripts (with warning for remote) |
| `Bypass` | No restrictions (for automation) |

```powershell
# Get current policy
Get-ExecutionPolicy

# Get all scopes
Get-ExecutionPolicy -List

# Set policy (requires admin for LocalMachine)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine

# Set for current user (no admin needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Bypass for a single session
pwsh -ExecutionPolicy Bypass -File script.ps1
```

**Source**: [about_Execution_Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)

## Getting Help

### Get-Help

```powershell
# Basic help
Get-Help Get-Process

# Detailed help
Get-Help Get-Process -Detailed

# Full help with examples
Get-Help Get-Process -Full

# Examples only
Get-Help Get-Process -Examples

# Online version
Get-Help Get-Process -Online

# Update help
Update-Help

# List all available help topics
Get-Help about_*
```

### Get-Command

```powershell
# Find all commands
Get-Command

# Find by name pattern
Get-Command *process*

# Find by verb
Get-Command -Verb Get

# Find by noun
Get-Command -Noun Process

# Find by module
Get-Command -Module Microsoft.PowerShell.Management

# Find commands with specific parameter
Get-Command -ParameterName ComputerName
```

### Get-Member

```powershell
# Discover object properties and methods
Get-Process | Get-Member

# Properties only
Get-Process | Get-Member -MemberType Property

# Methods only
Get-Process | Get-Member -MemberType Method
```

**Source**: [Get-Help](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-help) | [Get-Command](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-command) | [Get-Member](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-member)

## Profiles

Profiles run automatically when PowerShell starts.

```powershell
# Current user, current host
$PROFILE.CurrentUserCurrentHost

# Current user, all hosts
$PROFILE.CurrentUserAllHosts

# All users, current host
$PROFILE.AllUsersCurrentHost

# All users, all hosts
$PROFILE.AllUsersAllHosts

# View profile path
$PROFILE

# Edit profile
code $PROFILE
```

Common profile content:
```powershell
# Aliases
Set-Alias ll Get-ChildItem

# Functions
function Go-Home { Set-Location $HOME }

# Module imports
Import-Module PSReadLine
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete

# Prompt customization
function prompt {
    "$($executionContext.SessionState.Path.CurrentLocation)> "
}
```

**Source**: [about_Profiles](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles)

## PowerShell 101 Chapters

| Chapter | Topic |
|---------|-------|
| 1 | Getting Started |
| 2 | Help System |
| 3 | Operators |
| 4 | Variables |
| 5 | Strings |
| 6 | Arrays, Hashtables |
| 7 | WMI and CIM |
| 8 | PowerShell Remoting |
| 9 | Functions |
| 10 | Scripting |
| 11 | Appendix |

**Source**: [PowerShell 101](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started) | [Chapter 2 - Help System](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/02-help-system) | [Chapter 3 - Operators](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/03-operators) | [Chapter 4 - Variables](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/04-variables) | [Chapter 5 - Strings](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/05-strings) | [Chapter 6 - Arrays and Hashtables](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/06-arrays-hashtables) | [Chapter 7 - WMI and CIM](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/07-working-with-wmi) | [Chapter 8 - Remoting](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/08-powershell-remoting) | [Chapter 9 - Functions](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/09-functions) | [Chapter 10 - Scripting](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/10-scripting) | [Chapter 11 - Appendix](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/11-appendix)

**Source**: [Getting Started](https://learn.microsoft.com/en-us/powershell/scripting/getting-started/getting-started-with-windows-powershell) | [What is PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/getting-started/what-is-powershell) | [Installation](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell) | [Install on Windows](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) | [Install on Linux](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux) | [Install on macOS](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-macos) | [Install on ARM](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-arm) | [PowerShell in Docker](https://learn.microsoft.com/en-us/powershell/scripting/install/powershell-in-docker) | [Community Support](https://learn.microsoft.com/en-us/powershell/scripting/install/community-support) | [Migration](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7) | [Execution Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies) | [Get-Help](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-help) | [Profiles](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles) | [PS101 Introduction](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/00-introduction) | [PS101 Ch1 - Getting Started](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started) | [PS101 Ch2 - Discovering Objects](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/02-discovering-objects) | [PS101 Ch3 - Discovering Objects](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/03-discovering-objects) | [PS101 Ch4 - Arrays](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/04-arrays) | [PS101 Ch5 - Hashtables](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/05-hashtables) | [PS101 Ch6 - Formatting Output](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/06-formatting-output) | [PS101 Ch7 - WMI and CIM](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/07-working-with-wmi) | [PS101 Ch8 - PowerShell Pipeline](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/08-powershell-pipeline) | [PS101 Ch9 - Functions](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/09-functions) | [PS101 Ch10 - Script Blocks](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/10-script-blocks) | [PS101 Ch11 - Modules](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/11-modules) | [Community Contributing](https://learn.microsoft.com/en-us/powershell/scripting/community/contributing/get-started-writing) | [Docs 2020 Updates](https://learn.microsoft.com/en-us/powershell/scripting/community/2020-updates) | [Docs 2022 Updates](https://learn.microsoft.com/en-us/powershell/scripting/community/2022-updates) | [How to Use Docs](https://learn.microsoft.com/en-us/powershell/scripting/how-to-use-docs)
