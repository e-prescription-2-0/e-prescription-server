const express = require("express");
const {
  getPatientInfo,
  getPatientPrescriptions,
  getAllPatientsInfo,
} = require("../services/patientServise");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const {page,  search} = req.query

    const limit = 10

    const skip = (page - 1) * limit;
    

    const result = await getAllPatientsInfo(skip, limit, search);

    
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const user = await getPatientInfo(patientId);
    if (!user) {
      throw new Error("Patient is not found");
    }
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(404).json({ message: errorMessage });
  }
});

router.get("/:id/prescriptions", async (req, res) => {
  try {
    const patientId = req.params.id;
    const userPrescriptions = await getPatientPrescriptions(patientId);
    if (!userPrescriptions) {
      throw new Error("Unknown doctor");
    }
    res.status(200).json(userPrescriptions);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(404).json({ message: errorMessage });
  }
});

module.exports = router;
