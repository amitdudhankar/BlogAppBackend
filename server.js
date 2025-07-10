const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
const { logApi } = require("./src/middlewares/logs.middleware");
app.use(logApi); // ⬅️ Log every incoming request


// Routes
const authRoutes = require('./src/routes/auth.routes');
const blogPostRoutes = require('./src/routes/blogPost.routes');
const commentRoutes = require('./src/routes/comments.routes');

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blogpost', blogPostRoutes);
app.use('/api/v1/comments', commentRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Backend API is running');
});

// Start server
const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
