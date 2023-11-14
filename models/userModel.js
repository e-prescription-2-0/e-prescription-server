const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const PasswordPreSaveHook = require("../utils/PasswordHashing");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["patient", "pharmacist", "doctor"], // Define the available roles
    default: "patient", // Set a default role if necessary
  },
  createdOn: {
    type: String,
    default: Date(),
    required: true,
  },

  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription", // Reference the User model
    },
  ],
  
});

PasswordPreSaveHook(userSchema);

module.exports = mongoose.model("User", userSchema);
