const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const aiRoutes = require('./routes/ai');
const iconRoutes = require('./routes/icons');

const app = express();
// app.set('trust proxy', true);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false // Disable CSP for development
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || false, // Disable in production since serving same origin
    credentials: true
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/icons', iconRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all non-API routes (SPA routing)
app.get('*', (req, res, next) => {
  // Don't handle API routes
  if (req.path.startsWith('/api/') || req.path === '/health') {
    return next();
  }

  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Icon Factory Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}`);
});
