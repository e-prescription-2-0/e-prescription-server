const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicalSchema = new Schema({
  name: {
    type: String,   
    required: true,
  },
  prescriptionId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",

  },
  maxQuantity: {
    type: Number,
    required: true,
  },
  completedQuantity:{
    type:Number,
    default: 0
  }
});

module.exports = mongoose.model("Medical", MedicalSchema);
