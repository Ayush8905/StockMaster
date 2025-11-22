# 🚀 AWS EC2 Deployment Guide - StockMaster

Complete guide to deploy StockMaster on AWS EC2 instance.

## 📋 Prerequisites

- ✅ AWS EC2 instance created (Ubuntu 22.04 LTS recommended)
- ✅ Public IP: **13.201.13.176**
- ✅ PEM file: **temp.pem** (for SSH access)
- ✅ Security Group configured with inbound rules:
  - SSH (22) - Your IP
  - HTTP (80) - Anywhere
  - HTTPS (443) - Anywhere
  - Custom TCP (8080) - Anywhere
  - Custom TCP (3000) - Anywhere

---

## 🔧 EC2 Instance Specifications

| Specification | Recommended |
|---|---|
| **Instance Type** | t2.medium or better |
| **vCPU** | 2+ cores |
| **Memory** | 4GB+ RAM |
| **Storage** | 20GB+ |
| **OS** | Ubuntu 22.04 LTS |

---

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Connect to EC2 Instance

**On Windows (PowerShell):**
```powershell
# Set permissions for PEM file
icacls temp.pem /inheritance:r
icacls temp.pem /grant:r "%USERNAME%:R"

# Connect via SSH
ssh -i temp.pem ubuntu@13.201.13.176
```

**On Linux/Mac:**
```bash
chmod 400 temp.pem
ssh -i temp.pem ubuntu@13.201.13.176
```

### Step 2: Run Automated Deployment Script

Once connected to EC2, run these commands:

```bash
# Download deployment script
wget https://raw.githubusercontent.com/Ayush8905/StockMaster/master/deploy-to-ec2.sh

# Make it executable
chmod +x deploy-to-ec2.sh

# Run deployment
./deploy-to-ec2.sh
```

**The script will automatically:**
1. ✅ Update system packages
2. ✅ Install Java 21
3. ✅ Install Node.js 18
4. ✅ Install PM2 process manager
5. ✅ Install and configure Nginx
6. ✅ Clone GitHub repository
7. ✅ Set up environment variables
8. ✅ Build backend (Maven)
9. ✅ Build frontend (Next.js)
10. ✅ Start both servers with PM2
11. ✅ Configure Nginx reverse proxy
12. ✅ Set up firewall

**Deployment time:** ~5-7 minutes

---

## 🌐 Access Your Application

After deployment completes:

| Service | URL |
|---|---|
| **Frontend** | http://13.201.13.176 |
| **Backend API** | http://13.201.13.176/api |
| **Direct Backend** | http://13.201.13.176:8080 |

### Test Credentials
```
Email: ayush@stockmaster.com
Password: ayush123
```

---

## 🔍 Manual Deployment (Alternative Method)

If you prefer manual deployment or the script fails, follow these steps:

### 1️⃣ Connect to EC2
```bash
ssh -i temp.pem ubuntu@13.201.13.176
```

### 2️⃣ Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3️⃣ Install Java 21
```bash
sudo apt install -y openjdk-21-jdk
java -version
```

### 4️⃣ Install Node.js 18
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 5️⃣ Install PM2
```bash
sudo npm install -g pm2
pm2 --version
```

### 6️⃣ Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 7️⃣ Clone Repository
```bash
cd /home/ubuntu
git clone https://github.com/Ayush8905/StockMaster.git
cd StockMaster
```

### 8️⃣ Configure Backend

```bash
cd inventory-backend

# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://ayushp2211:2211@cluster0.lokt8ah.mongodb.net/stockmaster?retryWrites=true&w=majority
JWT_SECRET=stockmaster_secret_key_2024_hackathon_spit_virtual_round_ayush_project
JWT_EXPIRATION=86400000
EOF

# Build backend
chmod +x mvnw
./mvnw clean package -DskipTests
```

### 9️⃣ Configure Frontend

