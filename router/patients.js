const express = require("express");
const router = express.Router();

const User = require("../models/userModel");

router.get("/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const user = await User.findOne({ _id: patientId, role: "patient" });
    if (!user) {
      throw new Error("Patient is not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

router.get("/:id/prescriptions", async (req, res) => {
  try {
    const patientId = req.params.id;
    const userPrescriptions = await User.findOne({
      _id: patientId,
      role: "patient",
    })
      .populate("prescriptions")
      .select("prescriptions");
    if (!user) {
      throw new Error("Patient is not found");
    }
    res.status(200).json(userPrescriptions);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports = router;
