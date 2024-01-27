const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicineSchema = new Schema({
  medicineName: {
    type: String,
    required: true,
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
  },
  instructions: {
    type: String,
    required: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  dosageType: {
    type: String
  },
  dosage: {
    type: String
  },
  admissionType: {
    type: String
  },
  admission: {
    type: String
  },
});

module.exports = mongoose.model("Medicine", MedicineSchema);
