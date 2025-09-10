const express = require('express');
const Internship = require('./internship_model.js');
const router = express.Router();

// POST endpoint to submit a new internship report
router.post('/internships', async (req, res) => {
  try {
    const newInternship = new Internship(req.body);
    await newInternship.save();
    res.status(201).json({ message: 'Internship report submitted successfully!', data: newInternship });
  } catch (err) {
    res.status(400).json({ message: 'Error submitting report', error: err.message });
  }
});

module.exports = router;
