# 🔐 StockMaster Login Credentials

## ✅ CONFIRMED WORKING CREDENTIALS

**Status:** ✅ Backend API Verified Working (Nov 22, 2025 12:45 PM IST)

### Admin User
```
Email:    ayush@stockmaster.com
Password: ayush123
Role:     ADMIN
```

---

## 🚀 How to Login

### Frontend (http://localhost:3000)
1. **Ensure Backend is Running:**
   - Check if you see a separate PowerShell window with backend logs
   - OR test: http://localhost:8080/api/auth/test (should say "Auth API is working!")

2. **Open Browser:**
   - Go to: http://localhost:3000/login
   - **Open DevTools (Press F12)** - Important for debugging!
   - Go to **Console tab** to see detailed logs

3. **Enter Credentials:**
   - Email: `ayush@stockmaster.com`
   - Password: `ayush123`

4. **Click "Sign In"**
   - Watch the Console tab for any errors
   - Watch the Network tab to see the API call

### Common Issues & Solutions

#### ❌ "Invalid email or password" Error

**Possible Causes:**

**1. Backend Not Running**
```powershell
# Test if backend is running:
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/test" -Method GET
# Should return: "Auth API is working!"

# If not running, start it:
cd "E:\Hackathon\spit Virtual round\StockMaster\inventory-backend"
Get-Content .env | ForEach-Object { 
    if ($_ -match '^([^#][^=]+)=(.+)$') { 
        Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim() 
    } 
}
& "C:\Program Files\Java\jdk-21\bin\java.exe" -jar target\inventory-backend-0.0.1-SNAPSHOT.jar
```

**2. Frontend Can't Reach Backend**
- Open browser DevTools (F12) → Network tab
- Try to login
- Look for the request to `http://localhost:8080/api/auth/login`
- If it's RED or failed, check:
  - Is backend running?
  - Any firewall blocking?
  - Check Console tab for CORS errors

**3. Typo in Email/Password**
- Email MUST be: `ayush@stockmaster.com` (all lowercase)
- Password MUST be: `ayush123` (case sensitive)
- No extra spaces

**4. Browser Cache Issues**
- Press Ctrl+Shift+R to hard refresh
- Or clear browser cache
- Try incognito/private window

---

## 🧪 Quick Tests

### Test 1: Backend API Direct Test
```powershell
$body = '{"email":"ayush@stockmaster.com","password":"ayush123"}'
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "Token: $($response.token.Substring(0,30))..."
# ✅ Should succeed and return a JWT token
```

### Test 2: CORS Test
```powershell
$headers = @{ "Origin" = "http://localhost:3000"; "Content-Type" = "application/json" }
$body = '{"email":"ayush@stockmaster.com","password":"ayush123"}'
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -Headers $headers -Body $body -UseBasicParsing
# ✅ Should return Access-Control-Allow-Origin header
```

### Test 3: Frontend Connectivity
1. Open: http://localhost:3000/login
2. Press F12 (DevTools)
3. Go to Console tab
4. Type: `fetch('http://localhost:8080/api/auth/test').then(r => r.text()).then(console.log)`
5. Press Enter
6. ✅ Should see: "Auth API is working!"

---

## 📋 Debugging Checklist

When login fails, check these in order:

- [ ] **Backend Running?**
  - PowerShell window open with backend logs?
  - Test: http://localhost:8080/api/auth/test
  
- [ ] **Frontend Running?**
  - See logs in terminal: "Ready in X seconds"
  - Can access: http://localhost:3000
  
- [ ] **Correct URL?**
  - Using: http://localhost:3000/login (not https)
  - Not using: 127.0.0.1 or different port
  
- [ ] **Browser DevTools Open?**
  - Press F12
  - Check Console tab for errors
  - Check Network tab for failed requests
  
- [ ] **Credentials Correct?**
  - Email: `ayush@stockmaster.com`
  - Password: `ayush123`
  - No copy-paste formatting issues
  
- [ ] **CORS Working?**
  - Look for CORS errors in Console
  - Check Network tab response headers
  
- [ ] **MongoDB Connected?**
  - Check backend logs for "MongoDB" connection messages
  - Should see: "Found 8 MongoDB repository interfaces"

---

## 🔍 Reading Console Logs

After clicking "Sign In", you should see in Console:

**✅ Success:**
```
Attempting login with: ayush@stockmaster.com
Login response: { token: "eyJ...", email: "ayush@stockmaster.com", role: "ADMIN" }
```

