const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");

const DoctorProfileSchema = new Schema({
  doctorId: {
    type: String,
    unique: true,
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientProfile",
    },
  ],

});

module.exports = User.discriminator("Doctor", DoctorProfileSchema);
