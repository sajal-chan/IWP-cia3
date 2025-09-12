const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// =================================
// MIDDLEWARE
// =================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// =================================
// DATABASE CONNECTION
// =================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('Could not connect to MongoDB:', err.message));

// =================================
// ROUTES
// =================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Add your other routes here
app.use("/api", require("./internship_routes"));
app.use("/api", require("./student_routes"));

// =================================
// ERROR HANDLING
// =================================
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ success: false, message: err.message });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// =================================
// EXPORT (❌ no app.listen here!)
// =================================
module.exports = app;
