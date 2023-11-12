const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./userModel");

const PatientProfileSchema = new Schema({
  patientId: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    require: true,
  },
  dateOfBirth: {
    type: Date,
  },
  patientSpecifics: [],
 
});

module.exports = User.discriminator("Patient", PatientProfileSchema);