```bash
cd /home/ubuntu/StockMaster/stockmaster-frontend

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://13.201.13.176:8080/api
EOF

# Install dependencies
npm install

# Build frontend
npm run build
```

### 🔟 Start Applications with PM2

**Backend:**
```bash
cd /home/ubuntu/StockMaster/inventory-backend

# Start backend
pm2 start "java -jar target/inventory-backend-0.0.1-SNAPSHOT.jar" \
    --name stockmaster-backend \
    --log /home/ubuntu/backend.log
```

**Frontend:**
```bash
cd /home/ubuntu/StockMaster/stockmaster-frontend

# Start frontend
pm2 start npm --name stockmaster-frontend -- start
```

**Save PM2 configuration:**
```bash
pm2 save
pm2 startup
# Copy and run the command PM2 outputs
```

### 1️⃣1️⃣ Configure Nginx

```bash
sudo tee /etc/nginx/sites-available/stockmaster > /dev/null << 'EOF'
server {
    listen 80;
    server_name 13.201.13.176;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/stockmaster /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 1️⃣2️⃣ Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

---

## 📊 Verify Deployment

### Check Service Status
```bash
# PM2 processes
pm2 status

# Nginx status
sudo systemctl status nginx

# Backend health check
curl http://localhost:8080/api/auth/test

# Frontend health check
curl http://localhost:3000
```

### Test Authentication
```bash
# Login test
curl -X POST http://13.201.13.176:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ayush@stockmaster.com","password":"ayush123"}'
```

### View Logs
```bash
# All logs
pm2 logs

# Backend only
pm2 logs stockmaster-backend

# Frontend only
pm2 logs stockmaster-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🛠️ Management Commands

### PM2 Commands
```bash
# Check status
pm2 status

# View logs (all)
pm2 logs

# View specific logs
pm2 logs stockmaster-backend
pm2 logs stockmaster-frontend

# Restart all
pm2 restart all

# Restart specific
pm2 restart stockmaster-backend
pm2 restart stockmaster-frontend

# Stop all
pm2 stop all

# Delete all
pm2 delete all

# Monitor
pm2 monit
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Restart
sudo systemctl restart nginx

# Reload (no downtime)
sudo systemctl reload nginx

# Status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Application Updates
```bash
# Pull latest code
cd /home/ubuntu/StockMaster
git pull origin master

# Rebuild backend
cd inventory-backend
./mvnw clean package -DskipTests
pm2 restart stockmaster-backend

# Rebuild frontend
cd ../stockmaster-frontend
npm run build
pm2 restart stockmaster-frontend
```

---

## 🔒 Security Hardening (Recommended)

### 1. Configure AWS Security Group

In AWS Console > EC2 > Security Groups:

| Type | Protocol | Port | Source |
|---|---|---|---|
| SSH | TCP | 22 | Your IP only |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |
| Custom | TCP | 8080 | 0.0.0.0/0 |
| Custom | TCP | 3000 | 0.0.0.0/0 |

### 2. Enable HTTPS (Optional - Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 3. Update JWT Secret

```bash
# Generate strong secret
openssl rand -hex 64

# Update .env file
nano /home/ubuntu/StockMaster/inventory-backend/.env
# Change JWT_SECRET to generated value

# Restart backend
pm2 restart stockmaster-backend
```

### 4. Set Up MongoDB IP Whitelist

In MongoDB Atlas:
1. Go to Network Access
2. Add IP Address: **13.201.13.176**
3. Or allow from anywhere (0.0.0.0/0) for testing

---

## 🐛 Troubleshooting

### Backend Not Starting

**Check Java version:**
```bash
java -version
# Should be 21.x
```

**Check port 8080:**
```bash
sudo lsof -i :8080
# Kill if occupied
sudo kill -9 <PID>
```

**Check MongoDB connection:**
```bash
# Test connection
curl "mongodb+srv://ayushp2211:2211@cluster0.lokt8ah.mongodb.net/test"
```

**View backend logs:**
```bash
pm2 logs stockmaster-backend --lines 100
```

### Frontend Not Starting

**Check Node version:**
```bash
node -v
# Should be 18.x or higher
```

**Check port 3000:**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

**Rebuild frontend:**
```bash
cd /home/ubuntu/StockMaster/stockmaster-frontend
rm -rf .next node_modules
npm install
npm run build
pm2 restart stockmaster-frontend
```

### Nginx Issues

**Test configuration:**
```bash
sudo nginx -t
```

**Check error logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Restart Nginx:**
```bash
sudo systemctl restart nginx
```

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :8080
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or stop all PM2 processes
pm2 stop all
pm2 delete all
```

