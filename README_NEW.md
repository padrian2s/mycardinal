# CardinalNStar Portal

A modern web portal application with authentication for quick access to NStarX resources and documentation.

## Features

- 🔐 **Secure Authentication** - Login system with JWT tokens
- 🎨 **Multiple Themes** - Modern, Retro, Terminal, Neon, Glassmorphism, and Carnival modes
- 📊 **Service Status Monitoring** - Real-time status checks for all linked services
- 🐳 **Docker Support** - Easy deployment with Docker and Docker Compose
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and change the default credentials
   ```

3. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. **Access the portal:**
   - Open http://localhost:3000
   - Login with default credentials: `admin` / `changeme123`

### Docker Deployment

1. **Build and start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Access the portal:**
   - Open http://localhost:3000
   - Login with credentials from your `.env` file

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

## Project Structure

```
mycardinal/
├── server/              # Backend application
│   ├── index.js        # Express server
│   └── routes/         # API routes
│       ├── auth.js     # Authentication endpoints
│       └── data.js     # Data endpoints
├── assets/             # Frontend assets
│   ├── css/           # Stylesheets
│   │   └── common.css # Common styles and themes
│   └── js/            # JavaScript files
│       ├── common.js  # Common utilities
│       ├── auth.js    # Authentication manager
│       └── app.js     # Main application logic
├── data.json          # Portal configuration and links
├── engineering-law.json # Engineering laws data
├── index.html         # Main entry point
├── Dockerfile         # Docker configuration
└── docker-compose.yml # Docker Compose configuration
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Security (change these in production!)
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# Default Admin
DEFAULT_ADMIN_USER=admin
DEFAULT_ADMIN_PASS=changeme123
```

### Portal Data

Edit `data.json` to configure portal links and services:

```json
{
  "portal": {
    "title": "Your Portal Title",
    "subtitle": "Portal description"
  },
  "links": [
    {
      "id": "service-id",
      "title": "Service Name",
      "description": "Service description",
      "url": "https://service-url.com",
      "icon": "🖥️",
      "badge": "Server",
      "colorClass": "green-168",
      "enabled": true
    }
  ]
}
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/register` - Register new user (optional)

### Data

- `GET /api/data/portal` - Get portal configuration (requires auth)
- `GET /api/data/engineering-laws` - Get engineering laws (requires auth)

### Health Check

- `GET /api/health` - Health check endpoint

## Themes

The portal supports multiple visual themes:

- **Modern** - Clean, modern design (default)
- **Retro** - Nostalgic retro styling
- **Terminal** - Command-line inspired look
- **Neon** - Vibrant neon colors
- **Glassmorphism** - Glass morphism effects
- **TuiCSS** - Text-based UI
- **Carnival** - Fun, animated carnival mode

Themes can be changed via the theme selector in the top-right corner.

## Security Notes

⚠️ **Important for Production:**

1. **Change default credentials** in `.env`
2. **Use strong secrets** for JWT_SECRET and SESSION_SECRET
3. **Enable HTTPS** for production deployments
4. **Use a real database** instead of in-memory storage for users
5. **Implement rate limiting** for authentication endpoints
6. **Keep dependencies updated** regularly

## Development

### Adding New Services

1. Edit `data.json`
2. Add new service object to the `links` array
3. Restart the server

### Modifying Styles

- Edit `assets/css/common.css` for global styles
- Theme-specific styles are in the same file under theme classes

### Extending Authentication

The authentication system uses JWT tokens stored in localStorage. To extend:

1. Edit `server/routes/auth.js` for backend changes
2. Edit `assets/js/auth.js` for frontend changes

## Troubleshooting

### Port Already in Use

Change the PORT in `.env` file or run:
```bash
PORT=8080 npm start
```

### Docker Build Issues

Clear Docker cache and rebuild:
```bash
docker-compose down
docker system prune -f
docker-compose up --build
```

### Authentication Issues

Clear browser localStorage and cookies, then try logging in again.

## License

MIT

## Support

For issues and questions, please open an issue on the project repository.
