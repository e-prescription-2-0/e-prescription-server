const express = require("express");
const router = express.Router();
const { register, login } = require("../services/userService");
const userModel = require("../models/userModel");
const auth = require("../middlewares/auth");
const trimReqBody = require("../middlewares/trimBody");


const User = userModel;

router.post("/register", trimReqBody, async (req, res, next) => {

 

  if (Object.values(req.body).some((f) => f == "")) {
    throw new Error({ erorr: "All fields are required" });
  }
  if (req.body.password != req.body.repeatPassword) {
    throw new Error("Passwords do not match!");
  }
  try {


    const {firstName, lastName, email, password, role, profileInfo} = req.body;

   

    const user = await register(firstName,lastName,email, password,role, profileInfo);
   
    res.status(201).json(user);

  } catch (error) {
 
    
    res.status(401).send({ error: error.message });
  }
});

router.post('/login', async (req, res,next) => {


  if (!req.body.loginEmail || !req.body.loginPassword ) {
   
    throw new Error("All fields are required");

  }
  const { loginEmail, loginPassword } = req.body
  try {
    const email = loginEmail;
    const password = loginPassword
    const user = await login(email, password);
    res.status(200).json(user);

  } catch (error) {

   
    res.status(401).send({ error: error.message })
  }


})


router.post('/logout', auth, (req, res, next) => {

  res.status(204).json({ message: 'Logged out successfully' });
});



router.delete("/:userId/delete", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find and delete the user by their ID
    const user = await User.findByIdAndRemove(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User and profile deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user and profile",
      error: error.message,
    });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find and delete the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error user access",
      error: error.message,
    });
  }
});

module.exports = router;
