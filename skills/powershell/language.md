# PowerShell — Language

## Variables

### Variable Basics

```powershell
# String
$name = "PowerShell"

# Integer
$count = 42

# Array
$items = @('apple', 'banana', 'cherry')

# Hashtable
$config = @{ Server = 'localhost'; Port = 8080 }

# Null
$value = $null

# Strongly typed
[int]$number = 100
[string]$text = "Hello"
[datetime]$date = "2024-01-15"
```

### Automatic Variables

| Variable | Description |
|----------|-------------|
| `$_` / `$PSItem` | Current pipeline object |
| `$args` | Array of parameters passed to function |
| `$error` | Array of error objects |
| `$foreach` | Current foreach loop enumerator |
| `$HOME` | User home directory |
| `$HOST` | Host application object |
| `$input` | Pipeline input enumerator |
| `$MATCHES` | Regex match results |
| `$MYINVOCATION` | Invocation info |
| `$NULL` | Null value |
| `$PID` | Current process ID |
| `$PROFILE` | Profile script path |
| `$PSHOME` | PowerShell install directory |
| `$PSVersionTable` | Version info hash table |
| `$PWD` | Current working directory |
| `$STACKTRACE` | Stack trace |
| `$this` | Current object in class method |

### Preference Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `$ConfirmPreference` | High | Controls confirmation prompts |
| `$DebugPreference` | SilentlyContinue | Debug message handling |
| `$ErrorActionPreference` | Continue | Error handling behavior |
| `$ErrorView` | NormalView | Error display format |
| `$FormatEnumerationLimit` | 4 | Enum display limit |
| `$InformationPreference` | SilentlyContinue | Information stream handling |
| `$VerbosePreference` | SilentlyContinue | Verbose message handling |
| `$WarningPreference` | Continue | Warning message handling |
| `$WhatIfPreference` | False | WhatIf mode |

**Source**: [about_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_variables) | [about_Automatic_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables) | [about_Preference_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables)

## Arrays

```powershell
# Create
$empty = @()
$data = @('Zero', 'One', 'Two', 'Three')
$comma = 'Zero','One','Two','Three'

# Access by index
$data[0]      # Zero
$data[-1]     # Three (last)
$data[0..2]   # Zero, One, Two

# Count
$data.Count   # 4

# Add items (creates new array)
$data += 'Four'

# Strongly typed array
[int[]]$numbers = 1,2,3,4,5

# Array operators
$data -contains 'One'     # True
$data -notcontains 'Five' # True
$data -in @('Zero','One') # True

# Filter
$data | Where-Object { $_ -match 'o' }

# Iterate
foreach ($item in $data) { $item }
$data.ForEach{ $_ }
```

### Array Slicing

```powershell
$a = 1,2,3,4,5,6,7,8

$a[2..5]     # 3,4,5,6
$a[0..-1]    # 1,8 (first and last - NOT all items!)
$a[-1..0]    # 8,1
$a[2,4,6]    # 3,5,7 (specific indices)
```

**Source**: [about_Arrays](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_arrays) | [Everything About Arrays](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-arrays)

## Hashtables

```powershell
# Create
$ht = @{}
$ht = @{ Key1 = 'Value1'; Key2 = 'Value2' }

# Add/update
$ht['Key3'] = 'Value3'
$ht.NewKey = 'NewValue'

# Access
$ht['Key1']    # Value1
$ht.Key2       # Value2

# Iterate
foreach ($key in $ht.Keys) { "$key = $($ht[$key])" }
$ht.GetEnumerator() | ForEach-Object { "$($_.Key) = $($_.Value)" }

# Check key
$ht.ContainsKey('Key1')  # True

# Remove
$ht.Remove('Key1')

# Count
$ht.Count

# Ordered hashtable (preserves insertion order)
$ordered = [ordered]@{ First = 1; Second = 2; Third = 3 }
```

### Hashtable as Lookup Table

```powershell
$servers = @{
    Prod = 'SrvProd05'
    QA   = 'SrvQA02'
    Dev  = 'SrvDev12'
}

$server = $servers[$env]
```

**Source**: [about_Hash_Tables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hash_tables) | [Everything About Hashtables](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-hashtable)

## Strings

### Single vs Double Quotes

