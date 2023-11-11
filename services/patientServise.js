const User = require("../models/userModel");


const getPatient = async (patientId)=>{
    const user = await User.findOne({ _id: patientId, role: "patient" });
    return user

}

const getPatientPrescriptions = async (patientId)=>{
    const userPrescriptions = await User.findOne({
        _id: patientId,
        role: "patient",
      })
        .populate("prescriptions")
        .select("prescriptions");
    return userPrescriptions

}

module.exports = {
    getPatient,
    getPatientPrescriptions
}