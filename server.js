const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// MySQL Connection using DATABASE_URL (Aiven)
// ============================================================
// Render lo environment variable ga DATABASE_URL ni set cheyyandi.
// Example: mysql://avnadmin:password@host:port/defaultdb
const pool = mysql.createPool(process.env.DATABASE_URL);

// Connection check
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection error:', err.message);
        return;
    }
    console.log('✅ MySQL connected successfully! (Aiven)');
    connection.release();

    // ============================================================
    // Create table if not exists (on startup)
    // ============================================================
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS reel_views (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50),
            reel_filename VARCHAR(255),
            latitude DECIMAL(10,8),
            longitude DECIMAL(11,8),
            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    pool.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('❌ Table creation error:', err.message);
        } else {
            console.log('✅ Table "reel_views" is ready');
        }
    });
});

// ============================================================
// API endpoint to log reel view
// ============================================================
app.post('/api/log-reel-view', (req, res) => {
    const { username, reelFilename, latitude, longitude } = req.body;

    if (!username || !reelFilename || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO reel_views (username, reel_filename, latitude, longitude)
        VALUES (?, ?, ?, ?)
    `;
    const values = [username, reelFilename, latitude, longitude];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('❌ Database insert error:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, id: result.insertId });
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
