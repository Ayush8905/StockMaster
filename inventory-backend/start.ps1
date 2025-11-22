# StockMaster Backend Startup Script
Write-Host "=================================" -ForegroundColor Cyan
Write-Host " StockMaster Backend Startup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Set Java Home
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
Write-Host "[OK] Java Home: $env:JAVA_HOME" -ForegroundColor Green

# Load .env file
$envFile = ".\.env"
if (Test-Path $envFile) {
    Write-Host "[OK] Loading environment variables..." -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Set environment variable in current process
            Set-Item -Path "env:$name" -Value $value
            Write-Host "  - $name" -ForegroundColor Gray
        }
    }
    Write-Host ""
} else {
    Write-Host "[WARNING] .env file not found!" -ForegroundColor Yellow
    Write-Host "Create .env from .env.example" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Starting backend on http://localhost:8080" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start backend
.\mvnw.cmd spring-boot:run
