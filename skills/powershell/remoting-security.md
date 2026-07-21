# PowerShell — Remoting & Security

## PowerShell Remoting

### Overview

PowerShell remoting lets you run commands on one or more remote computers. Two transport protocols are supported:

| Protocol | Platform | Features |
|----------|----------|----------|
| **WinRM (WS-Management)** | Windows | Full endpoint configuration, JEA, session configuration |
| **SSH** | Windows, Linux, macOS | Cross-platform, key-based auth, simpler setup |

### Enable Remoting

```powershell
# Enable WinRM remoting (Windows, admin required)
Enable-PSRemoting -Force

# Check WinRM service
Get-Service WinRM

# Configure trusted hosts (if not domain-joined)
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "Server01,Server02"
# Or wildcard
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "*"
```

### SSH Remoting Setup

```powershell
# SSH remoting (cross-platform)
# Requires OpenSSH on both client and target

# Create SSH-based session
$session = New-PSSession -HostName LinuxServer01 -UserName admin

# Enter interactive session
Enter-PSSession -HostName Server01 -UserName admin

# Run command via SSH
Invoke-Command -HostName Server01 -UserName admin -ScriptBlock { Get-Process }

# Key-based authentication
Enter-PSSession -HostName Server01 -UserName admin -KeyFilePath ~/.ssh/id_rsa
```

**Source**: [Running Remote Commands](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/running-remote-commands) | [SSH Remoting](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/ssh-remoting-in-powershell) | [WSMan Remoting](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/wsman-remoting-in-powershell) | [Remoting FAQ](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/powershell-remoting-faq)

## Sessions

### PSSession Management

```powershell
# Create session
$s = New-PSSession -ComputerName Server01

# Create session with credentials
$cred = Get-Credential
$s = New-PSSession -ComputerName Server01 -Credential $cred

# Create session with options
$opt = New-PSSessionOption -SkipCACheck -SkipCNCheck
$s = New-PSSession -ComputerName Server01 -SessionOption $opt -UseSSL

# Create multiple sessions
$sessions = New-PSSession -ComputerName Server01, Server02, Server03

# List sessions
Get-PSSession

# Enter session
Enter-PSSession -Session $s

# Run command in session
Invoke-Command -Session $s -ScriptBlock { Get-Service }

# Run on multiple sessions
Invoke-Command -Session $sessions -ScriptBlock { Get-Process }

# Disconnect (session persists on remote)
Disconnect-PSSession -Session $s

# Reconnect
Connect-PSSession -Session $s

# Remove session
Remove-PSSession -Session $s

# Remove all sessions
Get-PSSession | Remove-PSSession
```

### Invoke-Command Patterns

```powershell
# One-to-many
Invoke-Command -ComputerName SRV01,SRV02,SRV03 -ScriptBlock {
    Get-Service | Where-Object Status -eq 'Running'
}

# With parameters
Invoke-Command -ComputerName SRV01 -ScriptBlock {
    param($svc) Get-Service -Name $svc
} -ArgumentList 'WinRM'

# Using local variables ($using:)
$target = 'spooler'
Invoke-Command -ComputerName SRV01 -ScriptBlock {
    Get-Service -Name $using:target
}

# Asynchronous (returns job)
$job = Invoke-Command -ComputerName SRV01,SRV02 -ScriptBlock {
    Get-EventLog -LogName Application -Newest 10
} -AsJob -JobName EventLogCheck

Receive-Job -Job $job -Wait -AutoRemoveJob

# Throttle limit
Invoke-Command -ComputerName $servers -ScriptBlock { ... } -ThrottleLimit 10
```

**Source**: [about_Remote](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote) | [about_Remote_Requirements](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_requirements) | [about_Remote_Output](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_output) | [about_Remote_Disconnected_Sessions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_disconnected_sessions) | [about_Remote_Troubleshooting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_troubleshooting)

## Jobs

### Background Jobs

```powershell
# Start job
$job = Start-Job -ScriptBlock { Get-Process }

# Get job
Get-Job

# Receive results
Receive-Job -Job $job -Wait

# Receive and keep results
Receive-Job -Job $job -Keep

# Stop job
Stop-Job -Job $job

# Wait for job
Wait-Job -Job $job -Timeout 30

# Remove job
Remove-Job -Job $job

# Debug job
Debug-Job -Job $job
```

### Remote Jobs

```powershell
# Start remote job
$job = Invoke-Command -ComputerName SRV01 -ScriptBlock {
    Start-Job -ScriptBlock { Get-EventLog Application }
} -AsJob

# Workflow jobs (legacy)
# Scheduled jobs
$trigger = New-JobTrigger -Daily -At 3am
Register-ScheduledJob -Name DailyBackup -Trigger $trigger -ScriptBlock {
    Backup-Items
}
```

