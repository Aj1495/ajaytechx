require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();

// Connect to database with retry logic
function connectWithRetry() {
  connectDatabase()
    .then(() => {
      console.log('MongoDB Connected!');
    })
    .catch((err) => {
      console.error('MongoDB connection failed, retrying in 5s...', err.message);
      setTimeout(connectWithRetry, 5000);
    });
}

connectWithRetry();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Routes with debugging
console.log('Registering auth routes...');
try {
  app.use('/api/auth', authRoutes);
  console.log('Auth routes registered successfully');
} catch (error) {
  console.error('Error registering auth routes:', error);
  process.exit(1);
}

console.log('Registering admin routes...');
try {
  app.use('/api/admin', adminRoutes);
  console.log('Admin routes registered successfully');
} catch (error) {
  console.error('Error registering admin routes:', error);
  process.exit(1);
}

console.log('Registering public routes...');
try {
  app.use('/api/public', publicRoutes);
  console.log('Public routes registered successfully');
} catch (error) {
  console.error('Error registering public routes:', error);
  process.exit(1);
}

// Health check endpoint
console.log('Registering health check route...');
try {
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Alfa TechX API is running!',
      timestamp: new Date().toISOString(),
    });
  });
  console.log('Health check route registered successfully');
} catch (error) {
  console.error('Error registering health check route:', error);
  process.exit(1);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Alfa TechX Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
