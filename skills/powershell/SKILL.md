# PowerShell Skill

> **PowerShell** — Task-based command-line shell and scripting language for system administration.
> **Version**: PowerShell 7.6 (latest) + Windows PowerShell 5.1 | **Docs**: [learn.microsoft.com/powershell](https://learn.microsoft.com/en-us/powershell/)

## Quick Reference

| Topic | File | Sections |
|-------|------|----------|
| Getting Started | `getting-started.md` | What is PowerShell, installation, versions, execution policy, console/ISE/VS Code, Get-Help, $PSVersionTable |
| Language | `language.md` | Variables, arrays, hashtables, strings, operators, control flow, functions, classes, error handling, about_ topics, scope |
| Cmdlets & Modules | `cmdlets-modules.md` | Core modules, cmdlet reference, pipeline, providers, PSDrives, PSResourceGet, PowerShell Gallery, utility modules |
| Remoting & Security | `remoting-security.md` | WinRM/SSH remoting, sessions, CIM/WMI, JEA, execution policies, SecureString, DSC, security features |

## Core Concepts

- **Cmdlet**: Compiled .NET command following Verb-Noun naming (e.g., `Get-Process`, `Set-Item`)
- **Module**: Package containing cmdlets, providers, functions, aliases (e.g., `Microsoft.PowerShell.Management`)
- **Pipeline**: Object-based pipeline passing .NET objects between commands
- **Provider**: Access data stores like filesystem, registry, certificate store as drives (PSDrive)
- **PSDrive**: Virtual drive mapped to a provider path (e.g., `HKLM:\`, `Cert:\`, `Env:\`)
- **Runspace**: Operating environment for PowerShell commands
- **Session (PSSession)**: Persistent remote PowerShell connection
- **DSC**: Desired State Configuration for declarative infrastructure management
- **Execution Policy**: Controls script execution (Restricted, RemoteSigned, Unrestricted, AllSigned, Bypass)

## PowerShell Versions

| Version | Runtime | Status |
|---------|---------|--------|
| **PowerShell 7.6** | .NET 9 | Current (cross-platform) |
| **PowerShell 7.4/7.5** | .NET 8 | Supported (LTS) |
| **Windows PowerShell 5.1** | .NET Framework 4.x | Built into Windows (maintenance only) |
| **PowerShell 6.x** | .NET Core 2.x | End of life |

## Core Modules

| Module | Description |
|--------|-------------|
| `Microsoft.PowerShell.Core` | Core cmdlets (Get-Command, Get-Module, Invoke-Command, etc.) |
| `Microsoft.PowerShell.Management` | Management cmdlets (Get-Process, Get-Service, Get-Item, etc.) |
| `Microsoft.PowerShell.Utility` | Utility cmdlets (Get-Date, Select-Object, Sort-Object, Write-Output, etc.) |
| `Microsoft.PowerShell.Security` | Security cmdlets (Get-Acl, Set-Acl, ConvertTo-SecureString, etc.) |
| `Microsoft.PowerShell.Host` | Host integration cmdlets |
| `Microsoft.WsMan.Management` | WS-Management remoting cmdlets |
| `Microsoft.PowerShell.PSResourceGet` | Module/script installation from Gallery (replaces PowerShellGet) |

## Common Cmdlet Verbs

| Verb | Purpose | Examples |
|------|---------|---------|
| Get | Retrieve | Get-Process, Get-Service, Get-ChildItem |
| Set | Modify | Set-Item, Set-Location, Set-Content |
| New | Create | New-Item, New-Object, New-PSSession |
| Remove | Delete | Remove-Item, Remove-Module |
| Add | Append | Add-Content, Add-Member |
| Export | Output to file | Export-Csv, Export-Clixml, Export-ModuleMember |
| Import | Load from file | Import-Csv, Import-Module |
| Convert | Transform | ConvertTo-Json, ConvertFrom-Json, ConvertTo-Html |
| Write | Output | Write-Output, Write-Error, Write-Verbose, Write-Host |
| Test | Validate | Test-Path, Test-Connection |
| Invoke | Execute | Invoke-Command, Invoke-Expression, Invoke-WebRequest |
| Start/Stop | Lifecycle | Start-Process, Stop-Process, Start-Job |
| Enable/Disable | Toggle | Enable-PSRemoting, Disable-PSRemoting |

## Quick Start

```powershell
# Check version
$PSVersionTable

# Find commands
Get-Command -Verb Get -Noun Process
Get-Help Get-Process -Examples

# Pipeline
Get-Process | Where-Object CPU -gt 10 | Sort-Object CPU -Descending | Select-Object -First 5

# Remoting
Enter-PSSession -ComputerName Server01
Invoke-Command -ComputerName Server01,Server02 -ScriptBlock { Get-Service }

# Install module
Install-PSResource -Name Pester -Repository PSGallery

# Profile
$PROFILE | Format-List *
```

## Documentation Links

### Getting Started
- [PowerShell Documentation](https://learn.microsoft.com/en-us/powershell/)
- [How to use the PowerShell documentation](https://learn.microsoft.com/en-us/powershell/scripting/how-to-use-docs)
- [Getting Started with Windows PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/getting-started/getting-started-with-windows-powershell)
- [Installing PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell)
- [Migrating from Windows PowerShell 5.1 to PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7)
- [PowerShell 101](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started)
- [About Execution Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)

### Language
- [PowerShell Language Specification](https://learn.microsoft.com/en-us/powershell/scripting/lang-spec/chapter-01)
- [about_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_variables)
- [about_Arrays](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_arrays)
- [about_Hash_Tables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hash_tables)
- [about_Functions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions)
- [about_Classes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_classes)
- [about_If](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_if)
- [about_For](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_for)
- [about_ForEach](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_foreach)
- [about_While](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_while)
- [about_Switch](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_switch)
- [about_Try_Catch_Finally](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_try_catch_finally)
- [about_Error_Handling](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_error_handling)
- [about_Scopes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scopes)
- [about_Parameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parameters)
- [about_Pipelines](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines)
- [about_Objects](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_objects)
- [about_Properties](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_properties)
- [about_Methods](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_methods)
- [about_Regular_Expressions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_regular_expressions)
- [about_Quoting_Rules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules)
- [about_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_operators)
- [about_Comparison_Operators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comparison_operators)
- [about_Type_Accelerators](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_type_accelerators)
- [about_Automatic_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables)
- [about_Preference_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables)
- [about_Profiles](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles)
- [about_Scripts](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scripts)
- [about_Comment_Based_Help](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_comment_based_help)
- [about_Modules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_modules)
- [about_Remote](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote)
- [about_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_jobs)
- [about_Providers](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_providers)
- [about_Aliases](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_aliases)
- [about_Environment_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)
- [about_Data_Sections](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_data_sections)
- [about_Splatting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_splatting)
- [about_Functions_Advanced](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced)
- [about_Functions_Advanced_Parameters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced_parameters)
- [about_Functions_CmdletBindingAttribute](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_cmdletbindingattribute)
- [about_Functions_OutputTypeAttribute](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_outputtypeattribute)
- [about_Return](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_return)
- [about_Ref](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_ref)
- [about_Enum](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_enum)
- [about_Using](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_using)
- [about_Requires](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_requires)
- [about_Do](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_do)
- [about_While](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_while)
- [about_Break](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_break)
- [about_Continue](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_continue)
- [about_Throw](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_throw)
- [about_Trap](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_trap)
- [about_Wildcards](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_wildcards)
- [about_Hash_Tables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hash_tables)
- [about_Calculated_Properties](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_calculated_properties)
- [about_Booleans](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_booleans)
- [about_Numeric_Literals](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_numeric_literals)
- [about_Numeric_Type_Characters](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_numeric_type_characters)
- [about_Non_Evaluating_Properties](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_non_evaluating_properties)
- [about_String_Comparison](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_string_comparison)
- [about_Simplified_Syntax](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_simplified_syntax)
- [about_DSC](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_dsc)
- [about_Language_Keywords](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_keywords)
- [about_Parsing](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parsing)
- [about_Script_Blocks](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_script_blocks)
- [about_Splatting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_splatting)

### Cmdlets & Modules
- [Microsoft.PowerShell.Core Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/)
- [Microsoft.PowerShell.Management Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/)
- [Microsoft.PowerShell.Utility Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/)
- [Microsoft.PowerShell.Security Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/)
- [Microsoft.WsMan.Management Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.wsman.management/)
- [Microsoft.PowerShell.PSResourceGet Module](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.psresourceget/)
- [PowerShellGet Module](https://learn.microsoft.com/en-us/powershell/module/powershellget/)
- [PowerShell Utility Modules](https://learn.microsoft.com/en-us/powershell/utility-modules/overview)
- [PlatyPS](https://learn.microsoft.com/en-us/powershell/module/platyps/)
- [PSScriptAnalyzer](https://learn.microsoft.com/en-us/powershell/module/psscriptanalyzer/)
- [Release History of Modules and Cmdlets](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/cmdlet-versions)
- [PowerShell Gallery](https://learn.microsoft.com/en-us/powershell/gallery/overview)
- [Getting Started with PowerShell Gallery](https://learn.microsoft.com/en-us/powershell/gallery/getting-started)
- [Install PSResourceGet](https://learn.microsoft.com/en-us/powershell/gallery/powershellget/install-powershellget)
- [Module Browser](https://learn.microsoft.com/en-us/powershell/module/)
- [about_PSResourceGet](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.psresourceget/about/about_psresourceget)

### Remoting & Security
- [Running Remote Commands](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/running-remote-commands)
- [SSH Remoting in PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/ssh-remoting-in-powershell)
- [WSMan Remoting in PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/wsman-remoting-in-powershell)
- [PowerShell Remoting FAQ](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/powershell-remoting-faq)
- [PowerShell Security Features](https://learn.microsoft.com/en-us/powershell/scripting/security/security-features)
- [about_Remote](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote)
- [about_Remote_Requirements](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_requirements)
- [about_Remote_Output](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_output)
- [about_Remote_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_jobs)
- [about_Remote_Disconnected_Sessions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_disconnected_sessions)
- [about_Remote_Troubleshooting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_troubleshooting)
- [about_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_jobs)
- [about_Scheduled_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scheduled_jobs)
- [about_Runspaces](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_runspaces)

### DSC
- [DSC Overview](https://learn.microsoft.com/en-us/powershell/dsc/overview/overview)
- [DSC Configurations](https://learn.microsoft.com/en-us/powershell/dsc/configurations/configurations)
- [DSC Resources](https://learn.microsoft.com/en-us/powershell/dsc/concepts/resources)
- [DSC Configuration Documents](https://learn.microsoft.com/en-us/powershell/dsc/concepts/configuration-documents/overview)
- [Write, Compile, and Apply a Configuration](https://learn.microsoft.com/en-us/powershell/dsc/configurations/write-compile-apply-configuration)
- [Managing Nodes (MetaConfig)](https://learn.microsoft.com/en-us/powershell/dsc/managing-nodes/metaconfig)
- [DSC Pull Server](https://learn.microsoft.com/en-us/powershell/dsc/pull-server/pullserver)
- [DSC Partial Configurations](https://learn.microsoft.com/en-us/powershell/dsc/pull-server/partialconfigs)

### Deep Dives
- [Everything About Arrays](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-arrays)
- [Everything About Hashtables](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-hashtable)
- [Everything About Strings](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-string-substitutions)
- [Everything About PSCustomObject](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-pscustomobject)
- [Everything About Null](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-null)

### PowerShell SDK (Developer)
- [Windows PowerShell SDK](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell)
- [Writing a PowerShell Module](https://learn.microsoft.com/en-us/powershell/scripting/developer/module/writing-a-windows-powershell-module)
- [Writing a PowerShell Cmdlet](https://learn.microsoft.com/en-us/powershell/scripting/developer/cmdlet/writing-a-windows-powershell-cmdlet)
- [PowerShell SDK Reference](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell-reference)
- [Hosting Runspaces](https://learn.microsoft.com/en-us/powershell/scripting/developer/hosting/runspace04-sample)

### What's New
- [What's New in PowerShell 7.6](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/what-s-new-in-powershell-76)
- [What's New in PowerShell 7.5](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/what-s-new-in-powershell-75)
- [What's New in PowerShell 7.4](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/what-s-new-in-powershell-74)
- [PowerShell Changelog](https://github.com/PowerShell/PowerShell/releases)

### Community
- [PowerShell Community](https://learn.microsoft.com/en-us/powershell/scripting/community/)
- [Contributing to PowerShell Docs](https://learn.microsoft.com/en-us/powershell/scripting/community/contributing/get-started-writing)
- [PowerShell Team Blog](https://devblogs.microsoft.com/powershell/)
- [GitHub: PowerShell/PowerShell](https://github.com/PowerShell/PowerShell)

### Deep Dives
- [Deep Dives Overview](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/overview)
- [Everything about arrays](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-arrays)
- [Everything about hashtables](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-hashtable)
- [Everything about PSCustomObject](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-pscustomobject)
- [Everything about string substitution](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-string-substitutions)
- [Everything about if/then/else](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-if)
- [Everything about switch](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-switch)
- [Everything about exceptions](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-exceptions)
- [Everything about $null](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-null)
- [Everything about ShouldProcess](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-shouldprocess)
- [Output missing from transcript](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/output-missing-from-transcript)
- [Avoid using Invoke-Expression](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/avoid-using-invoke-expression)
- [Avoid assigning variables in expressions](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/avoid-assigning-variables-in-expressions)
- [Add credentials to PowerShell functions](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/add-credentials-to-powershell-functions)
- [Write progress across multiple threads](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/write-progress-across-multiple-threads)

### Cross-Platform Development
- [Create Standard Library binary module](https://learn.microsoft.com/en-us/powershell/scripting/dev-cross-plat/create-standard-library-binary-module)
- [VS Code for debugging compiled cmdlets](https://learn.microsoft.com/en-us/powershell/scripting/dev-cross-plat/vscode/using-vscode-for-debugging-compiled-cmdlets)

### SDK Installation
- [Installing the Windows PowerShell SDK](https://learn.microsoft.com/en-us/powershell/scripting/developer/installing-the-windows-powershell-sdk)

### SecretManagement
- [SecretManagement](https://learn.microsoft.com/en-us/powershell/utility-modules/secretmanagement)

**Source**: [PowerShell Docs](https://learn.microsoft.com/en-us/powershell/) | [PowerShell 101](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started) | [Language Spec](https://learn.microsoft.com/en-us/powershell/scripting/lang-spec/chapter-01) | [Module Browser](https://learn.microsoft.com/en-us/powershell/module/) | [DSC](https://learn.microsoft.com/en-us/powershell/dsc/overview/overview) | [Security](https://learn.microsoft.com/en-us/powershell/scripting/security/security-features) | [SDK](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell) | [Gallery](https://learn.microsoft.com/en-us/powershell/gallery/overview) | [What's New](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/what-s-new-in-powershell-76) | [Community](https://learn.microsoft.com/en-us/powershell/scripting/community/) | [Deep Dives](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/overview) | [SecretManagement](https://learn.microsoft.com/en-us/powershell/utility-modules/secretmanagement) | [SDK Install](https://learn.microsoft.com/en-us/powershell/scripting/developer/installing-the-windows-powershell-sdk)
