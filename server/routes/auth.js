const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user storage (replace with database in production)
const users = new Map();

// Initialize default admin user
const initializeDefaultUser = () => {
    const defaultUser = process.env.DEFAULT_ADMIN_USER || 'admin';
    const defaultPass = process.env.DEFAULT_ADMIN_PASS || 'adrian22';

    if (!users.has(defaultUser)) {
        const hashedPassword = bcrypt.hashSync(defaultPass, 10);
        users.set(defaultUser, {
            username: defaultUser,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });
        console.log(`✅ Default admin user created: ${defaultUser}`);
    }
};

initializeDefaultUser();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    const user = users.get(username);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    // Generate JWT token
    const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    // Store in session as well
    req.session.user = { username: user.username };

    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { username: user.username }
    });
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.json({ success: true, message: 'Logout successful' });
    });
});

// Verify token endpoint
router.get('/verify', verifyToken, (req, res) => {
    res.json({
        success: true,
        user: { username: req.user.username }
    });
});

// Register endpoint (optional - for creating new users)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    if (users.has(username)) {
        return res.status(409).json({
            success: false,
            message: 'Username already exists'
        });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.set(username, {
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully'
    });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