```powershell
# Single quotes - literal (no interpolation)
$name = 'World'
$msg = 'Hello $name'        # Hello $name

# Double quotes - interpolation
$msg = "Hello $name"        # Hello World
$msg = "Hello $($name)!"    # Hello World!

# Escape sequences (double quotes only)
$msg = "Tab`tNewline`nQuote`"Backtick`a"
```

### Here-Strings

```powershell
# Single-quoted here-string (literal)
$text = @'
Line 1
Line 2
Variable: $notExpanded
'@

# Double-quoted here-string (interpolation)
$text = @"
Line 1
Line 2
Variable: $expanded
"@
```

### String Operators

```powershell
# Concatenation
$s = "Hello" + " " + "World"
$s = "Hello" * 3          # HelloHelloHello

# Format
$s = -f "Hello {0}, you are {1}" -f "World", 42
$s = "Hello {0}, you are {1}" -f "World", 42

# Split/Join
"a,b,c" -split ","        # a, b, c
"a,b,c" -split ",", 2     # a, b,c
("a","b","c") -join "-"   # a-b-c

# Replace
"Hello World" -replace "World", "PowerShell"

# Match
"PowerShell" -match "shell"     # True
$matches[0]                      # shell

# Like
"Hello" -like "H*"               # True
"Hello" -notlike "*z*"           # True
```

**Source**: [about_Quoting_Rules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules) | [about_Regular_Expressions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_regular_expressions) | [about_Comparison_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comparison_operators)

## Operators

### Arithmetic

| Operator | Description |
|----------|-------------|
| `+` | Addition, string concat |
| `-` | Subtraction |
| `*` | Multiplication, string repeat |
| `/` | Division |
| `%` | Modulo |

### Comparison

| Operator | Description |
|----------|-------------|
| `-eq` / `-ne` | Equal / Not equal |
| `-gt` / `-ge` | Greater than / Greater or equal |
| `-lt` / `-le` | Less than / Less or equal |
| `-like` / `-notlike` | Wildcard match |
| `-match` / `-notmatch` | Regex match |
| `-contains` / `-notcontains` | Array contains |
| `-in` / `-notin` | Item in array |
| `-replace` | String replace |
| `-split` / `-join` | String split/join |
| `-is` / `-isnot` | Type check |
| `-as` | Type conversion |

### Logical

| Operator | Description |
|----------|-------------|
| `-and` | Logical AND |
| `-or` | Logical OR |
| `-not` / `!` | Logical NOT |
| `-xor` | Logical XOR |

### Bitwise

| Operator | Description |
|----------|-------------|
| `-band` | Bitwise AND |
| `-bor` | Bitwise OR |
| `-bnot` | Bitwise NOT |
| `-bxor` | Bitwise XOR |
| `-shl` | Shift left |
| `-shr` | Shift right |

**Source**: [about_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_operators) | [about_Comparison_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comparison_operators) | [about_Arithmetic_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_arithmetic_operators)

## Control Flow

### If/ElseIf/Else

```powershell
if ($count -gt 10) {
    "High"
} elseif ($count -gt 5) {
    "Medium"
} else {
    "Low"
}
```

### Switch

```powershell
switch ($day) {
    'Monday'    { "Start of week" }
    'Friday'    { "Almost weekend" }
    { $_ -in 'Saturday','Sunday' } { "Weekend!" }
    default     { "Midweek" }
}

# Switch with regex
switch -Regex ($input) {
    '^\d+$'  { "Number: $($_)" }
    '^[a-z]+$' { "Lowercase: $($_)" }
    default  { "Other: $($_)" }
}

# Switch with file
switch -File config.txt {
    "^#" { }  # Skip comments
    default { $_ }
}
```

### For

```powershell
for ($i = 0; $i -lt 10; $i++) {
    $i
}
```

### ForEach

```powershell
foreach ($item in $collection) {
    $item.Name
}

# ForEach-Object (pipeline)
$collection | ForEach-Object {
    $_.Name
}

# ForEach method
$collection.ForEach{ $_.Name }

# Parallel (PowerShell 7+)
1..10 | ForEach-Object -Parallel {
    $_ * 2
} -ThrottleLimit 5
```

### While / Do-While / Do-Until

```powershell
# While
while ($count -lt 10) { $count++ }

