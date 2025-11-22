# StockMaster - Testing & Troubleshooting Guide

## ✅ System Status Verification

### MongoDB Connection Status
**Status:** ✅ **CONNECTED AND WORKING**

**Verification Results:**
- ✅ User registration successful
- ✅ User login successful  
- ✅ JWT token generation working
- ✅ Product API accessible with authentication
- ✅ Data persistence confirmed in MongoDB Atlas

**Connection String:**
```
mongodb+srv://Ayush:Ayush%408905@cluster0.lokt8ah.mongodb.net/stockmaster
```

**Database:** `stockmaster`

**Collections Active:**
- `users` - User accounts and authentication
- `products` - Product catalog (4 items confirmed)
- `warehouses` - Warehouse locations
- `stock` - Inventory levels
- `receipts` - Incoming stock records
- `deliveries` - Outgoing stock records

---

## 🚀 Quick Start Guide

### 1. Start Backend Server

```powershell
# Navigate to backend directory
cd "e:\Hackathon\spit Virtual round\StockMaster\inventory-backend"

# Set Java 21
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"

# Start server
.\mvnw.cmd spring-boot:run
```

**Expected Output:**
```
Started InventoryBackendApplication in X seconds
Server running on http://localhost:8080
```

### 2. Start Frontend Application

```powershell
# Navigate to frontend directory
cd "e:\Hackathon\spit Virtual round\StockMaster\stockmaster-frontend"

# Start development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.3
- Local: http://localhost:3000
✓ Ready in 2.9s
```

### 3. Access Application

Open browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api

---

## 🧪 API Testing

