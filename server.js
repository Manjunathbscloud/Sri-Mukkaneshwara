const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Basic route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

