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

// Serve all static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// =================================
// DATABASE CONNECTION
// =================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('Could not connect to MongoDB:', err.message));

// =================================
// ROUTES FOR HTML PAGES
// =================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index2", (req, res) => {
  res.sendFile(path.join(__dirname, "index2.html"));
});

app.get("/internship-type", (req, res) => {
  res.sendFile(path.join(__dirname, "internship-type.html"));
});

app.get("/iwp_2ndpage", (req, res) => {
  res.sendFile(path.join(__dirname, "iwp_2ndpage.html"));
});

app.get("/off-campus", (req, res) => {
  res.sendFile(path.join(__dirname, "off-campus.html"));
});

app.get("/oncampus", (req, res) => {
  res.sendFile(path.join(__dirname, "oncampus.html"));
});

app.get("/students", (req, res) => {
  res.sendFile(path.join(__dirname, "students.html"));
});

// =================================
// API ROUTES
// =================================
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.use("/api", require("./internship_routes"));
app.use("/api", require("./student_routes"));

// =================================
// ERROR HANDLING
// =================================
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ success: false, message: err.message });
});

// ❗ Important: only catch-all for API routes, not HTML
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
});

// =================================
// EXPORT (no app.listen here)
// =================================
module.exports = app;
