const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  orgType: { type: String, required: true },
  companyName: { type: String, required: true },
  companyAddress: { type: String, required: true },
  industry: { type: String, required: true },
  pocName: { type: String, required: true },
  pocDesignation: { type: String, required: true },
  pocContact: { type: String, required: true },
  pocEmail: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  role: { type: String, required: true },
  // Note: For 'offerLetter' (file), it's best to store a path or URL
  // to the file in a cloud storage service like Firebase Storage or AWS S3,
  // not the file itself. For this example, we'll store a placeholder string.
  offerLetter: { type: String, required: false },
  guide: { type: String, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;