### Thread Jobs (PowerShell 7+)

```powershell
# Start thread job (lighter than background job)
Start-ThreadJob -ScriptBlock { Get-Process }

# ForEach-Object -Parallel (uses thread jobs)
1..10 | ForEach-Object -Parallel {
    Start-Sleep -Seconds $_
    "Done: $_"
} -ThrottleLimit 5
```

**Source**: [about_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_jobs) | [about_Remote_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_jobs) | [about_Scheduled_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scheduled_jobs) | [Debug-Job](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/debug-job)

## CIM and WMI

### CIM Cmdlets (Recommended)

```powershell
# Get CIM instance (replaces Get-WmiObject)
Get-CimInstance -ClassName Win32_BIOS
Get-CimInstance -ClassName Win32_OperatingSystem |
    Select-Object Caption, Version, BuildNumber

# Query remote computer
Get-CimInstance -ClassName Win32_Service -ComputerName SRV01 |
    Select-Object Name, State, StartMode

# Create CIM session
$sess = New-CimSession -ComputerName SRV01, SRV02
Get-CimInstance -CimSession $sess -ClassName Win32_Process

# Query with WQL
Get-CimInstance -Query "SELECT * FROM Win32_Process WHERE Name = 'pwsh.exe'"

# Invoke CIM method
$svc = Get-CimInstance -ClassName Win32_Service -Filter "Name='Spooler'"
Invoke-CimMethod -InputObject $svc -MethodName StartService

# Remove CIM session
Remove-CimSession -CimSession $sess
```

### WMI Cmdlets (Legacy)

```powershell
# Legacy WMI (deprecated, use CIM instead)
Get-WmiObject -Class Win32_BIOS
Get-WmiObject -Class Win32_Service -ComputerName SRV01
```

**Source**: [Working with WMI](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/07-working-with-wmi) | [Get-CimInstance](https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance) | [New-CimSession](https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/new-cimsession) | [Invoke-CimMethod](https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/invoke-cimmethod)

## Just Enough Administration (JEA)

JEA allows role-based administration with constrained PowerShell endpoints.

```powershell
# JEA requires:
# 1. Role capability file (.psrc)
# 2. Session configuration file (.pssc)
# 3. Register session configuration

# Create role capability
New-PSRoleCapabilityFile -Path .\Maintenance.psrc

# Create session config
New-PSSessionConfigurationFile -Path .\Maintenance.pssc `
    -SessionType RestrictedRemoteServer `
    -RunAsVirtualAccount `
    -RoleDefinitions @{
        'CONTOSO\JEARemoteUsers' = @{ RoleCapabilities = 'Maintenance' }
    }

# Register
Register-PSSessionConfiguration -Path .\Maintenance.pssc -Name Maintenance

# Connect to JEA endpoint
Enter-PSSession -ComputerName SRV01 -ConfigurationName Maintenance
```

**Source**: [JEA Overview](https://learn.microsoft.com/en-us/powershell/scripting/security/jea/overview) | [JEA Role Capabilities](https://learn.microsoft.com/en-us/powershell/scripting/security/jea/role-capabilities) | [JEA Session Configurations](https://learn.microsoft.com/en-us/powershell/scripting/security/jea/session-configurations)

## Security

### Execution Policies

```powershell
# Get current
Get-ExecutionPolicy

# Get all scopes
Get-ExecutionPolicy -List

# Set policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Policies (most to least restrictive):
# Restricted    - No scripts (default on Windows client)
# AllSigned     - Only signed scripts
# RemoteSigned  - Remote scripts must be signed, local OK
# Unrestricted  - All scripts with warning for remote
# Bypass        - No restrictions, no warnings
```

### SecureString

```powershell
# Create SecureString
$secure = ConvertTo-SecureString "P@ssw0rd" -AsPlainText -Force

# Prompt for SecureString
$secure = Read-Host -AsSecureString "Enter password"

# Convert to plain text (use with caution)
$plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
)

# Store encrypted (user-specific)
$encrypted = ConvertFrom-SecureString $secure |
    Out-File C:\creds.txt

# Load encrypted
$secure = ConvertTo-SecureString (Get-Content C:\creds.txt)

