# PowerShell — Cmdlets & Modules

## Core Modules

### Microsoft.PowerShell.Core

Fundamental cmdlets for the shell itself.

| Cmdlet | Description |
|--------|-------------|
| `Get-Command` | Lists all commands |
| `Get-Help` | Displays help |
| `Get-Module` | Lists loaded modules |
| `Import-Module` | Loads a module |
| `Remove-Module` | Unloads a module |
| `Invoke-Command` | Runs commands locally or remotely |
| `Enter-PSSession` | Starts interactive remote session |
| `Exit-PSSession` | Ends remote session |
| `New-PSSession` | Creates persistent session |
| `Remove-PSSession` | Closes session |
| `Get-PSSession` | Lists sessions |
| `Start-Job` | Starts background job |
| `Get-Job` | Gets job results |
| `Receive-Job` | Gets job output |
| `Stop-Job` | Stops job |
| `Wait-Job` | Waits for job completion |
| `Remove-Job` | Deletes job |
| `Measure-Command` | Measures execution time |
| `Select-Object` | Selects object properties |
| `ForEach-Object` | Iterates pipeline objects |
| `Where-Object` | Filters pipeline objects |
| `Sort-Object` | Sorts objects |
| `Group-Object` | Groups objects by property |
| `Compare-Object` | Compares two object sets |
| `New-Object` | Creates .NET object |
| `Add-Member` | Adds properties/methods to object |

### Microsoft.PowerShell.Management

Cmdlets for managing the system.

| Cmdlet | Description |
|--------|-------------|
| `Get-ChildItem` (gci/ls/dir) | Lists items in a location |
| `Get-Item` | Gets item at location |
| `Set-Item` | Sets item value |
| `New-Item` | Creates new item |
| `Remove-Item` | Deletes item |
| `Copy-Item` | Copies item |
| `Move-Item` | Moves item |
| `Rename-Item` | Renames item |
| `Clear-Item` | Clears item content |
| `Get-Content` | Reads content |
| `Set-Content` | Writes content |
| `Add-Content` | Appends content |
| `Clear-Content` | Clears content |
| `Get-Process` | Gets processes |
| `Stop-Process` | Stops process |
| `Start-Process` | Starts process |
| `Wait-Process` | Waits for process |
| `Get-Service` | Gets services |
| `Start-Service` | Starts service |
| `Stop-Service` | Stops service |
| `Restart-Service` | Restarts service |
| `Set-Service` | Modifies service |
| `Get-ItemProperty` | Gets registry/file properties |
| `Set-ItemProperty` | Sets registry/file properties |
| `Remove-ItemProperty` | Removes property |
| `New-ItemProperty` | Creates new property |
| `Get-Location` (gl/pwd) | Gets current location |
| `Set-Location` (sl/cd) | Changes location |
| `Push-Location` (pushd) | Pushes location to stack |
| `Pop-Location` (popd) | Pops location from stack |
| `Test-Path` | Tests path existence |
| `Resolve-Path` | Resolves wildcard path |
| `Split-Path` | Splits path |
| `Join-Path` | Joins path |
| `Convert-Path` | Converts path |
| `Out-Printer` | Sends to printer |
| `Get-ComputerInfo` | Gets computer information |
| `Restart-Computer` | Restarts computer |
| `Stop-Computer` | Shuts down computer |
| `Test-Connection` | Pings computers |
| `Clear-RecycleBin` | Empties recycle bin |
| `Get-EventLog` | Gets event logs |
| `Write-EventLog` | Writes to event log |

### Microsoft.PowerShell.Utility

General-purpose cmdlets.

