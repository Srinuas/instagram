const express = require('express');
const mysql = require('mysql2/promise'); // promise version for async/await
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection pool using DATABASE_URL from environment
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,  // Aiven connection string
    ssl: {
        rejectUnauthorized: true    // Aiven requires SSL
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create table if not exists (on startup)
(async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS reel_views (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50),
                reel_filename VARCHAR(255),
                latitude DECIMAL(10,8),
                longitude DECIMAL(11,8),
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        connection.release();
        console.log('✅ Table "reel_views" is ready (MySQL)');
    } catch (err) {
        console.error('❌ Table creation error:', err);
    }
})();

// API endpoint to log reel view
app.post('/api/log-reel-view', async (req, res) => {
    const { username, reelFilename, latitude, longitude } = req.body;

    if (!username || !reelFilename || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `
            INSERT INTO reel_views (username, reel_filename, latitude, longitude)
            VALUES (?, ?, ?, ?);
        `;
        const values = [username, reelFilename, latitude, longitude];
        const [result] = await pool.query(query, values);
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('❌ Database insert error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});