# Create PSCredential
$cred = New-Object System.Management.Automation.PSCredential(
    'admin', $secure
)
```

### Security Best Practices

- **Avoid hardcoded credentials** — Use `Get-Credential`, Azure Key Vault, or Windows Credential Manager
- **Use execution policies** — Set `RemoteSigned` at minimum
- **Sign scripts** — Use code signing certificates for production
- **Audit logging** — Enable PowerShell transcription and script block logging
- **Constrained Language Mode** — Restrict language features for untrusted contexts
- **JEA** — Use Just Enough Administration for privileged access
- **SecureString caution** — Microsoft recommends alternatives (certificates, Windows auth) for new development

### Logging and Auditing

```powershell
# Enable transcription
Start-Transcript -Path C:\Logs\session.txt -IncludeInvocationHeader

# Stop transcription
Stop-Transcript

# Script block logging (via Group Policy)
# Computer Configuration > Admin Templates > Windows Components > PowerShell
# Enable PowerShell Script Block Logging

# Module logging
$LogModule = @{ EnableModuleLogging = $true; ModuleNames = @('*') }
# Via Group Policy or registry
```

**Source**: [PowerShell Security Features](https://learn.microsoft.com/en-us/powershell/scripting/security/security-features) | [about_Execution_Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies) | [about_Remote_Requirements](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_requirements)

## Desired State Configuration (DSC)

### DSC Overview

DSC is a declarative configuration management platform built into PowerShell.

| Component | Description |
|-----------|-------------|
| **Configuration** | PowerShell script defining desired state |
| **Node** | Target machine |
| **Resource** | Building block (File, Service, Registry, etc.) |
| **LCM** | Local Configuration Manager (engine on node) |
| **MOF** | Managed Object Format (compiled configuration) |

### DSC 3.0 (Current)

```powershell
# DSC 3.0 uses YAML-based configuration documents
# dsc config get --file ./example.config.dsc.yaml
# dsc config test --file ./example.config.dsc.yaml
# dsc config set --file ./example.config.dsc.yaml
```

### DSC Configuration (PowerShell)

```powershell
configuration WebServerConfig {
    param(
        [string[]]$NodeName = 'localhost'
    )

    Import-DscResource -ModuleName PSDesiredStateConfiguration

    Node $NodeName {
        WindowsFeature IIS {
            Ensure               = 'Present'
            Name                 = 'Web-Server'
            IncludeAllSubFeature = $true
        }

        Service Spooler {
            Ensure = 'Present'
            Name   = 'Spooler'
            State  = 'Running'
        }

        File WebRoot {
            Ensure          = 'Present'
            DestinationPath = 'C:\inetpub\wwwroot\index.html'
            Contents        = '<h1>Hello DSC</h1>'
            DependsOn       = '[WindowsFeature]IIS'
        }
    }
}

# Compile
WebServerConfig -NodeName 'SRV01'

# Apply (push mode)
Start-DscConfiguration -Path .\WebServerConfig -Wait -Verbose

# Check status
Get-DscConfigurationStatus

# Get current state
Get-DscConfiguration

# Test compliance
Test-DscConfiguration
```

### LCM Configuration

```powershell
# Configure Local Configuration Manager
[DSCLocalConfigurationManager()]
configuration LCMConfig {
    Node localhost {
        Settings {
            RefreshMode           = 'Push'
            ConfigurationMode     = 'ApplyAndAutoCorrect'
            RebootNodeIfNeeded    = $true
            ActionAfterReboot     = 'ContinueConfiguration'
            ConfigurationModeFrequencyMins = 15
            RefreshFrequencyMins  = 30
        }
    }
}

# Apply LCM config
Set-DscLocalConfigurationManager -Path .\LCMConfig -Verbose
```

### Built-in DSC Resources

| Resource | Description |
|----------|-------------|
| `File` | Files and directories |
| `Service` | Windows services |
| `WindowsFeature` | Windows features/roles |
| `Registry` | Registry keys/values |
| `Script` | Custom PowerShell scripts |
| `User` | Local users |
| `Group` | Local groups |
| `Environment` | Environment variables |
| `Package` | Software packages |
| `Archive` | ZIP/archive extraction |
| `Log` | DSC log entries |
| `WaitForAll` | Cross-node dependencies |

**Source**: [DSC Overview](https://learn.microsoft.com/en-us/powershell/dsc/overview/overview) | [DSC Configurations](https://learn.microsoft.com/en-us/powershell/dsc/configurations/configurations) | [DSC Resources](https://learn.microsoft.com/en-us/powershell/dsc/concepts/resources) | [DSC Configuration Documents](https://learn.microsoft.com/en-us/powershell/dsc/concepts/configuration-documents/overview) | [Write, Compile, and Apply](https://learn.microsoft.com/en-us/powershell/dsc/configurations/write-compile-apply-configuration) | [LCM MetaConfig](https://learn.microsoft.com/en-us/powershell/dsc/managing-nodes/metaconfig) | [DSC Pull Server](https://learn.microsoft.com/en-us/powershell/dsc/pull-server/pullserver) | [about_DSC](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_dsc)

## Runspaces

```powershell
# Get runspaces
Get-Runspace