| Cmdlet | Description |
|--------|-------------|
| `Get-Date` | Gets current date/time |
| `Set-Date` | Sets system date/time |
| `Get-Random` | Gets random number/item |
| `Measure-Object` | Measures numeric properties |
| `Select-String` | Searches text with regex |
| `Format-Table` (ft) | Formats as table |
| `Format-List` (fl) | Formats as list |
| `Format-Wide` (fw) | Formats wide |
| `Format-Custom` (fc) | Custom format |
| `Out-File` | Sends to file |
| `Out-String` | Sends as string |
| `Out-GridView` | Sends to grid view |
| `Out-Null` | Discards output |
| `Out-Default` | Default output |
| `ConvertTo-Csv` | Converts to CSV |
| `ConvertFrom-Csv` | Converts from CSV |
| `Export-Csv` | Exports to CSV file |
| `Import-Csv` | Imports from CSV file |
| `ConvertTo-Json` | Converts to JSON |
| `ConvertFrom-Json` | Converts from JSON |
| `ConvertTo-Html` | Converts to HTML |
| `ConvertTo-Xml` | Converts to XML |
| `Write-Output` | Writes to pipeline |
| `Write-Host` | Writes to console |
| `Write-Error` | Writes error |
| `Write-Warning` | Writes warning |
| `Write-Verbose` | Writes verbose message |
| `Write-Debug` | Writes debug message |
| `Write-Information` | Writes information record |
| `Write-Progress` | Writes progress bar |
| `Get-Member` | Gets object members |
| `Add-Member` | Adds member to object |
| `Compare-Object` | Compares object sets |
| `Export-Clixml` | Exports to Clixml |
| `Import-Clixml` | Imports from Clixml |
| `Select-Object` | Selects properties |
| `Sort-Object` | Sorts objects |
| `Group-Object` | Groups objects |
| `Where-Object` | Filters objects |
| `ForEach-Object` | Iterates objects |
| `Tee-Object` | Saves input to file/pipeline |
| `New-Guid` | Creates new GUID |
| `New-TemporaryFile` | Creates temp file |
| `Invoke-WebRequest` (iwr) | HTTP request |
| `Invoke-RestMethod` (irm) | REST API request |
| `Invoke-Expression` (iex) | Evaluates string as command |
| `Send-MailMessage` | Sends email |
| `Start-Sleep` | Pauses execution |
| `Show-Command` | Shows command GUI |
| `Update-List` | Updates collection property |
| `Debug-Runspace` | Debugs runspace |
| `Get-Runspace` | Gets runspaces |
| `Enable-RunspaceDebug` | Enables runspace debugging |
| `Get-Verb` | Lists approved verbs |

### Microsoft.PowerShell.Security

| Cmdlet | Description |
|--------|-------------|
| `Get-Acl` | Gets ACL |
| `Set-Acl` | Sets ACL |
| `Get-ExecutionPolicy` | Gets execution policy |
| `Set-ExecutionPolicy` | Sets execution policy |
| `ConvertTo-SecureString` | Converts to SecureString |
| `ConvertFrom-SecureString` | Converts from SecureString |
| `Get-PfxCertificate` | Gets PFX certificate info |
| `Protect-CmsMessage` | Encrypts CMS message |
| `Unprotect-CmsMessage` | Decrypts CMS message |
| `Get-CmsMessage` | Gets CMS message |
| `New-FileCatalog` | Creates file catalog |
| `Test-FileCatalog` | Tests file catalog |

### Microsoft.WsMan.Management

| Cmdlet | Description |
|--------|-------------|
| `Connect-WSMan` | Connects to WS-Management |
| `Disconnect-WSMan` | Disconnects |
| `Get-WSManInstance` | Gets WS-Management instance |
| `Set-WSManInstance` | Sets WS-Management instance |
| `Remove-WSManInstance` | Removes WS-Management instance |
| `New-WSManInstance` | Creates WS-Management instance |
| `New-WSManSessionOption` | Creates session option |
| `Test-WSMan` | Tests WS-Management |
| `Enable-WSManCredSSP` | Enables CredSSP |
| `Disable-WSManCredSSP` | Disables CredSSP |
| `Get-WSManCredSSP` | Gets CredSSP status |
| `Set-Item` (WSMan:) | Configures WSMan provider |

