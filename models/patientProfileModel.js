const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientProfileSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBird: {
    type: Date,
    required: false,
  },
  personId: {
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
});

module.exports = mongoose.model("PatientProfile", PatientProfileSchema);
