const express = require("express");
const {
  getAllPharmacistsInfo,
  getPharmacistInfo,
} = require("../services/pharmacistService");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pharmacists = await getAllPharmacistsInfo();

    res.status(200).json(pharmacists);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(404).json({ message: errorMessage });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pharmacistId = req.params.id;
    const pharmacist = await getPharmacistInfo(pharmacistId);

    if (!pharmacist) {
      throw new Error("Unknown pharmacist");
    }
    res.status(200).json(pharmacist);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(404).json({ message: errorMessage });
  }
});

module.exports = router;
