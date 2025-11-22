# StockMaster Frontend Startup Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  StockMaster Frontend Startup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
$envFile = Join-Path $PSScriptRoot ".env.local"
if (Test-Path $envFile) {
    Write-Host "✓ Environment file found: .env.local" -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)\s*$') {
            Write-Host "  - $($matches[1].Trim()): $($matches[2].Trim())" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "⚠ Warning: .env.local file not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the frontend
npm run dev
