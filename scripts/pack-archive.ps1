# =============================================================================
# EBAUB Digital Campus — Clean Archive Pack Script
# =============================================================================
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts\pack-archive.ps1
#
# Generates a clean distribution zip in the parent directory without:
# - node_modules
# - .next
# - .env / .env.local (keeps .env.example)
# - .git
# =============================================================================

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archiveName = "ebaub-digital-campus-v1.0.0-$timestamp.zip"
$outputPath = Join-Path (Split-Path $projectRoot -Parent) $archiveName

Write-Host "Creating clean distribution archive..." -ForegroundColor Cyan
Write-Host "Source: $projectRoot"
Write-Host "Target: $outputPath"

$excludeList = @(
    "node_modules",
    ".next",
    ".git",
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    ".vercel",
    "coverage",
    "build",
    "out",
    "*.tsbuildinfo",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*"
)

# Temporary staging directory
$stagingDir = Join-Path $env:TEMP "ebaub-staging-$timestamp"
if (Test-Path $stagingDir) { Remove-Item -Recurse -Force $stagingDir }
New-Item -ItemType Directory -Path $stagingDir | Out-Null

try {
    # Copy files excluding unwanted directories and credentials
    Get-ChildItem -Path $projectRoot -Force | ForEach-Object {
        $itemName = $_.Name
        $skip = $false

        foreach ($pattern in $excludeList) {
            if ($itemName -like $pattern) {
                $skip = $true
                break
            }
        }

        if (-not $skip) {
            Copy-Item -Path $_.FullName -Destination $stagingDir -Recurse -Force
        }
    }

    # Verify .env.local is NOT in staging
    $envLocalPath = Join-Path $stagingDir ".env.local"
    if (Test-Path $envLocalPath) {
        Remove-Item -Force $envLocalPath
        Write-Host "Removed .env.local from staging." -ForegroundColor Yellow
    }

    # Verify .env.example is present
    $envExamplePath = Join-Path $stagingDir ".env.example"
    if (Test-Path $envExamplePath) {
        Write-Host "Confirmed .env.example is present." -ForegroundColor Green
    } else {
        Write-Warning ".env.example was not found in staging!"
    }

    # Compress to ZIP
    if (Test-Path $outputPath) { Remove-Item -Force $outputPath }
    Compress-Archive -Path "$stagingDir\*" -DestinationPath $outputPath -CompressionLevel Optimal

    $zipSize = (Get-Item $outputPath).Length / 1MB
    Write-Host "`nArchive created successfully!" -ForegroundColor Green
    Write-Host "Path: $outputPath" -ForegroundColor Green
    Write-Host ("Size: {0:N2} MB" -f $zipSize) -ForegroundColor Green
} finally {
    if (Test-Path $stagingDir) {
        Remove-Item -Recurse -Force $stagingDir -ErrorAction SilentlyContinue
    }
}
