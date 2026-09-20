<#
.SYNOPSIS
    Installs Arch Linux in WSL and turns it into a Garuda-like dev shell.

.DESCRIPTION
    Run it twice if WSL itself is not installed yet:
      1st run  installs the WSL platform (needs administrator rights, then a reboot)
      2nd run  installs Arch, runs bootstrap-arch.sh as root (asks for a Linux password),
               restarts the distro, and applies the theme's shell and Terminal settings

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\windows\wsl\setup-wsl.ps1
.EXAMPLE
    .\windows\wsl\setup-wsl.ps1 -User kenny -Theme cyberpunk
#>
[CmdletBinding()]
param(
    [string]$User = $env:USERNAME.ToLower(),
    [string]$Distro = 'archlinux',
    [string]$Theme = 'synthwave'
)

# Continue, not Stop: wsl.exe writes progress to stderr, which PowerShell 5 would
# turn into a terminating error. Each step below checks $LASTEXITCODE instead.
$ErrorActionPreference = 'Continue'
$Here = $PSScriptRoot

function Say([string]$text, [string]$colour = 'Gray') { Write-Host "  $text" -ForegroundColor $colour }

function Test-Admin {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    return (New-Object Security.Principal.WindowsPrincipal($id)).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# wsl.exe prints UTF-16; PowerShell reads it with a NUL after every letter.
function Get-Distros {
    return @(& wsl.exe --list --quiet 2>$null | ForEach-Object { ($_ -replace "`0", '').Trim() } | Where-Object { $_ })
}

Write-Host ''
Write-Host "  WSL: $Distro for $User, Garuda-style" -ForegroundColor Cyan
Write-Host ''

# 1. The WSL platform itself.
& wsl.exe --status *> $null
if ($LASTEXITCODE -ne 0) {
    if (-not (Test-Admin)) {
        Say 'WSL is not installed yet. Restarting this script as administrator...' 'Yellow'
        Start-Process powershell.exe -Verb RunAs -ArgumentList @('-ExecutionPolicy', 'Bypass', '-NoExit', '-File', "`"$PSCommandPath`"", '-User', $User, '-Distro', $Distro, '-Theme', $Theme)
        return
    }
    Say 'Installing the WSL platform...'
    & wsl.exe --install --no-distribution
    Say 'Reboot Windows, then run this script again (no administrator needed the second time).' 'Yellow'
    return
}
& wsl.exe --update *> $null

# 2. Arch Linux.
if ((Get-Distros) -notcontains $Distro) {
    Say "Installing $Distro..."
    & wsl.exe --install $Distro --no-launch
    if ((Get-Distros) -notcontains $Distro) {
        # Older wsl.exe builds register the distro on first launch only.
        & wsl.exe -d $Distro -u root -- true
    }
}
if ((Get-Distros) -notcontains $Distro) { throw "$Distro did not install; run 'wsl --list --online' to see what this Windows build offers." }

# 3. The bootstrap, as root, with this folder as the working directory.
Say 'Bootstrapping (pacman, Chaotic-AUR, paru, fish, starship). This takes a few minutes.'
& wsl.exe -d $Distro -u root --cd $Here -- bash ./bootstrap-arch.sh $User
if ($LASTEXITCODE -ne 0) { throw "bootstrap-arch.sh failed (exit $LASTEXITCODE); scroll up for the pacman error, fix it, and run this script again." }

# 4. Restart so /etc/wsl.conf (systemd, default user) takes effect.
& wsl.exe --terminate $Distro | Out-Null

# 5. The theme's prompt and colours in the shell, and the Arch tab as default in Terminal.
$apply = Join-Path (Split-Path $Here -Parent) 'apply.ps1'
& $apply -Theme $Theme -Skip yasb, mica, firedragon, vscode, accent, wallpaper -WslDistro $Distro

Say "Done. Open Windows Terminal: the default tab is now $Distro in fish." 'Cyan'
