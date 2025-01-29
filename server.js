const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const app = express();

// Set port
const port = process.env.PORT || 3000;

// Enable JSON parsing
app.use(express.json());
// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Registration route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO members (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email, phone, hashedPassword]
        );
        
        res.json({ success: true, userId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query('SELECT * FROM members WHERE email = $1', [email]);
        
        if (result.rows.length > 0) {
            const valid = await bcrypt.compare(password, result.rows[0].password);
            if (valid) {
                res.json({ success: true, userId: result.rows[0].id });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Set port and start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});