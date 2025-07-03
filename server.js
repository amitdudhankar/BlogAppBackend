const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Routes
const authRoutes = require('./src/routes/auth.routes');
app.use('/api/v1/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Backend API is running');
});

// Start server
const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
