const express = require("express");
const router = express.Router();
const { getAllDoctorsInfo, getSingleDoctorInfo } = require("../services/doctorService");

router.get("/", async (req, res) => {
  try {
    const doctors =  await getAllDoctorsInfo()

    res.status(200).json(doctors);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await getSingleDoctorInfo(doctorId)
    if (!doctor) {
      throw new Error("Unknown doctor");
    }
    res.status(200).json(doctor);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(404).json({ message: errorMessage});
  }
});

module.exports = router;