# Do-While (runs at least once)
do { $count++ } while ($count -lt 10)

# Do-Until (runs until condition is true)
do { $count++ } until ($count -ge 10)
```

### Break / Continue

```powershell
foreach ($i in 1..10) {
    if ($i -eq 5) { break }    # Exit loop
    if ($i -eq 3) { continue } # Skip iteration
    $i
}
```

**Source**: [about_If](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_if) | [about_Switch](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_switch) | [about_For](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_for) | [about_ForEach](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_foreach) | [about_While](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_while) | [about_Do](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_do) | [about_Break](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_break) | [about_Continue](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_continue)

## Functions

### Basic Function

```powershell
function Get-Greeting {
    param(
        [string]$Name = "World"
    )
    "Hello, $Name!"
}

Get-Greeting -Name "PowerShell"
```

### Advanced Function

```powershell
function Get-TopProcess {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [string]$ComputerName,

        [Parameter(ValueFromPipelineByPropertyName)]
        [int]$Top = 5,

        [ValidateSet('CPU','Memory','Handles')]
        [string]$SortBy = 'CPU'
    )

    begin {
        $results = @()
    }

    process {
        $procs = Get-Process -ComputerName $ComputerName |
            Sort-Object $SortBy -Descending |
            Select-Object -First $Top
        $results += $procs
    }

    end {
        Write-Output $results
    }
}
```

### Function with OutputType

```powershell
function Get-ServerInfo {
    [CmdletBinding()]
    [OutputType([PSCustomObject])]
    param(
        [Parameter(Mandatory)]
        [string]$ServerName
    )

    [PSCustomObject]@{
        Name   = $ServerName
        Status = 'Online'
        Time   = Get-Date
    }
}
```

### Splatting

```powershell
# Hashtable splatting
$params = @{
    Path        = 'C:\temp'
    Filter      = '*.log'
    Recurse     = $true
    ErrorAction = 'SilentlyContinue'
}
Get-ChildItem @params

# Array splatting
$args = @('C:\temp', '*.log', 'Recurse')
Get-ChildItem @args
```

**Source**: [about_Functions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions) | [about_Functions_Advanced](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced) | [about_Functions_Advanced_Parameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced_parameters) | [about_Functions_CmdletBindingAttribute](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_cmdletbindingattribute) | [about_Splatting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_splatting)

## Classes

```powershell
class Server {
    # Properties
    [string]$Name
    [string]$IPAddress
    [int]$Port = 80
    hidden [string]$ApiKey

    # Static property
    static [int]$DefaultPort = 80

    # Constructor
    Server([string]$name, [string]$ip) {
        $this.Name = $name
        $this.IPAddress = $ip
    }

    # Default constructor
    Server() {
        $this.Name = 'localhost'
        $this.IPAddress = '127.0.0.1'
    }

    # Method
    [string] GetUrl() {
        return "http://$($this.IPAddress):$($this.Port)"
    }

    # Static method
    static [Server] Create([string]$name) {
        return [Server]::new($name, '127.0.0.1')
    }
}

# Usage
$server = [Server]::new('web01', '10.0.0.1')
$server.Port = 443
$server.GetUrl()  # http://10.0.0.1:443
[Server]::DefaultPort  # 80
```

### Enums

```powershell
enum Environment {
    Development
    Staging
    Production
}

[Environment]$env = [Environment]::Production
```

**Source**: [about_Classes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes) | [about_Enum](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_enum) | [about_Using](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_using)

## Error Handling

### Error Levels

| Level | Mechanism | Use Case |
|-------|-----------|----------|
| Non-terminating | `Write-Error` | Pipeline item failure, continue processing |
| Statement-terminating | `$PSCmdlet.ThrowTerminatingError()` | Function can't continue, caller decides |
| Script-terminating | `throw` | Unrecoverable, stop entire script |

### Try/Catch/Finally

```powershell
try {
    $result = Get-Content 'config.json' -ErrorAction Stop
    $config = $result | ConvertFrom-Json
}
catch [System.IO.FileNotFoundException] {
    Write-Error "Config file not found: $_"
}
catch {
    Write-Error "Unexpected error: $($_.Exception.Message)"
}
finally {
    # Always runs
    if ($result) { $result.Dispose() }
}
```

### ErrorAction Parameter

```powershell
# Continue (default)
Get-Process -ErrorAction Continue

