const express = require("express");
const router = express.Router();

const Prescription = require("../models/prescriptionsModel");
const Medicine = require("../models/medicalModel");
const User = require("../models/userModel");
const {
  getAllPrescriptions,
  getSinglePrescription,
  createPrescription,
  deletePrescription,
  completePartialPrescription,
  completeFullPrescription,
} = require("../services/prescriptionService");

// Define your route handlers
router.get("/", async (req, res) => {
  const prescriptions = await getAllPrescriptions();
  res.send(prescriptions);
});

router.get("/:id", async (req, res) => {
  try {
    const prescription = await getSinglePrescription();
    res.send(prescription);
  } catch {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { prescribedBy, prescribedTo, medicals } = req.body;
    const prescription = await createPrescription(
      prescribedBy,
      prescribedTo,
      medicals
    );
    if (prescription) {
      res.status(201).json(prescription);
    } else {
      res.status(500).json({ message: "Error creating prescription" });
    }
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
});

router.delete("/:id/delete", async (req, res) => {
  try {
    const prescription = await deletePrescription();
    if (!prescription) {
      throw new Error("Prescription not found");
    }

    res.json({ message: "Prescription deleted successfully" });
  } catch {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
});

router.patch("/:id/complete/partial", async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const updatedMedicalsIds = req.body.medicals; // An array of updated medical
    const prescription = await completePartialPrescription(
      prescriptionId,
      updatedMedicalsIds
    );

    res.json(prescription);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
});

router.patch("/:id/complete", async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const prescription = await completeFullPrescription(prescriptionId);
    res.status(201).json(prescription);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
