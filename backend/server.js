
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err));

// Make the pool available to routes
app.locals.db = pool;

// Routes
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('LeftPlot API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
