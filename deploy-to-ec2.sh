#!/bin/bash

# StockMaster AWS EC2 Deployment Script
# This script automates the complete deployment process

set -e  # Exit on any error

echo "=========================================="
echo "  StockMaster AWS EC2 Deployment"
echo "=========================================="

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="https://github.com/Ayush8905/StockMaster.git"
APP_DIR="/home/ubuntu/StockMaster"
BACKEND_DIR="$APP_DIR/inventory-backend"
FRONTEND_DIR="$APP_DIR/stockmaster-frontend"

echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}Step 2: Installing Java 21...${NC}"
if ! command -v java &> /dev/null; then
    sudo apt install -y openjdk-21-jdk
    echo "export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64" >> ~/.bashrc
    echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
    source ~/.bashrc
else
    echo -e "${GREEN}Java already installed${NC}"
fi
java -version

echo -e "${YELLOW}Step 3: Installing Node.js 18 and npm...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${GREEN}Node.js already installed${NC}"
fi
node -v
npm -v

echo -e "${YELLOW}Step 4: Installing PM2 (Process Manager)...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    echo -e "${GREEN}PM2 already installed${NC}"
fi
pm2 --version

echo -e "${YELLOW}Step 5: Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
else
    echo -e "${GREEN}Nginx already installed${NC}"
fi

echo -e "${YELLOW}Step 6: Cloning GitHub repository...${NC}"
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Repository exists, pulling latest changes...${NC}"
    cd $APP_DIR
    git pull origin master
else
    git clone $GITHUB_REPO $APP_DIR
fi

echo -e "${YELLOW}Step 7: Setting up backend environment...${NC}"
cd $BACKEND_DIR

# Create .env file for backend
cat > .env << EOF
MONGODB_URI=mongodb+srv://ayushp2211:2211@cluster0.lokt8ah.mongodb.net/stockmaster?retryWrites=true&w=majority
JWT_SECRET=stockmaster_secret_key_2024_hackathon_spit_virtual_round_ayush_project
JWT_EXPIRATION=86400000
EOF

echo -e "${GREEN}.env file created${NC}"

echo -e "${YELLOW}Step 8: Building backend (Maven)...${NC}"
chmod +x mvnw
./mvnw clean package -DskipTests

echo -e "${YELLOW}Step 9: Setting up frontend environment...${NC}"
cd $FRONTEND_DIR

# Create .env.local file for frontend
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://13.201.13.176:8080/api
EOF

echo -e "${GREEN}.env.local file created${NC}"

echo -e "${YELLOW}Step 10: Installing frontend dependencies...${NC}"
npm install

echo -e "${YELLOW}Step 11: Building frontend...${NC}"
npm run build

echo -e "${YELLOW}Step 12: Starting backend with PM2...${NC}"
cd $BACKEND_DIR
pm2 stop stockmaster-backend || true
pm2 delete stockmaster-backend || true

# Load environment variables and start backend
pm2 start "java -jar target/inventory-backend-0.0.1-SNAPSHOT.jar" \
    --name stockmaster-backend \
    --env-file .env \
    --log /home/ubuntu/backend.log \
    --error /home/ubuntu/backend-error.log

echo -e "${YELLOW}Step 13: Starting frontend with PM2...${NC}"
cd $FRONTEND_DIR
pm2 stop stockmaster-frontend || true
pm2 delete stockmaster-frontend || true

pm2 start npm --name stockmaster-frontend -- start

echo -e "${YELLOW}Step 14: Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/stockmaster > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name 13.201.13.176;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

# Enable site and restart nginx
sudo ln -sf /etc/nginx/sites-available/stockmaster /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo -e "${YELLOW}Step 15: Saving PM2 processes to startup...${NC}"
pm2 save
pm2 startup | tail -n 1 | sudo bash

echo -e "${YELLOW}Step 16: Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 3000/tcp
echo "y" | sudo ufw enable

echo -e "${GREEN}=========================================="
echo -e "  ✅ DEPLOYMENT COMPLETE!"
echo -e "==========================================${NC}"
echo ""
echo -e "${GREEN}Access your application:${NC}"
echo -e "  Frontend: ${YELLOW}http://13.201.13.176${NC}"
echo -e "  Backend API: ${YELLOW}http://13.201.13.176/api${NC}"
echo -e "  Direct Backend: ${YELLOW}http://13.201.13.176:8080${NC}"
echo ""
echo -e "${GREEN}Useful commands:${NC}"
echo -e "  Check status: ${YELLOW}pm2 status${NC}"
echo -e "  View logs: ${YELLOW}pm2 logs${NC}"
echo -e "  Backend logs: ${YELLOW}pm2 logs stockmaster-backend${NC}"
echo -e "  Frontend logs: ${YELLOW}pm2 logs stockmaster-frontend${NC}"
echo -e "  Restart: ${YELLOW}pm2 restart all${NC}"
echo -e "  Stop: ${YELLOW}pm2 stop all${NC}"
echo ""
echo -e "${GREEN}Test credentials:${NC}"
echo -e "  Email: ${YELLOW}ayush@stockmaster.com${NC}"
echo -e "  Password: ${YELLOW}ayush123${NC}"
echo ""
