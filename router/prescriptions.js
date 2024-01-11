const express = require("express");
const router = express.Router();


const {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  deletePrescription,
  completePartialPrescription,
  completeFullPrescription,
  updatePrescription,
} = require("../services/prescriptionService");

// Define your route handlers
router.get("/", async (req, res) => {
  const prescriptions = await getAllPrescriptions();
  res.send(prescriptions);
});

router.get("/:id", async (req, res) => {
  try {
    const prescription = await getPrescription(req.params.id);
    res.send(prescription);
  } catch {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { prescribedBy, prescribedTo, medicines } = req.body;
    const prescription = await createPrescription(
      prescribedBy,
      prescribedTo,
      medicines
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
    const prescription = await deletePrescription(req.params.id);
    if (!prescription) {
      throw new Error("Prescription not found");
    }

    res.json({ message: "Prescription deleted successfully" });
  } catch {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
});

router.patch("/:prescriptionId/update", async (req, res) => {
  /* 
  req.body example:

  {
    updatedPatient: patientId,
    updatedMedicationsList:{
      medicationsToAdd: [{medicineName, prescriptionId, signature}],
      medicationsToRemove : [{_id}]
    }
  }

  */
  try {
    const prescriptionId = req.params.prescriptionId
    const updatedPatientId = req.body?.updatedPatientId
    const updatedMedicationsList = req.body?.updatedMedicationsList

    const prescription = await updatePrescription(prescriptionId, updatedPatientId, updatedMedicationsList);

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
    const updatedMedicinesIds = req.body.medicines; // An array of updated medicines
    const pharmacistId = req.user.id;

    const prescription = await completePartialPrescription(
      prescriptionId,
      updatedMedicinesIds,
      pharmacistId
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
    const pharmacistId = req.user.id;

    const prescription = await completeFullPrescription(
      prescriptionId,
      pharmacistId
    );
    res.status(201).json(prescription);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
