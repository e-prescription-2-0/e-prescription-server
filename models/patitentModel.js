const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./userModel");

const PatientProfileSchema = new Schema({
  patientId: {
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
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    require: true,
  },
});

module.exports = User.discriminator("Patient", PatientProfileSchema);