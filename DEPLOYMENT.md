# CardinalNStar Portal - Deployment Guide

## ✅ Implementation Complete

Your portal has been successfully refactored with:

1. ✅ **Backend API** - Node.js/Express with authentication
2. ✅ **JWT Authentication** - Secure token-based login system
3. ✅ **Dynamic Data Loading** - Data loaded from data.json via API
4. ✅ **Docker Support** - Full containerization ready
5. ✅ **Clean Architecture** - Separated frontend/backend

## 🚀 Quick Start

### Option 1: Local Development

```bash
# Install dependencies (already done)
npm install

# Start the server
npm start
```

Then open: **http://localhost:3000**

**Default Login:**
- Username: `admin`
- Password: `changeme123`

### Option 2: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📁 What Changed

### New Files Created:

**Backend:**
- `package.json` - Node.js project configuration
- `server/index.js` - Express server with static file serving
- `server/routes/auth.js` - Authentication endpoints (login, logout, verify, register)
- `server/routes/data.js` - Protected data endpoints
- `.env` - Environment configuration (⚠️ contains secrets)
- `.env.example` - Template for environment variables

**Frontend:**
- `assets/js/auth.js` - Authentication manager class
- `assets/js/app.js` - Main application with dynamic data loading
- `assets/css/common.css` - Updated with login UI styles
- `index.html` - New streamlined version (old backed up to `index.html.backup`)

**Docker:**
- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Full stack orchestration
- `.dockerignore` - Docker build exclusions

**Documentation:**
- `README_NEW.md` - Complete project documentation
- `DEPLOYMENT.md` - This file

### Modified Files:
- `.gitignore` - Added backup files and sensitive data

### Backed Up:
- `index.html.backup` - Original HTML with embedded data

## 🔐 Security Configuration

### ⚠️ IMPORTANT: Change These Before Production

Edit `.env` file:

```env
# Generate strong random secrets:
JWT_SECRET=<generate-random-64-char-string>
SESSION_SECRET=<generate-random-64-char-string>

# Change admin credentials:
DEFAULT_ADMIN_USER=youradmin
DEFAULT_ADMIN_PASS=<strong-password>
```

### Generate Secure Secrets:

```bash
# On Mac/Linux:
openssl rand -base64 32

# Or Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │  index.html                                      │   │
│  │  ├─ auth.js (Authentication Manager)            │   │
│  │  ├─ app.js (Portal Rendering)                   │   │
│  │  └─ common.js (Utilities & Theme)               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────┐
│                 Express Server :3000                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Authentication Middleware                       │   │
│  │  ├─ POST /api/auth/login                        │   │
│  │  ├─ POST /api/auth/logout                       │   │
│  │  ├─ GET  /api/auth/verify                       │   │
│  │  └─ POST /api/auth/register                     │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Data Endpoints (Protected)                     │   │
│  │  ├─ GET /api/data/portal                        │   │
│  │  └─ GET /api/data/engineering-laws              │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Static File Server                             │   │
│  │  └─ Serves: HTML, CSS, JS, Images              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↓ Reads
┌─────────────────────────────────────────────────────────┐
│           File System                                    │
│  ├─ data.json (Portal Links)                            │
│  └─ engineering-law.json (Laws Data)                    │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Authentication Flow

1. User visits portal → sees login screen
2. User enters credentials
3. Frontend sends POST to `/api/auth/login`
4. Backend validates credentials
5. Backend generates JWT token (24h expiry)
6. Frontend stores token in localStorage
7. Frontend requests portal data with token in header
8. Backend verifies token and returns data
9. Frontend renders portal with user menu

## 🎨 Features Preserved

All original features still work:

- ✅ Multiple themes (Modern, Retro, Terminal, Neon, Glass, Carnival)
- ✅ Service status checking
- ✅ Cardinal compass background
- ✅ Responsive design
- ✅ All visual effects and animations
- ✅ Theme persistence in localStorage

## 📊 API Endpoints

### Public Endpoints:
- `GET /` - Serves index.html
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login

### Protected Endpoints (require JWT token):
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token validity
- `POST /api/auth/register` - Register new user
- `GET /api/data/portal` - Get portal configuration
- `GET /api/data/engineering-laws` - Get laws data

### API Usage Example:

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'changeme123' })
});
const { token } = await response.json();

// Use token for protected endpoints
const data = await fetch('/api/data/portal', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🐳 Docker Details

### Dockerfile Features:
- Multi-stage build for smaller image size
- Node.js 18 Alpine (minimal footprint)
- Non-root user for security
- Built-in health check
- Production dependencies only

### Docker Compose Features:
- Auto-restart on failure
- Health monitoring
- Volume mounts for easy data updates
- Network isolation
- Environment variable support

### Docker Commands:

```bash
# Build only
docker-compose build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f portal

# Stop
docker-compose stop

# Stop and remove
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## 🔧 Troubleshooting

### Server won't start

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port
kill -9 <PID>

# Or use different port
PORT=8080 npm start
```

### Authentication not working

1. Clear browser localStorage: `localStorage.clear()`
2. Clear browser cookies for localhost
3. Check server logs for errors
4. Verify `.env` file exists and has correct values

### Data not loading

1. Check `data.json` exists and is valid JSON
2. Verify you're logged in (check for token in localStorage)
3. Check browser console for errors
4. Check server logs for API errors

### Docker issues

```bash
# Remove all containers and images
docker-compose down
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Next Steps

### Production Deployment:

1. **Change secrets** in `.env`
2. **Set up HTTPS** with reverse proxy (nginx/Caddy)
3. **Use real database** for user storage (PostgreSQL/MongoDB)
4. **Add rate limiting** to prevent brute force attacks
5. **Implement logging** (Winston/Morgan)
6. **Set up monitoring** (PM2/New Relic)
7. **Configure backups** for user data

### Recommended Production Stack:

```
Internet → [Reverse Proxy: Nginx/Caddy with SSL]
              ↓
          [Node.js App (PM2)]
              ↓
          [PostgreSQL DB]
```

## 📚 Additional Resources

- **Express.js Docs:** https://expressjs.com/
- **JWT.io:** https://jwt.io/
- **Docker Docs:** https://docs.docker.com/
- **Node.js Security:** https://nodejs.org/en/docs/guides/security/

## ✅ Testing Results

All systems tested and working:

- ✅ Server starts successfully on port 3000
- ✅ Health endpoint responds correctly
- ✅ Login endpoint accepts credentials and returns JWT
- ✅ Protected endpoints require authentication
- ✅ Static files (HTML/CSS/JS) served correctly
- ✅ No vulnerabilities in dependencies

## 🎉 Ready to Use!

Your portal is now fully functional with:
- Secure authentication
- Dynamic data loading from JSON files
- Docker containerization
- Production-ready architecture

Start the server with `npm start` and visit http://localhost:3000

**Default credentials:** admin / changeme123

---

**Need Help?** Check the troubleshooting section or open an issue.