# SilentlyContinue (suppress)
Get-ChildItem -Path 'missing' -ErrorAction SilentlyContinue

# Stop (convert to terminating)
Get-Process -ErrorAction Stop

# Ignore (no error record)
Get-Process -ErrorAction Ignore
```

### $Error Variable

```powershell
# View recent errors
$Error[0]

# Error record properties
$Error[0].Exception.Message
$Error[0].CategoryInfo
$Error[0].TargetObject
$Error[0].FullyQualifiedErrorId

# Clear errors
$Error.Clear()
```

**Source**: [about_Try_Catch_Finally](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_try_catch_finally) | [about_Error_Handling](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_error_handling) | [about_Throw](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_throw) | [about_Trap](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_trap)

## Scope

```powershell
# Scopes: Global > Script > Local > Private

# Global scope
$global:config = @{ Server = 'prod' }

# Script scope
$script:counter = 0

# Local scope (default)
$localVar = "local"

# Private (not inherited)
$private:secret = "hidden"

# Using scope (for remoting)
Invoke-Command -ComputerName SRV01 -ScriptBlock {
    $using:config
}
```

### Dot Sourcing

```powershell
# Run script in current scope (functions/variables persist)
. .\my-functions.ps1

# Without dot sourcing (variables stay in script scope)
.\my-functions.ps1
```

**Source**: [about_Scopes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scopes) | [about_Script_Blocks](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_script_blocks)

## PSCustomObject

```powershell
# Create
$obj = [PSCustomObject]@{
    Name    = 'Server01'
    IP      = '10.0.0.1'
    Status  = 'Online'
    CPU     = 45.2
}

# Add properties
$obj | Add-Member -MemberType NoteProperty -Name 'Location' -Value 'DC1'

# Access
$obj.Name
$obj | Select-Object Name, Status

# Convert
$obj | ConvertTo-Json
$obj | ConvertTo-Csv -NoTypeInformation

# Create from hashtable
$ht = @{ Name = 'Server02'; IP = '10.0.0.2' }
$obj2 = [PSCustomObject]$ht

