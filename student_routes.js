const express = require("express");
const router = express.Router();
const Student = require("./students_model");

// GET all submitted students
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err });
  }
});

module.exports = router;