**Source**: [Microsoft.PowerShell.Core](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/) | [Microsoft.PowerShell.Management](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/) | [Microsoft.PowerShell.Utility](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/) | [Microsoft.PowerShell.Security](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/) | [Microsoft.WsMan.Management](https://learn.microsoft.com/en-us/powershell/module/microsoft.wsman.management/) | [Release History](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/cmdlet-versions)

## The Pipeline

### Object-Based Pipeline

PowerShell passes .NET objects between commands, not text.

```powershell
# Objects flow through pipeline
Get-Process |
    Where-Object { $_.CPU -gt 10 } |
    Sort-Object CPU -Descending |
    Select-Object Name, CPU, Id -First 5 |
    Format-Table -AutoSize
```

### Pipeline Binding

```powershell
# ValueFromPipeline
function Set-Color {
    param(
        [Parameter(ValueFromPipeline)]
        [string]$Name
    )
    process { "Color: $Name" }
}
'red', 'green', 'blue' | Set-Color

# ValueFromPipelineByPropertyName
function Get-FileInfo {
    param(
        [Parameter(ValueFromPipelineByPropertyName)]
        [string]$FullName
    )
    process { (Get-Item $FullName).Length }
}
Get-ChildItem *.txt | Get-FileInfo
```

### Pipeline Operators

```powershell
# Where-Object (filter)
Get-Service | Where-Object Status -eq 'Running'
Get-Service | Where-Object { $_.Status -eq 'Running' -and $_.Name -like 'a*' }

# ForEach-Object (map)
1..5 | ForEach-Object { $_ * 2 }
1..5 | ForEach-Object -Begin { $sum = 0 } -Process { $sum += $_ } -End { $sum }

# Select-Object (project/slice)
Get-Process | Select-Object -First 5
Get-Process | Select-Object -Last 3
Get-Process | Select-Object -Skip 2 -First 5
Get-Process | Select-Object -Unique Name
Get-Process | Select-Object Name, @{N='MB';E={[math]::Round($_.WorkingSet/1MB,2)}}

# Sort-Object
Get-Process | Sort-Object CPU -Descending
Get-Process | Sort-Object Name, CPU -Descending

# Group-Object
Get-Service | Group-Object Status
Get-ChildItem | Group-Object Extension | Sort-Object Count -Descending

# Tee-Object
Get-Process | Tee-Object -FilePath processes.txt | Select-Object -First 5
```

**Source**: [about_Pipelines](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines) | [about_Objects](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_objects)

## Providers and PSDrives

### Built-in Providers

| Provider | Drive | Description |
|----------|-------|-------------|
| FileSystem | `C:\`, `D:\` | File system |
| Registry | `HKLM:\`, `HKCU:\` | Windows Registry |
| Certificate | `Cert:\` | Certificate store |
| Environment | `Env:\` | Environment variables |
| Variable | `Variable:\` | PowerShell variables |
| Function | `Function:\` | PowerShell functions |
| Alias | `Alias:\` | PowerShell aliases |
| WSMan | `WSMan:\` | WS-Management config |
| Registry | `Registry::` | Raw registry access |

### Using Providers

```powershell
# List providers
Get-PSProvider

# List drives
Get-PSDrive

# Create new PSDrive
New-PSDrive -Name 'Logs' -PSProvider FileSystem -Root '\\server\share\logs'

# Navigate
Set-Location HKLM:\SOFTWARE\Microsoft
Set-Location Cert:\CurrentUser\My
Set-Location Env:

# Use provider
Get-ChildItem HKLM:\SOFTWARE
Get-Item Env:PATH
Get-ChildItem Cert:\LocalMachine\My
```

**Source**: [about_Providers](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_providers) | [Get-PSProvider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-psprovider) | [Get-PSDrive](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-psdrive) | [New-PSDrive](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/new-psdrive)

## Modules

### Module Types

| Type | Extension | Description |
|------|-----------|-------------|
| Script module | `.psm1` | PowerShell script |
| Binary module | `.dll` | Compiled .NET assembly |
| Manifest module | `.psd1` | Module with manifest |
| Dynamic module | N/A | Created with `New-Module` |

### Module Management

```powershell
# List available modules
Get-Module -ListAvailable

# Import module
Import-Module -Name ActiveDirectory
Import-Module -Name .\MyModule.psm1

# Remove module
Remove-Module -Name ActiveDirectory

# Get imported modules
Get-Module

# Find modules in gallery
Find-Module -Name Pester

# Install module (PSResourceGet)
Install-PSResource -Name Pester -Repository PSGallery

# Install module (legacy PowerShellGet)
Install-Module -Name Pester -Repository PSGallery -Force

# Update module
Update-PSResource -Name Pester

# Publish module
Publish-PSResource -Path C:\MyModule -Repository PSGallery -ApiKey 'key'

# Get installed resources
Get-InstalledPSResource

# Save module (without installing)
Save-PSResource -Name Pester -Path C:\Modules
```

### Module Manifest

```powershell
@{
    RootModule        = 'MyModule.psm1'
    ModuleVersion     = '1.0.0'
    GUID              = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    Author            = 'Your Name'
    CompanyName       = 'Your Company'
    Description       = 'Module description'
    PowerShellVersion = '7.0'
    FunctionsToExport = @('Get-MyData', 'Set-MyData')
    CmdletsToExport   = @()
    VariablesToExport = @()
    AliasesToExport   = @('gmd', 'smd')
    RequiredModules   = @('ActiveDirectory')
    RequiredAssemblies = @()
    HelpInfoURI       = 'https://example.com/help'
}
```

### Creating a Module

```powershell
# MyModule.psm1
function Get-MyData {
    [CmdletBinding()]
    param([string]$Name)
    "Data for: $Name"
}

function Set-MyData {
    [CmdletBinding()]
    param([string]$Name, [string]$Value)
    "Set $Name = $Value"
}

Export-ModuleMember -Function Get-MyData, Set-MyData
```

**Source**: [about_Modules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_modules) | [Import-Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/import-module) | [Get-Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-module) | [New-ModuleManifest](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/new-modulemanifest)

## PowerShell Gallery

### PSResourceGet (Current)

```powershell
# Register repository
Register-PSResourceRepository -Name PSGallery -URL 'https://www.powershellgallery.com/api/v2'

# Find
Find-PSResource -Name Pester
Find-PSResource -Tag 'DSC'

# Install
Install-PSResource -Name Pester -Version '5.5.0'

# Update
Update-PSResource -Name Pester

# Get installed
Get-InstalledPSResource

# Uninstall
Uninstall-PSResource -Name Pester

# Publish
Publish-PSResource -Path C:\MyModule -Repository PSGallery -ApiKey $key
```

### PowerShellGet (Legacy v2)

```powershell
# Find
Find-Module -Name Pester -Repository PSGallery

# Install
Install-Module -Name Pester -Repository PSGallery -Force -AllowClobber

# Update
Update-Module -Name Pester

# Uninstall
Uninstall-Module -Name Pester

# Save (without install)
Save-Module -Name Pester -Path C:\Modules

# Publish
Publish-Module -Path C:\MyModule -NuGetApiKey $key
```

**Source**: [PowerShell Gallery](https://learn.microsoft.com/en-us/powershell/gallery/overview) | [Getting Started with Gallery](https://learn.microsoft.com/en-us/powershell/gallery/getting-started) | [PSResourceGet](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.psresourceget/) | [about_PSResourceGet](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.psresourceget/about/about_psresourceget) | [PowerShellGet](https://learn.microsoft.com/en-us/powershell/module/powershellget/)

## Utility Modules

| Module | Description |
|--------|-------------|
| [PlatyPS](https://learn.microsoft.com/en-us/powershell/module/platyps/) | Generate Markdown from cmdlet help |
| [PSScriptAnalyzer](https://learn.microsoft.com/en-us/powershell/module/psscriptanalyzer/) | Static code analyzer for PowerShell |

### PSScriptAnalyzer

```powershell
# Install
Install-PSResource -Name PSScriptAnalyzer

# Analyze script
Invoke-ScriptAnalyzer -Path .\myscript.ps1

# Analyze with custom rules
Invoke-ScriptAnalyzer -Path .\myscript.ps1 -CustomRulePath .\rules

# Get available rules
Get-ScriptAnalyzerRule
```

### PlatyPS

```powershell
# Install
Install-PSResource -Name PlatyPS

# Generate Markdown help
New-MarkdownHelp -Command Get-MyData -OutputFolder .\docs

# Update existing help
Update-MarkdownHelp -Path .\docs

# Create external help (MAML)
New-ExternalHelp -Path .\docs -OutputPath .\out\en-US
```

**Source**: [PowerShell Utility Modules](https://learn.microsoft.com/en-us/powershell/utility-modules/overview) | [PlatyPS](https://learn.microsoft.com/en-us/powershell/module/platyps/) | [PSScriptAnalyzer](https://learn.microsoft.com/en-us/powershell/module/psscriptanalyzer/)

## Formatting Output

```powershell
# Format-Table
Get-Process | Format-Table Name, CPU, Id -AutoSize

# Format-List
Get-Process | Format-List Name, CPU, Id, Path

# Format-Wide
Get-Process | Format-Wide Name -Column 3

# Custom calculated properties
Get-Process | Format-Table Name,
    @{N='Memory(MB)';E={[math]::Round($_.WorkingSet/1MB,2)};FormatString='N2'},
    @{N='CPU(s)';E={[math]::Round($_.CPU,1)}}

# Grouping
Get-Service | Format-Table -GroupBy Status

# Out-File
Get-Process | Out-File -FilePath processes.txt -Encoding utf8

# Export-Csv
Get-Process | Export-Csv -Path processes.csv -NoTypeInformation

# ConvertTo-Json
Get-Process | Select-Object Name, Id | ConvertTo-Json -Depth 3

# ConvertTo-Html
Get-Process | ConvertTo-Html -Property Name, CPU, Id | Out-File report.html
```

**Source**: [Format-Table](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/format-table) | [Format-List](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/format-list) | [Export-Csv](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/export-csv) | [ConvertTo-Json](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/convertto-json) | [ConvertTo-Html](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/convertto-html)

**Source**: [Core Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/) | [Management Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/) | [Utility Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/) | [Security Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/) | [WsMan Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.wsman.management/) | [PSResourceGet](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.psresourceget/) | [PowerShellGet](https://learn.microsoft.com/en-us/powershell/module/powershellget/) | [Gallery](https://learn.microsoft.com/en-us/powershell/gallery/overview) | [Utility Modules](https://learn.microsoft.com/en-us/powershell/utility-modules/overview) | [PlatyPS](https://learn.microsoft.com/en-us/powershell/module/platyps/) | [PSScriptAnalyzer](https://learn.microsoft.com/en-us/powershell/module/psscriptanalyzer/) | [Release History](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/cmdlet-versions) | [Module Browser](https://learn.microsoft.com/en-us/powershell/module/) | [about_Pipelines](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines) | [about_Providers](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_providers) | [about_Modules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_modules) | [about_Alias_Provider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_alias_provider) | [about_Environment_Provider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_provider) | [about_FileSystem_Provider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_filesystem_provider) | [about_Function_Provider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_function_provider) | [about_Registry_Provider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_registry_provider) | [about_Variable_Provider](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_variable_provider) | [about_Experimental_Features](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_experimental_features) | [about_Group_Policy_Settings](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_group_policy_settings) | [about_PackageManagement](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_packagemanagement) | [about_PowerShell_Config](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_powershell_config) | [about_PowerShell_Editions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_powershell_editions) | [about_PSModulePath](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_psmodulepath) | [about_PSSessions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pssessions) | [about_PSSession_Details](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pssession_details)
