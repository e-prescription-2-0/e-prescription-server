const express = require("express");
const router = express.Router();
const {
  getAllDoctorsInfo,
  getDoctorInfo,
} = require("../services/doctorService");

router.get("/", async (req, res) => {
  try {
    const {page,  searchEmail} = req.query

    const limit = 10

    const skip = (page - 1) * limit;
    

    const doctors = await getAllDoctorsInfo(skip, limit, searchEmail);

    
    res.status(200).json(doctors);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await getDoctorInfo(doctorId);
    if (!doctor) {
      throw new Error("Unknown doctor");
    }
    res.status(200).json(doctor);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(404).json({ message: errorMessage });
  }
});

module.exports = router;