### Test 1: Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/test" -Method GET
```
**Expected:** `Auth API is working!`

### Test 2: Register New User
```powershell
$registerBody = @{
    email = "test@stockmaster.com"
    password = "test123"
    role = "ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
    -Method POST `
    -Body $registerBody `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
    "token": "eyJhbGciOiJI...",
    "email": "test@stockmaster.com",
    "role": "ADMIN"
}
```

### Test 3: Login
```powershell
$loginBody = @{
    email = "admin@stockmaster.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json"

$token = $response.token
Write-Host "Token: $token"
```

### Test 4: Get Products (Authenticated)
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/products" `
    -Method GET `
    -Headers $headers
```

### Test 5: Create Product
```powershell
$productBody = @{
    name = "Test Product"
    sku = "TEST001"
    category = "Testing"
    unit = "pcs"
    reorderLevel = 10
    initialStock = 100
    active = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/products" `
    -Method POST `
    -Body $productBody `
    -Headers $headers `
    -ContentType "application/json"
```

---

## 🐛 Common Issues and Solutions

### Issue 1: Backend Won't Start

**Symptoms:**
- Port 8080 already in use
- Java version errors

**Solutions:**
```powershell
# Check if port is in use
netstat -ano | findstr :8080

# Kill process using port 8080 (if needed)
Stop-Process -Id <PID> -Force

# Verify Java version
java -version
# Should show: java version "21"

# Set correct Java home
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
```

### Issue 2: MongoDB Connection Failed

**Symptoms:**
- 500 errors on API calls
- "Connection refused" in logs

**Solutions:**
1. **Check MongoDB URI:**
   ```properties
   # File: application.properties
   spring.data.mongodb.uri=mongodb+srv://Ayush:Ayush%408905@cluster0.lokt8ah.mongodb.net/stockmaster?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **Verify MongoDB Atlas:**
   - Login to MongoDB Atlas
   - Check cluster status (should be running)
   - Verify network access (allow all IPs: 0.0.0.0/0)
   - Check database user credentials

3. **Test connection manually:**
   ```powershell
   # Register a user to test MongoDB
   $body = @{email="test@test.com";password="test123";role="USER"} | ConvertTo-Json
   Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json"
   ```

### Issue 3: 403 Forbidden Errors

**Symptoms:**
- Login returns 403
- Protected endpoints return 403

**Solutions:**
1. **Check JWT token:**
   ```powershell
   # Token should be in Authorization header
   $headers = @{Authorization = "Bearer YOUR_TOKEN_HERE"}
   ```

2. **Verify user exists in database:**
   - Register new user first
   - Use correct credentials

3. **Check CORS configuration:**
   ```java
   // SecurityConfig.java should have:
   configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
   ```

### Issue 4: Frontend Can't Connect to Backend

**Symptoms:**
- API calls fail
- Network errors in console
- CORS errors

**Solutions:**
1. **Verify backend is running:**
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8080/api/auth/test"
   ```

2. **Check .env.local file:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. **Restart frontend server:**
   ```powershell
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Or use Incognito mode

### Issue 5: JWT Token Expired

**Symptoms:**
- Automatic redirect to login
- 401 Unauthorized errors

**Solutions:**
1. **Token expires after 24 hours**
2. **Simply login again to get new token**
3. **Token is automatically refreshed on new login**

---

## 🔍 Debugging Tools

### Check Server Logs

**Backend logs:**
```powershell
# Logs appear in the terminal where you ran mvnw.cmd
# Look for:
# - MongoDB connection status
# - API request/response logs
# - Error stack traces
```

**Frontend logs:**
```powershell
# Check browser console (F12)
# Look for:
# - Network errors
# - API response errors
# - React component errors
```

### MongoDB Debug Mode

Already enabled in `application.properties`:
```properties
logging.level.org.springframework.data.mongodb.core.MongoTemplate=DEBUG
```

### Test Individual Endpoints

```powershell
# Dashboard data
$headers = @{Authorization = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard" -Headers $headers

# Warehouses
Invoke-RestMethod -Uri "http://localhost:8080/api/warehouses" -Headers $headers

# Stock
Invoke-RestMethod -Uri "http://localhost:8080/api/stock" -Headers $headers

# Receipts
Invoke-RestMethod -Uri "http://localhost:8080/api/receipts" -Headers $headers

# Deliveries
Invoke-RestMethod -Uri "http://localhost:8080/api/deliveries" -Headers $headers
```

---

## 📊 Database Verification

### Check Collections in MongoDB

```javascript
// MongoDB Atlas Console or mongosh

// Show all collections
show collections

// Count documents
db.users.countDocuments()
db.products.countDocuments()
db.warehouses.countDocuments()
db.stock.countDocuments()
db.receipts.countDocuments()
db.deliveries.countDocuments()

// Sample queries
db.users.find().pretty()
db.products.find().pretty()
db.stock.find().pretty()
```

---

## ✅ System Health Checklist

Before reporting any issues, verify:

- [ ] Java 21 is installed and JAVA_HOME is set
- [ ] Node.js 18+ is installed
- [ ] Backend server is running on port 8080
- [ ] Frontend server is running on port 3000
- [ ] MongoDB Atlas cluster is active
- [ ] Network access is allowed in MongoDB Atlas
- [ ] .env.local file exists in frontend folder
- [ ] User is registered in the system
- [ ] JWT token is valid (not expired)
- [ ] Browser cache is cleared

---

## 🎯 Quick Verification Script

```powershell
# Complete system check
Write-Host "=== StockMaster System Check ===" -ForegroundColor Cyan

# Test Backend
Write-Host "`n1. Testing Backend..." -ForegroundColor Yellow
try {
    $test = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/test"
    Write-Host "   ✅ Backend is running: $test" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend not responding" -ForegroundColor Red
}

# Test MongoDB
Write-Host "`n2. Testing MongoDB Connection..." -ForegroundColor Yellow
try {
    $body = @{email="verify@test.com";password="test123";role="USER"} | ConvertTo-Json
    $reg = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✅ MongoDB connected and working" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        Write-Host "   ✅ MongoDB connected (user exists)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MongoDB connection failed" -ForegroundColor Red
    }
}

# Test Authentication
Write-Host "`n3. Testing Authentication..." -ForegroundColor Yellow
try {
    $loginBody = @{email="admin@stockmaster.com";password="admin123"} | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "   ✅ Authentication working" -ForegroundColor Green
    
    # Test API Access
    Write-Host "`n4. Testing API Access..." -ForegroundColor Yellow
    $headers = @{Authorization = "Bearer $($resp.token)"}
    $products = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Headers $headers
    Write-Host "   ✅ API access working ($($products.Count) products found)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Authentication failed" -ForegroundColor Red
}

# Test Frontend
Write-Host "`n5. Testing Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Frontend is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend not responding" -ForegroundColor Red
}

Write-Host "`n=== System Check Complete ===" -ForegroundColor Cyan
```

---

## 📞 Support

If issues persist after following this guide:

1. **Check GitHub Issues:** https://github.com/Ayush8905/StockMaster/issues
2. **Review logs carefully** - Most errors are logged with details
3. **Verify all prerequisites** are met
4. **Test in isolation** - Test backend alone, then frontend alone

---

## 🎉 Success Indicators

Your system is working correctly if:

✅ Backend responds to `/api/auth/test`  
✅ User registration succeeds  
✅ User login returns JWT token  
✅ Protected APIs accessible with token  
✅ Frontend loads at localhost:3000  
✅ You can login via frontend  
✅ Dashboard shows data  
✅ All CRUD operations work  

**Current Status: ALL SYSTEMS OPERATIONAL ✅**
