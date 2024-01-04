const express = require("express");
const router = express.Router();
const { register } = require("../services/userService");
const userModel = require("../models/userModel");
const {
  addPatientToDoctorList,
  removePatientFromDoctorList,
  getAllPatientsFromDoctorList,
} = require("../services/doctorService");

const User = userModel;

router.post("/register", async (req, res) => {
  try {
    if (Object.values(req.body).some((f) => f == "")) {
      throw new Error("All fields are required");
    }
    if (req.body.password != req.body.repeatPassword) {
      throw new Error("Passwords do not match!");
    }
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      profileInfo,
    } = req.body;

    const user = await register(
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      profileInfo
    );

    res.status(201);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete("/:userId/delete", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find and delete the user by their ID
    const user = await User.findByIdAndRemove(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User and profile deleted successfully" });
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";

    res.status(500).json({
      message: "Error deleting user and profile",
      error: errorMessage,
    });
  }
});

router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";

    res.status(500).json({
      message: "Error user access",
      error: errorMessage,
    });
  }
});

router.get("/:id/patients", async (req, res) => {
  try {
    const doctorId = req.params.id;

    const {page = 1,  search=''} = req.query

    const limit = 10

    const skip = (page - 1) * limit;

    const doctorPatientsList = await getAllPatientsFromDoctorList(doctorId, skip, limit, search);


    res.status(200).json(doctorPatientsList);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";

    res.status(500).json({
      message: errorMessage,
    });
  }
});

router.post("/:doctorId/patients/add/:patientId", async (req, res) => {
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  console.log(doctorId, patientId)

  try {
    const doctorPatientsList = await addPatientToDoctorList(
      patientId,
      doctorId
    );
    res.status(200).json(doctorPatientsList);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";

    res.status(500).json({
      message: errorMessage,
    });
  }
});

router.delete("/patients/remove/:patientId", async (req, res) => {
  const doctorId = req.user.id;
  const patientId = req.params.patientId;

  try {
    const doctorPatientsList = await removePatientFromDoctorList(
      patientId,
      doctorId
    );
    res.status(200).json(doctorPatientsList);
  } catch (error) {
    const errorMessage = error.message || "Internal Server Error";
    res.status(500).json({
      message: errorMessage,
    });
  }
});

module.exports = router;
