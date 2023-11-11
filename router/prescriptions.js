const express = require("express");
const router = express.Router();

const Prescription = require("../models/prescriptionsModel");
const Medicine = require("../models/medicalModel");
const User = require("../models/userModel");

// Define your route handlers
router.get("/", async (req, res) => {
  const prescriptions = await Prescription.find({});
  res.send(prescriptions);
});

router.get("/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate(
      "medicals"
    );
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    res.send(prescription);
  } catch {
    const errorMessage = error.message || "Internal Server Error";
    res
      .status(500)
      .json({ message: errorMessage });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { prescribedBy, prescribedTo, medicals } = req.body;

    const patient = await User.findOne({ _id: prescribedTo, role: "patient" });
    const doctor = await User.findOne({ _id: prescribedBy, role: "doctor" });

    if (!patient || !doctor) {
      throw new Error("Patient or Doctor does not exist");
    }

    const prescription = await Prescription.create({
      prescribedTo,
      prescribedBy,
    });

    if (prescription) {
      const savedMedicals = await Promise.all(
        medicals.map(async (medicineInfo) => {
          const medicine = await Medicine.create({
            ...medicineInfo,
            prescriptionId: prescription._id,
          });
          return medicine._id;
        })
      );
      prescription.medicals.push(...savedMedicals);
      await prescription.save();

      patient.prescriptions = [...patient.prescriptions, prescription._id];

      doctor.prescriptions = [...doctor.prescriptions, prescription._id];

      await patient.save();
      await doctor.save();

      res.status(201).json(prescription);
    } else {
      res.status(500).json({ message: "Error creating prescription" });
    }
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res
      .status(500)
      .json({ message: errorMessage });
  }
});

router.delete("/:id/delete", async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndRemove(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json({ message: "Prescription deleted successfully" });
  } catch {
    const errorMessage = error.message || "Internal Server Error";
    res
      .status(500)
      .json({ message: errorMessage });
  }
});

router.patch("/:id/complete/partial", async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const updatedMedicalsIds = req.body.medicals; // An array of updated medical
    const prescription = await Prescription.findById(prescriptionId).populate(
      "medicals"
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    // Update the medicals in the prescription
    const allMedicals = await Promise.all(
      prescription.medicals.map(async (medicine) => {
        if (updatedMedicalsIds.includes(String(medicine._id))) {
          // Update the completed for the medical
          medicine.completed = true;
          medicine.save();
          return medicine;
        } else {
          return medicine;
        }
      })
    );

    prescription.medicals = allMedicals;

    // Check if all medicals have completedQuantity equal to zero
    const allMedicalsCompleted = allMedicals.every(
      (updatedMedical) => updatedMedical.completed === true
    );

    // Find and update the prescription's completed field based on all Medicals Completed

    if (allMedicalsCompleted) {
      prescription.completed = true;
    }
    console.log(prescription);
    prescription.save();

    res.json(prescription);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res
      .status(500)
      .json({ message: errorMessage });
  }
});

router.patch("/:id/complete", async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const prescription = await Prescription.findById(prescriptionId).populate(
      "medicals"
    );
    const completed = req.body.completed;

    if (completed === true) {
      const allMedicals = await Promise.all(
        prescription.medicals.map(async (medical) => {
          medical.completed = true;
          medical.save();
          return medical;
        })
      );
      prescription.medicals = allMedicals;
    }
    prescription.completed = completed;
    prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res
      .status(500)
      .json({ message: errorMessage});
  }
});

module.exports = router;