# Debug runspace
Debug-Runspace -Runspace $rs

# Enable runspace debugging
Enable-RunspaceDebug -Runspace $rs

# Get runspace debug options
Get-RunspaceDebug
```

### Creating Runspaces (SDK)

```powershell
# RunspaceFactory
$ps = [PowerShell]::Create()
$ps.AddScript("Get-Process | Select-Object -First 5")
$ps.Invoke()
$ps.Dispose()
```

**Source**: [about_Runspaces](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_runspaces) | [Debug-Runspace](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/debug-runspace) | [Runspace04 Sample](https://learn.microsoft.com/en-us/powershell/scripting/developer/hosting/runspace04-sample)

## Windows PowerShell SDK

### SDK Topics

| Area | Description |
|------|-------------|
| [SDK Overview](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell) | Introduction to PowerShell SDK |
| [Writing a Module](https://learn.microsoft.com/en-us/powershell/scripting/developer/module/writing-a-windows-powershell-module) | Creating PowerShell modules |
| [Writing a Cmdlet](https://learn.microsoft.com/en-us/powershell/scripting/developer/cmdlet/writing-a-windows-powershell-cmdlet) | Creating compiled cmdlets |
| [SDK Reference](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell-reference) | API reference |
| [Hosting Runspaces](https://learn.microsoft.com/en-us/powershell/scripting/developer/hosting/runspace04-sample) | Hosting PowerShell in .NET apps |

### Cmdlet Development

```csharp
// Basic cmdlet structure (C#)
[Cmdlet(VerbsCommon.Get, "MyData")]
public class GetMyDataCommand : PSCmdlet
{
    [Parameter(Mandatory = true, Position = 0)]
    public string Name { get; set; }

    protected override void ProcessRecord()
    {
        WriteObject(new { Name = Name, Value = "data" });
    }
}
```

**Source**: [Windows PowerShell SDK](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell) | [Writing a Module](https://learn.microsoft.com/en-us/powershell/scripting/developer/module/writing-a-windows-powershell-module) | [Writing a Cmdlet](https://learn.microsoft.com/en-us/powershell/scripting/developer/cmdlet/writing-a-windows-powershell-cmdlet) | [SDK Reference](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell-reference)

**Source**: [Running Remote Commands](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/running-remote-commands) | [SSH Remoting](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/ssh-remoting-in-powershell) | [WSMan Remoting](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/wsman-remoting-in-powershell) | [Remoting FAQ](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/powershell-remoting-faq) | [about_Remote](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote) | [about_Remote_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_variables) | [about_Remote_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_jobs) | [about_Remote_Output](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_output) | [about_Remote_Requirements](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_requirements) | [about_Remote_Troubleshooting](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_troubleshooting) | [about_Remote_Disconnected_Sessions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_disconnected_sessions) | [about_CimSession](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_cimsession) | [about_PSSessions](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pssessions) | [about_PSSession_Details](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pssession_details) | [about_Session_Configurations](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_session_configurations) | [about_Session_Configuration_Files](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_session_configuration_files) | [about_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_jobs) | [about_Job_Details](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_job_details) | [about_Scheduled_Jobs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scheduled_jobs) | [about_Signing](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_signing) | [Security Features](https://learn.microsoft.com/en-us/powershell/scripting/security/security-features) | [about_Execution_Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies) | [DSC Overview](https://learn.microsoft.com/en-us/powershell/dsc/overview/overview) | [DSC Configurations](https://learn.microsoft.com/en-us/powershell/dsc/configurations/configurations) | [DSC Resources](https://learn.microsoft.com/en-us/powershell/dsc/concepts/resources) | [DSC Configuration Documents](https://learn.microsoft.com/en-us/powershell/dsc/concepts/configuration-documents/overview) | [LCM MetaConfig](https://learn.microsoft.com/en-us/powershell/dsc/managing-nodes/metaconfig) | [DSC Pull Server](https://learn.microsoft.com/en-us/powershell/dsc/pull-server/pullserver) | [about_DSC](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_dsc) | [about_Runspaces](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_runspaces) | [SDK](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell) | [Writing a Module](https://learn.microsoft.com/en-us/powershell/scripting/developer/module/writing-a-windows-powershell-module) | [Writing a Cmdlet](https://learn.microsoft.com/en-us/powershell/scripting/developer/cmdlet/writing-a-windows-powershell-cmdlet) | [SDK Reference](https://learn.microsoft.com/en-us/powershell/scripting/developer/windows-powershell-reference) | [CIM/WMI](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/07-working-with-wmi)
