const User = require("../models/userModel");

const getPatientInfo = async (patientId) =>
  await User.findOne({ _id: patientId, role: "patient" });

const getPatientPrescriptions = async (patientId) =>
  await User.findOne({
    patientId: patientId,
    role: "patient",
  })
    .populate("prescriptions")
    .select("prescriptions");

module.exports = {
  getPatientInfo,
  getPatientPrescriptions,
};
