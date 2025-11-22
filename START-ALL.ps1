# ========================================
#  StockMaster - Complete Startup Script
# ========================================
# This script starts both backend and frontend services

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   STOCKMASTER - STARTUP SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Java is installed
Write-Host "1. Checking Java installation..." -ForegroundColor Yellow
$javaPath = "C:\Program Files\Java\jdk-21\bin\java.exe"
if (Test-Path $javaPath) {
    Write-Host "   ✅ Java JDK 21 found" -ForegroundColor Green
} else {
    Write-Host "   ❌ Java JDK 21 not found at $javaPath" -ForegroundColor Red
    Write-Host "   Please install Java JDK 21 first" -ForegroundColor Red
    exit 1
}

# Check if Node is installed
Write-Host "2. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found" -ForegroundColor Red
    Write-Host "   Please install Node.js first" -ForegroundColor Red
    exit 1
}

# Check if backend jar exists
Write-Host "3. Checking backend build..." -ForegroundColor Yellow
$backendJar = "e:\Hackathon\spit Virtual round\StockMaster\inventory-backend\target\inventory-backend-0.0.1-SNAPSHOT.jar"
if (Test-Path $backendJar) {
    Write-Host "   ✅ Backend JAR found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Backend JAR not found, building..." -ForegroundColor Yellow
    cd "e:\Hackathon\spit Virtual round\StockMaster\inventory-backend"
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
    .\mvnw.cmd package -DskipTests
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Backend built successfully" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend build failed" -ForegroundColor Red
        exit 1
    }
}

# Check if frontend dependencies are installed
Write-Host "4. Checking frontend dependencies..." -ForegroundColor Yellow
$frontendNodeModules = "e:\Hackathon\spit Virtual round\StockMaster\stockmaster-frontend\node_modules"
if (Test-Path $frontendNodeModules) {
    Write-Host "   ✅ Frontend dependencies found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Installing frontend dependencies..." -ForegroundColor Yellow
    cd "e:\Hackathon\spit Virtual round\StockMaster\stockmaster-frontend"
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   STARTING SERVICES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in new window
Write-Host "5. Starting Backend Server..." -ForegroundColor Yellow
$backendScript = @"
cd 'e:\Hackathon\spit Virtual round\StockMaster\inventory-backend'

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '   STOCKMASTER BACKEND' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

# Load environment variables
Write-Host 'Loading environment variables...' -ForegroundColor Yellow
Get-Content .env | ForEach-Object { 
    if (`$_ -match '^([^#][^=]+)=(.+)`$') { 
        Set-Item -Path "env:`$(`$matches[1].Trim())" -Value `$matches[2].Trim() 
    } 
}

Write-Host '✅ Environment loaded' -ForegroundColor Green
Write-Host ''
Write-Host 'Starting backend server on port 8080...' -ForegroundColor Yellow
Write-Host ''

`$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'
& "`$env:JAVA_HOME\bin\java.exe" -jar target\inventory-backend-0.0.1-SNAPSHOT.jar
"@

$backendScriptPath = "e:\Hackathon\spit Virtual round\StockMaster\inventory-backend\start-backend-temp.ps1"
$backendScript | Out-File -FilePath $backendScriptPath -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-File", $backendScriptPath
Write-Host "   ✅ Backend started in new window" -ForegroundColor Green
Write-Host "   📍 http://localhost:8080" -ForegroundColor Cyan

# Wait for backend to start
Write-Host ""
Write-Host "6. Waiting for backend to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$backendReady = $false

while ($attempt -lt $maxAttempts -and -not $backendReady) {
    $attempt++
    Start-Sleep -Seconds 2
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/test" -Method GET -ErrorAction SilentlyContinue
        if ($response -eq "Auth API is working!") {
            $backendReady = $true
            Write-Host "   ✅ Backend is ready!" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⏳ Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    }
}

if (-not $backendReady) {
    Write-Host "   ⚠️  Backend took longer than expected to start" -ForegroundColor Yellow
    Write-Host "   Check the backend window for details" -ForegroundColor Yellow
}

# Start frontend in new window
Write-Host ""
Write-Host "7. Starting Frontend Server..." -ForegroundColor Yellow
$frontendScript = @"
cd 'e:\Hackathon\spit Virtual round\StockMaster\stockmaster-frontend'

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '   STOCKMASTER FRONTEND' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

Write-Host 'Starting frontend server on port 3000...' -ForegroundColor Yellow
Write-Host ''

npm run dev
"@

$frontendScriptPath = "e:\Hackathon\spit Virtual round\StockMaster\stockmaster-frontend\start-frontend-temp.ps1"
$frontendScript | Out-File -FilePath $frontendScriptPath -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-File", $frontendScriptPath
Write-Host "   ✅ Frontend started in new window" -ForegroundColor Green
Write-Host "   📍 http://localhost:3000" -ForegroundColor Cyan

# Wait a bit for frontend to start
Write-Host ""
Write-Host "8. Waiting for frontend to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 8
Write-Host "   ✅ Frontend should be ready!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ✅ ALL SERVICES STARTED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:   http://localhost:8080" -ForegroundColor Cyan
Write-Host "   API Test:  http://localhost:8080/api/auth/test" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Login Credentials:" -ForegroundColor Yellow
Write-Host "   Email:     ayush@stockmaster.com" -ForegroundColor White
Write-Host "   Password:  ayush123" -ForegroundColor White
Write-Host "   Role:      ADMIN" -ForegroundColor White
Write-Host ""
Write-Host "📝 Quick Actions:" -ForegroundColor Yellow
Write-Host "   1. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host "   2. Login with above credentials" -ForegroundColor White
Write-Host "   3. Explore the dashboard and all 9 modules" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  To stop services:" -ForegroundColor Yellow
Write-Host "   - Go to each PowerShell window" -ForegroundColor White
Write-Host "   - Press Ctrl+C to stop" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - README.md - Project overview" -ForegroundColor White
Write-Host "   - ALL_FIXES_APPLIED.md - Recent fixes" -ForegroundColor White
Write-Host "   - LOGIN_CREDENTIALS.md - Detailed login guide" -ForegroundColor White
Write-Host "   - TESTING_RESULTS.md - All tests passed (19/19)" -ForegroundColor White
Write-Host ""

# Open browser automatically
Write-Host "🚀 Opening application in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✅ StockMaster is now running!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this window (services will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
