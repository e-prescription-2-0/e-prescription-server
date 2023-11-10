const express = require("express");
const router = express.Router();

const User = require("../models/userModel");

router.get("/", async (req, res) => {
  try {
    const pharmacists = await User.find({ role: "pharmacist" })
      .select("firstName lastName email role pharmacy")
      .exec();

    res.status(200).json(pharmacists);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pharmacistId = req.params.id;
    const pharmacist = await User.findById(pharmacistId)
    .select("firstName lastName email role pharmacy")
    .exec();

    if (!pharmacist) {
      throw new Error("Patient is not found");
    }
    res.status(200).json(pharmacist);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports = router;
