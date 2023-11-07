const express = require("express");
const router = express.Router();

const Prescription = require("../models/prescriptionsModel");

// Define your route handlers
router.get("/", async (req, res) => {
  const prescriptions = await Prescription.find({});
  res.send(prescriptions);
});

router.get("/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
    res.send(prescription)
  } catch {
    res
      .status(500)
      .json({ message: "Error retrieving prescription", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndRemove(req.params.id);
    if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
  
    res.json({ message: 'Prescription deleted successfully' });
  
  } catch {
    res
      .status(500)
      .json({ message: "Error deleting prescription", error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
    try {
      const prescription = await Prescription.findByIdAndUpdate(
        req.params.id,
        req.body, // Update the prescription with the data provided in the request body
        { new: true } // Return the updated prescription
      );
  
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
  
      res.json(prescription);
    } catch (error) {
      res.status(500).json({ message: 'Error updating prescription', error: error.message });
    }
  });

  
module.exports = router;
