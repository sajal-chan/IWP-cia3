const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const internshipRoutes = require('./internship_routes.js');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =================================
// MIDDLEWARE CONFIGURATION (MUST BE FIRST)
// =================================

// CORS configuration - Multiple approaches combined for compatibility
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Additional CORS headers for broader compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept all file types or specify allowed types
    cb(null, true);
  }
});

// =================================
// DATABASE CONNECTION
// =================================

// Connect to MongoDB without the deprecated options
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB successfully!'))
.catch(err => console.error('Could not connect to MongoDB:', err.message));

// =================================
// ROUTES
// =================================

// Simple root endpoint
app.get('/', (req, res) => {
  res.send('Internship Tracker Backend API is running.');
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Main internship submission route
app.post('/api/internships', upload.single('offerLetter'), async (req, res) => {
  try {
    console.log('=== RECEIVED REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('Form data:', req.body);
    console.log('File data:', req.file);
    console.log('========================');
    
    // Extract form data
    const {
      orgType,
      companyName,
      companyAddress,
      industry,
      department,
      guide,
      pocName,
      pocEmail,
      pocContact,
      pocDesignation,
      startDate,
      endDate,
      role
    } = req.body;
    
    // Validation for organization type
    if (!orgType || orgType === '' || orgType === 'Select Organization Type') {
      return res.status(400).json({ 
        success: false,
        message: 'Please select a valid organization type' 
      });
    }
    
    // Basic validation for required fields
    const requiredFields = {
      orgType,
      companyName,
      companyAddress,
      industry,
      guide,
      pocName,
      pocEmail,
      pocContact,
      pocDesignation,
      startDate,
      endDate,
      role
    };
    
    const missingFields = [];
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value.toString().trim() === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
    }
    
    // Create internship object
    const internshipData = {
      orgType,
      companyName,
      companyAddress,
      industry,
      department: department || 'Not specified',
      guide,
      pocName,
      pocEmail,
      pocContact,
      pocDesignation,
      startDate,
      endDate,
      role,
      offerLetter: req.file ? req.file.filename : null,
      submittedAt: new Date()
    };
    
    console.log('Processed internship data:', internshipData);
    
    // TODO: Save to your database here
    // Example for Mongoose:
    /*
    const Internship = require('./models/Internship');
    const internship = new Internship(internshipData);
    await internship.save();
    */
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Internship report submitted successfully',
      data: internshipData
    });
    
  } catch (error) {
    console.error('Error processing internship submission:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Use the additional internship routes from external file
app.use('/api', internshipRoutes);

// =================================
// ERROR HANDLING MIDDLEWARE (MUST BE LAST)
// =================================

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: error.message
  });
});

// 404 handler - must be last
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// =================================
// START SERVER
// =================================

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test the backend: http://localhost:${PORT}/api/test`);
  console.log(`Root endpoint: http://localhost:${PORT}/`);
});

module.exports = app;