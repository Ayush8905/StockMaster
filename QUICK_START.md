# 🚀 STOCKMASTER - QUICK START

## Start Application (ONE COMMAND)
```powershell
cd "e:\Hackathon\spit Virtual round\StockMaster"
.\START-ALL.ps1
```

## Login Credentials
```
Email:    ayush@stockmaster.com
Password: ayush123
```

## URLs
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **API Test:** http://localhost:8080/api/auth/test

## Status
✅ **ALL ISSUES FIXED (7/7)**
- Backend: 0 compilation errors
- Frontend: 0 TypeScript errors
- MongoDB: Connected
- CORS: Working
- Tests: 19/19 passed

## Manual Start (if needed)

### Terminal 1: Backend
```powershell
cd "e:\Hackathon\spit Virtual round\StockMaster\inventory-backend"
Get-Content .env | ForEach-Object { if ($_ -match '^([^#][^=]+)=(.+)$') { Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim() } }
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
& "$env:JAVA_HOME\bin\java.exe" -jar target\inventory-backend-0.0.1-SNAPSHOT.jar
```

### Terminal 2: Frontend
```powershell
cd "e:\Hackathon\spit Virtual round\StockMaster\stockmaster-frontend"
npm run dev
```

## Troubleshooting

### Port Already in Use?
```powershell
# Check ports
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process_id> /F
```

### Need to Rebuild?
```powershell
# Backend
cd inventory-backend
.\mvnw.cmd clean package -DskipTests

# Frontend
cd stockmaster-frontend
npm install
```

## Documentation
- `COMPLETE_PROJECT_STATUS.md` - Full system status
- `ALL_FIXES_APPLIED.md` - All fixes details
- `LOGIN_CREDENTIALS.md` - Login troubleshooting
- `TESTING_RESULTS.md` - All tests passed

## 9 Modules Available
1. Dashboard
2. Products
3. Warehouses
4. Stock
5. Receipts
6. Deliveries
7. Transfers
8. Ledger
9. Authentication

**🎉 Everything is ready! Just run START-ALL.ps1**
