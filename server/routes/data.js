const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('./auth');

// Get portal data (requires authentication)
router.get('/portal', verifyToken, (req, res) => {
    try {
        const dataPath = path.join(__dirname, '..', '..', 'data.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to load portal data',
            error: error.message
        });
    }
});

// Get engineering laws data (requires authentication)
router.get('/engineering-laws', verifyToken, (req, res) => {
    try {
        const dataPath = path.join(__dirname, '..', '..', 'engineering-law.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to load engineering laws data',
            error: error.message
        });
    }
});

module.exports = router;
