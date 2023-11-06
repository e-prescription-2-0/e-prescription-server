const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientProfile",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorProfile",
  },
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medical",
    },
  ],
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
