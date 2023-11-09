const express = require("express");
const router = express.Router();
const { register } = require("../services/userService");

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

module.exports = router;
