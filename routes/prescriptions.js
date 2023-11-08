const express = require("express");
const router = express.Router();

const Prescription = require("../models/prescriptionsModel");
const Medicine = require("../models/medicalModel");

// Define your route handlers
router.get("/", async (req, res) => {
  const prescriptions = await Prescription.find({});
  res.send(prescriptions);
});

router.get("/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    res.send(prescription);
  } catch {
    res
      .status(500)
      .json({ message: "Error retrieving prescription", error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const {prescriptionBy, prescriptionTo, medicals} = req.body
  try{
    const prescription = await Prescription.create({prescribedBy, prescribedTo})

    if(prescription){
      const savedMedicals = await Promise.all(
        medicals.map(async (medicineInfo)=>{
          const medicine = await Medicine.create(medicineInfo)
          return medicals._id
        }

        )
      )
      prescription.medicals.push(...savedMedicals)
      prescription.save()
    }
    
  }catch(error){
    res
    .status(500)
    .json({ message: "Error creating prescription", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error deleting prescription", error: error.message });
  }
});

router.patch("/:id/complete/partial", async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const updatedMedicals = req.body.medicals; // An array of updated medical subdocuments
    const prescription = await Prescription.findById(prescriptionId).populate(
      "medicals"
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    // Update the medicals in the prescription
    await Promise.all(
      prescription.medicals.map(async (medicine) => {
        if (updatedMedicals.include(medical._id)) {
          // Update the completedQuantity for the medical
          medicine.completed = true;
        }
      })
    );

    // Check if all medicals have completedQuantity equal to zero
    const allMedicalsCompleted = prescription.medicals.every(
      (updatedMedical) => updatedMedical.completed === true
    );

    // Find and update the prescription's completed field based on all Medicals Completed

    if (allMedicalsCompleted) {
      prescription.completed = true;
    }
    prescription.save();

    res.json(prescription);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating prescription", error: error.message });
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
      await Promise.all(
        prescription.medicals.map(async (medical) => {
          medical.completed = true;
        })
      );
    }

    prescription.completed = completed;
    prescription.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error completing prescription", error: error.message });
  }
});

module.exports = router;
