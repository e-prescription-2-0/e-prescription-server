const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./userModel");

const PatientProfileSchema = new Schema({
  personalId: {
    type: String,
    unique: true,
    required: true,
  },
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription", // Reference the User model
    },
  ],
  dateOfBird: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    require: true,
  },
});

module.exports = User.discriminator("Patient", PatientProfileSchema);