### Out of Memory

**Increase swap space:**
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### API 502 Bad Gateway

**Check backend is running:**
```bash
pm2 status
curl http://localhost:8080/api/auth/test
```

**Check Nginx config:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📈 Performance Optimization

### 1. Enable Gzip Compression (Nginx)

```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 2. Increase PM2 Instances (Cluster Mode)

```bash
pm2 delete stockmaster-frontend
pm2 start npm --name stockmaster-frontend -i 2 -- start
```

### 3. Set JVM Memory Limits

```bash
pm2 delete stockmaster-backend
pm2 start "java -Xms512m -Xmx1024m -jar target/inventory-backend-0.0.1-SNAPSHOT.jar" \
    --name stockmaster-backend
```

---

## 📊 Monitoring

### System Resources
```bash
# CPU and memory
htop

# Disk usage
df -h

# Memory usage
free -h

# Process monitoring
pm2 monit
```

### Application Metrics
```bash
# PM2 dashboard
pm2 web

# Access at: http://13.201.13.176:9615
```

### Set Up Monitoring Alerts

```bash
# Install PM2 monitoring (optional)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🔄 Backup & Recovery

### Database Backup (MongoDB Atlas)

MongoDB Atlas automatically backs up your data. To restore:
1. Go to MongoDB Atlas Dashboard
2. Select Clusters > Backup
3. Choose restore point

### Application Backup

```bash
# Backup entire application
cd /home/ubuntu
tar -czf stockmaster-backup-$(date +%Y%m%d).tar.gz StockMaster

# Restore
tar -xzf stockmaster-backup-20250122.tar.gz
```

---

## 🎯 Post-Deployment Checklist

- [ ] Both services running (`pm2 status`)
- [ ] Frontend accessible at http://13.201.13.176
- [ ] Backend API responding at http://13.201.13.176/api
- [ ] Login working with test credentials
- [ ] All 9 modules accessible
- [ ] Dashboard showing data
- [ ] Products CRUD working
- [ ] Stock tracking working
- [ ] Nginx reverse proxy configured
- [ ] PM2 auto-start on reboot enabled
- [ ] Firewall configured
- [ ] MongoDB connection stable
- [ ] Logs accessible (`pm2 logs`)

---

## 📞 Support & Resources

### Useful Links
- 📚 [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- 🔧 [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- 🌐 [Nginx Documentation](https://nginx.org/en/docs/)
- 🍃 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Quick Commands Reference

```bash
# Connect to EC2
ssh -i temp.pem ubuntu@13.201.13.176

# Check everything
pm2 status && sudo systemctl status nginx

# View logs
pm2 logs

# Restart everything
pm2 restart all && sudo systemctl restart nginx

# Update application
cd /home/ubuntu/StockMaster && git pull && ./deploy-to-ec2.sh

# Stop everything
pm2 stop all && sudo systemctl stop nginx
```

---

## 🎉 Deployment Complete!

Your StockMaster application is now live on AWS EC2!

**Access URLs:**
- 🌐 Frontend: http://13.201.13.176
- 🔧 Backend: http://13.201.13.176/api
- 📊 Dashboard: http://13.201.13.176/dashboard

**Test Login:**
- Email: ayush@stockmaster.com
- Password: ayush123

---

**Built with ❤️ by Ayush**  
**Deployed on AWS EC2** ☁️
