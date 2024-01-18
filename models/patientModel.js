const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = require("./userModel")

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
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  patientSpecifics: [],
})

module.exports = User.discriminator("Patient", PatientProfileSchema)
