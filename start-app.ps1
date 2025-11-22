# StockMaster - Complete Application Startup Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🚀 StockMaster Application Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = $PSScriptRoot

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Java
try {
    $javaVersion = & "C:\Program Files\Java\jdk-21\bin\java.exe" -version 2>&1 | Select-String "version" | Select-Object -First 1
    Write-Host "✓ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java not found at C:\Program Files\Java\jdk-21" -ForegroundColor Red
    Write-Host "  Please install Java 21 or update the path in this script" -ForegroundColor Yellow
    exit 1
}

# Check Node
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host ""

# Start Backend
Write-Host "📦 Starting Backend Server..." -ForegroundColor Cyan
$backendPath = Join-Path $rootDir "inventory-backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\start.ps1"
Write-Host "✓ Backend starting in new window..." -ForegroundColor Green
Write-Host "  URL: http://localhost:8080" -ForegroundColor Gray

Start-Sleep -Seconds 3

# Start Frontend
Write-Host ""
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Cyan
$frontendPath = Join-Path $rootDir "stockmaster-frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; .\start.ps1"
Write-Host "✓ Frontend starting in new window..." -ForegroundColor Green
Write-Host "  URL: http://localhost:3000" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ StockMaster is starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "  • Backend API:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "  • Frontend UI:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Login:" -ForegroundColor Yellow
Write-Host "  Email:    ayush@stockmaster.com" -ForegroundColor Gray
Write-Host "  Password: ayush123" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop: Close both PowerShell windows" -ForegroundColor Yellow
Write-Host ""
Write-Host "Waiting 30 seconds for servers to initialize..." -ForegroundColor Gray

Start-Sleep -Seconds 30

# Try to open browser
Write-Host "Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✅ Application is ready!" -ForegroundColor Green
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
