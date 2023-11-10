const express = require("express");
const router = express.Router();

const User = require("../models/userModel");

router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
  .select("firstName lastName email role  specialty")
  .exec();

    res.status(200).json(doctors);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await User.findById(doctorId)
    .select("firstName lastName email role  specialty")
    .exec();

    if (!doctor) {
      throw new Error("Patient is not found");
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports = router;
