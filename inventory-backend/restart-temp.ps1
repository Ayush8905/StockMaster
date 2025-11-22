cd 'e:\Hackathon\spit Virtual round\StockMaster\inventory-backend'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '   STOCKMASTER BACKEND (FIXED)' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Get-Content .env | ForEach-Object { if ($_ -match '^([^#][^=]+)=(.+)$') { Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim() } }
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'
Write-Host 'Starting backend on port 8080...' -ForegroundColor Yellow
& '$env:JAVA_HOME\bin\java.exe' -jar target\inventory-backend-0.0.1-SNAPSHOT.jar