# Filter and sort
$servers | Where-Object Status -eq 'Online' | Sort-Object Name
```

**Source**: [about_Objects](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_objects) | [Everything About PSCustomObject](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-pscustomobject) | [about_Calculated_Properties](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_calculated_properties)

## Comment-Based Help

```powershell
function Get-ServerStatus {
    <#
    .SYNOPSIS
        Gets the status of a server.

    .DESCRIPTION
        Retrieves detailed status information for one or more servers,
        including CPU, memory, and disk usage.

    .PARAMETER ComputerName
        Specifies one or more computer names. Wildcards are permitted.

    .EXAMPLE
        Get-ServerStatus -ComputerName SRV01

    .EXAMPLE
        Get-ServerStatus -ComputerName SRV01, SRV02 -Detailed

    .INPUTS
        System.String

    .OUTPUTS
        PSCustomObject

    .NOTES
        Author: Admin
        Version: 1.0

    .LINK
        https://learn.microsoft.com/en-us/powershell/
    #>
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [string[]]$ComputerName,

        [switch]$Detailed
    )
    # Implementation
}
```

**Source**: [about_Comment_Based_Help](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comment_based_help)

## Language Specification

The PowerShell language specification covers:

- Chapter 1: Introduction and scope
- Chapter 2: Lexical structure
- Chapter 3: Basic concepts (types, operators, providers)
- Chapter 4: Types and subtypes
- Chapter 5: Variables
- Chapter 6: Conversions
- Chapter 7: Expressions and operators
- Chapter 8: Statements
- Chapter 9: Arrays
- Chapter 10: Hashtables
- Chapter 11: Modules
- Chapter 12: Attributes
- Chapter 13: Cmdlets
- Chapter 14: Comment-based help
- Chapter 15: Script blocks and functions
- Chapter 16: Error handling
- Chapter 17: DSC

**Source**: [Language Specification](https://learn.microsoft.com/en-us/powershell/scripting/lang-spec/chapter-01) | [about_Language_Keywords](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_keywords) | [about_Parsing](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parsing) | [about_Simplified_Syntax](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_simplified_syntax)

### Additional about_ Topics

- [about_ANSI_Terminals](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_ansi_terminals) — ANSI escape sequence support
- [about_Assignment_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_assignment_operators) — Operators for assigning values to variables
- [about_Built-in_Functions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_built-in_functions) — Built-in functions in PowerShell
- [about_Calling_Generic_Methods](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_calling_generic_methods) — Calling .NET generic methods
- [about_Case-Sensitivity](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_case-sensitivity) — Case-insensitive nature of PowerShell
- [about_Character_Encoding](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding) — Character encoding for I/O
- [about_Classes_Constructors](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_constructors) — Defining constructors for classes
- [about_Classes_Inheritance](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_inheritance) — Class inheritance
- [about_Classes_Methods](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_methods) — Defining methods for classes
- [about_Classes_Properties](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_properties) — Defining properties for classes
- [about_Command_Precedence](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_command_precedence) — How PowerShell determines which command to run
- [about_Command_Syntax](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_command_syntax) — Syntax diagrams used in PowerShell
- [about_Comments](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comments) — PowerShell comments and special use cases
- [about_CommonParameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_commonparameters) — Parameters usable with any cmdlet
- [about_Core_Commands](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_core_commands) — Cmdlets for use with PowerShell providers
- [about_Data_Files](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_data_files) — PowerShell data files (.psd1)
- [about_Debuggers](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_debuggers) — PowerShell debugger
- [about_Foreach](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_foreach) — Traversing collections
- [about_Format.ps1xml](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_format.ps1xml) — Default display formatting
- [about_Functions_Advanced_Methods](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced_methods) — Methods available to advanced functions
- [about_Functions_Argument_Completion](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_argument_completion) — Argument completion for functions
- [about_Hidden](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hidden) — hidden keyword for class members
- [about_History](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_history) — Command history
- [about_Intrinsic_Members](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_intrinsic_members) — Intrinsic members available to all objects
- [about_Join](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_join) — Join operator
- [about_Language_Modes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_modes) — Language modes and their effects
- [about_Line_Editing](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_line_editing) — Editing commands at the prompt
- [about_Locations](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_locations) — Accessing items from working location
- [about_Output_Streams](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_output_streams) — Output streams in PowerShell
- [about_Parameter_Binding](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parameter_binding) — Parameter binding process
- [about_Parameter_Sets](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parameter_sets) — Defining and using parameter sets
- [about_Parameters_Default_Values](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parameters_default_values) — Custom default values for parameters
- [about_Path_Syntax](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_path_syntax) — Full and relative path formats
- [about_Pipeline_Chain_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipeline_chain_operators) — Chaining pipelines with && and ||
- [about_Prompts](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_prompts) — Custom prompt function
- [about_PSConsoleHostReadLine](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_psconsolehostreadline) — Customizing console input reading
- [about_PSCustomObject](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pscustomobject) — [psobject] vs [pscustomobject] type accelerators
- [about_PSItem](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_psitem) — Current pipeline object ($_ alias)
- [about_Pwsh](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pwsh) — pwsh command-line interface
- [about_Redirection](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_redirection) — Redirecting output to text files
- [about_Reserved_Words](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_reserved_words) — Reserved words in PowerShell
- [about_Run_With_PowerShell](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_run_with_powershell) — Run with PowerShell feature
- [about_Script_Internationalization](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_script_internationalization) — Script internationalization features
- [about_Special_Characters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_special_characters) — Special character sequences
- [about_Split](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_split) — Split operator
- [about_Tab_Expansion](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_tab_expansion) — Tab completion
- [about_Telemetry](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_telemetry) — Telemetry collection and opt-out
- [about_Thread_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_thread_jobs) — Thread-based jobs
- [about_Type_Conversion](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_type_conversion) — PowerShell type system
- [about_Type_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_type_operators) — Operators working with .NET types
- [about_Types.ps1xml](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_types.ps1xml) — Extending object types
- [about_Updatable_Help](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_updatable_help) — Updatable help system
- [about_Update_Notifications](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_update_notifications) — Update notifications
- [about_Variable_Provider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_variable_provider) — Variable provider
- [about_Windows_PowerShell_Compatibility](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_windows_powershell_compatibility) — Windows PowerShell Compatibility

**Source**: [about_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_variables) | [about_Arrays](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_arrays) | [about_Hash_Tables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hash_tables) | [about_Functions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions) | [about_Classes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes) | [about_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_operators) | [about_If](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_if) | [about_Switch](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_switch) | [about_For](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_for) | [about_ForEach](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_foreach) | [about_While](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_while) | [about_Do](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_do) | [about_Try_Catch_Finally](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_try_catch_finally) | [about_Error_Handling](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_error_handling) | [about_Scopes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scopes) | [about_Splatting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_splatting) | [about_Comment_Based_Help](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comment_based_help) | [about_Quoting_Rules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules) | [about_Regular_Expressions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_regular_expressions) | [about_Automatic_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables) | [about_Preference_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables) | [about_Enum](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_enum) | [about_Using](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_using) | [about_Requires](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_requires) | [about_Return](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_return) | [about_Break](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_break) | [about_Continue](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_continue) | [about_Throw](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_throw) | [about_Trap](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_trap) | [about_Objects](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_objects) | [about_Script_Blocks](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_script_blocks) | [about_Pipelines](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines) | [about_Profiles](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles) | [about_Scripts](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scripts) | [about_Modules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_modules) | [about_Aliases](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_aliases) | [about_Environment_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables) | [about_Data_Sections](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_data_sections) | [about_Wildcards](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_wildcards) | [about_Booleans](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_booleans) | [about_Numeric_Literals](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_numeric_literals) | [about_Type_Accelerators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_type_accelerators) | [about_String_Comparison](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_string_comparison) | [about_ANSI_Terminals](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_ansi_terminals) | [about_Assignment_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_assignment_operators) | [about_Built-in_Functions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_built-in_functions) | [about_Calling_Generic_Methods](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_calling_generic_methods) | [about_Case-Sensitivity](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_case-sensitivity) | [about_Character_Encoding](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding) | [about_Classes_Constructors](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_constructors) | [about_Classes_Inheritance](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_inheritance) | [about_Classes_Methods](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_methods) | [about_Classes_Properties](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes_properties) | [about_Command_Precedence](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_command_precedence) | [about_Command_Syntax](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_command_syntax) | [about_Comments](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comments) | [about_CommonParameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_commonparameters) | [about_Core_Commands](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_core_commands) | [about_Data_Files](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_data_files) | [about_Debuggers](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_debuggers) | [about_Foreach](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_foreach) | [about_Format.ps1xml](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_format.ps1xml) | [about_Functions_Advanced_Methods](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced_methods) | [about_Functions_Argument_Completion](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_argument_completion) | [about_Hidden](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hidden) | [about_History](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_history) | [about_Intrinsic_Members](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_intrinsic_members) | [about_Join](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_join) | [about_Language_Modes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_modes) | [about_Line_Editing](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_line_editing) | [about_Locations](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_locations) | [about_Output_Streams](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_output_streams) | [about_Parameter_Binding](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parameter_binding) | [about_Parameter_Sets](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parameter_sets) | [about_Parameters_Default_Values](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parameters_default_values) | [about_Path_Syntax](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_path_syntax) | [about_Pipeline_Chain_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipeline_chain_operators) | [about_Prompts](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_prompts) | [about_PSConsoleHostReadLine](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_psconsolehostreadline) | [about_PSCustomObject](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pscustomobject) | [about_PSItem](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_psitem) | [about_Pwsh](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pwsh) | [about_Redirection](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_redirection) | [about_Reserved_Words](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_reserved_words) | [about_Run_With_PowerShell](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_run_with_powershell) | [about_Script_Internationalization](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_script_internationalization) | [about_Special_Characters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_special_characters) | [about_Split](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_split) | [about_Tab_Expansion](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_tab_expansion) | [about_Telemetry](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_telemetry) | [about_Thread_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_thread_jobs) | [about_Type_Conversion](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_type_conversion) | [about_Type_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_type_operators) | [about_Types.ps1xml](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_types.ps1xml) | [about_Updatable_Help](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_updatable_help) | [about_Update_Notifications](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_update_notifications) | [about_Variable_Provider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_variable_provider) | [about_Windows_PowerShell_Compatibility](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_windows_powershell_compatibility) | [Language Spec](https://learn.microsoft.com/en-us/powershell/scripting/lang-spec/chapter-01)
