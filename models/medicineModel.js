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
  signature: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Medical", MedicineSchema);
