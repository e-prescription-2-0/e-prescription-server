const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorProfileSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  dateOfBird: {
    type: Date,
  },
  workCode: {
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
});

module.exports = mongoose.model("DoctorProfile", DoctorProfileSchema);
