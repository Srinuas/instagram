const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection (Render provides DATABASE_URL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false   // Render requires SSL
    }
});

// Create table if not exists (on startup)
pool.query(`
    CREATE TABLE IF NOT EXISTS reel_views (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50),
        reel_filename VARCHAR(255),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`).then(() => {
    console.log('✅ Table "reel_views" is ready');
}).catch(err => {
    console.error('❌ Table creation error:', err);
});

// API endpoint to log reel view
app.post('/api/log-reel-view', async (req, res) => {
    const { username, reelFilename, latitude, longitude } = req.body;

    if (!username || !reelFilename || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `
            INSERT INTO reel_views (username, reel_filename, latitude, longitude)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        const values = [username, reelFilename, latitude, longitude];
        const result = await pool.query(query, values);
        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error('❌ Database insert error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});