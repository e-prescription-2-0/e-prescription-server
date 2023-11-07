const express = require("express");
const router = express.Router();

const Prescription = require("../models/prescriptionsModel");
const Medical = require("../models/medicalModel");

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
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    // Update the medicals in the prescription
    await Promise.all(
      updatedMedicals.map(async (updatedMedical) => {
        
        const medical = await Medical.findById(updatedMedical._id);
        if (medical && medical.prescriptionId === prescriptionId) {
            // Update the completedQuantity for the medical
            medical.completedQuantity = updatedMedical.completedQuantity;
            await medical.save();
            }
        
        // Find the corresponding medical subdocument by _id

        
      })
    );

    // Check if all medicals have completedQuantity equal to zero
    const allMedicalsCompleted = updatedMedicals.every(
      (updatedMedical) => updatedMedical.completedQuantity === 0
    );
    if (allMedicalsCompleted) {
      prescription.completed = true;
      prescription.save();
    }
    // Find and update the prescription's completed field based on allMedicalsCompleted

    res.json(prescription);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating prescription", error: error.message });
  }
});


router.patch("/:id/complete", async (req, res) => {
    try{
        const prescriptionId = req.params.id;
        const prescription = await Prescription.findById(prescriptionId);

        
        await Promise.all(prescription.medicals.map(async (medicalId)=>{
            const medical = await Medical.findByIdAndUpdate(prescriptionId, {completedQuantity: 0} , { new: true });
        }))

        prescription.completed = req.body.completed
        prescription.save()
    

    }catch(error){
        res
      .status(500)
      .json({ message: "Error completing prescription", error: error.message });

    }
})


module.exports = router;
