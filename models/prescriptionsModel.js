const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PatientProfile",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorProfile",
  },
  medicals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medical",
    },
  ],
  completed:{
    type: Boolean,
    default: false
  },
  validPeriod:{
    type: Date,
    default: ()=>{
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 6);
      return currentDate;
    }
    
  }
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
