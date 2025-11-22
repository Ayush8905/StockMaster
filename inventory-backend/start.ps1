# StockMaster Backend Startup Script
# This script loads environment variables from .env file and starts the backend

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  StockMaster Backend Startup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Set Java Home
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
Write-Host "✓ Java Home: $env:JAVA_HOME" -ForegroundColor Green

# Load environment variables from .env file
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Write-Host "✓ Loading environment variables from .env file..." -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)\s*$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
            Write-Host "  - $name loaded" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "⚠ Warning: .env file not found. Using default values." -ForegroundColor Yellow
    Write-Host "  Please create .env file from .env.example" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the backend
.\mvnw.cmd spring-boot:run
