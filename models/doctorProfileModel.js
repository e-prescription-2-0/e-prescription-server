const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");

const DoctorProfileSchema = new Schema({
  doctorId: {
    type: String,
    unique: true,
    required: true,
  },
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescriptions", // Reference the User model
    },
  ],
  specialty: {
    type: String,
    required: true,
  },
});

module.exports = User.discriminator("DoctorProfile", DoctorProfileSchema);
