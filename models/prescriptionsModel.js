const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
  prescriptionId: {
    type: String,
    unique: true,
    required: true,
  },
  medicines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
    },
  ],
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorProfile",
  },
  prescribedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientProfile",
  },
  issuedOn: {
    type: String,
    default: Date(),
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  validPeriod: {
    type: Date,
    default: () => {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 6);
      return currentDate;
    },
  },
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