**❌ Backend Not Running:**
```
Login error: Network Error
Error response: undefined
```

**❌ Wrong Credentials (but backend running):**
```
Login error: Request failed with status code 401
Error response: { data: { message: "Invalid email or password" } }
```

**❌ CORS Issue:**
```
Access to fetch at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

---

## 🎯 Working Configuration Confirmed

**Backend API:** ✅ Tested and working
- URL: http://localhost:8080/api/auth/login
- Method: POST
- Body: `{"email":"ayush@stockmaster.com","password":"ayush123"}`
- Response: JWT token + user details

**CORS:** ✅ Configured correctly
- Access-Control-Allow-Origin: http://localhost:3000
- Access-Control-Allow-Credentials: true

**Database:** ✅ User exists in MongoDB
- Email: ayush@stockmaster.com
- Role: ADMIN
- Password: Hashed with BCrypt

---

## 🆘 Still Not Working?

### Option 1: Use API Directly (Bypass Frontend)
```powershell
# Login and save token
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body '{"email":"ayush@stockmaster.com","password":"ayush123"}' -ContentType "application/json"
$token = $response.token
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

# Now use APIs
Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers $headers
```

### Option 2: Check Backend Logs
Look in the backend PowerShell window for:
```
2025-11-22T12:XX:XX ... [nio-8080-exec-1] c.S.i.controllers.AuthController : POST /api/auth/login
```
This confirms the request reached the backend.

### Option 3: Try Different Browser
- Chrome → Try Firefox
- Clear all cookies and cache
- Use Incognito/Private mode

### Option 4: Restart Everything
```powershell
# 1. Stop backend (Ctrl+C in backend window)
# 2. Stop frontend (Ctrl+C in frontend terminal)
# 3. Restart backend:
cd "E:\Hackathon\spit Virtual round\StockMaster\inventory-backend"
Get-Content .env | ForEach-Object { if ($_ -match '^([^#][^=]+)=(.+)$') { Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim() } }
& "C:\Program Files\Java\jdk-21\bin\java.exe" -jar target\inventory-backend-0.0.1-SNAPSHOT.jar

# 4. Wait 10 seconds, then restart frontend:
cd ..\stockmaster-frontend
npm run dev
```

---

## 🧪 Verification Tests

### Test 1: Check Backend is Running
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/test" -Method GET
# Expected: "Auth API is working!"
```

### Test 2: Login Test
```powershell
$body = '{"email":"ayush@stockmaster.com","password":"ayush123"}'
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "Token received: $($response.token.Substring(0,20))..."
# Expected: JWT token returned
```

### Test 3: Authenticated Request Test
```powershell
$headers = @{ Authorization = "Bearer $token" }
$products = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers $headers
Write-Host "Products count: $($products.Count)"
# Expected: Products data returned (no 401 error)
```

---

## 📊 What's in the Database

### User Account
- **Email:** ayush@stockmaster.com
- **Role:** ADMIN
- **Password:** Encrypted with BCrypt
- **Created:** During initial testing
- **Status:** Active ✅

### Sample Data
- **Products:** 1 (Laptop Dell XPS 15)
- **Warehouses:** 2 (Mumbai, Pune)
- **Stock:** Present in both warehouses
- **Receipts:** 1 validated receipt
- **Transfers:** 1 completed transfer
- **Ledger Entries:** 3 audit log entries

---

## 🔄 Reset Instructions (If Needed)

### To Clear All Data and Start Fresh:

**Option 1: Delete User from MongoDB Atlas**
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Navigate to Collections → stockmaster → users
3. Delete the document with email: "ayush@stockmaster.com"
4. Now you can register again

**Option 2: Register with Different Email**
```powershell
$body = '{"email":"your-email@example.com","password":"yourpassword","role":"ADMIN"}'
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

---

## ✅ Current Status

- ✅ Backend running on port 8080
- ✅ Frontend running on port 3000
- ✅ MongoDB Atlas connected
- ✅ User account exists and working
- ✅ Login successful
- ✅ JWT authentication working
- ✅ All API endpoints accessible

**You can login now and use the application! 🎉**

---

## 📞 Quick Access Links

- **Frontend:** http://localhost:3000
- **Login Page:** http://localhost:3000/login
- **Backend API:** http://localhost:8080/api
- **API Test:** http://localhost:8080/api/auth/test

---

*Last verified: November 22, 2025, 12:30 PM IST*  
*Status: ✅ WORKING*
