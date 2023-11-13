const User = require("../models/userModel");

const getAllDoctorsInfo = async () => await User.find({ role: "doctor" })
    .select("firstName lastName email role specialty")
    .exec();


const getDoctorInfo = async (doctorId) =>
  await User.findById(doctorId)
    .select("firstName lastName email role specialty")
    .exec();

    
const getAllPatientsFromDoctorList = async (doctorId) => {
  const doctor = await User.findById(doctorId).populate("patients");

  if (!doctor) {
    throw new Error("Unknown doctor");
  }

  return doctor.patients;
};

const addPatientToDoctorList = async (patientId, doctorId) => {
  const patient = await User.findById(patientId);
  const doctor = await User.findById(doctorId);

  if (!patient || !doctor) {
    throw new Error("Unknown patient or doctor");
  }

  doctor.patients.push(doctor._id);
  doctor.save();

  return doctor.patients;
};

const removePatientFromDoctorList = async (patientId, doctorId) => {
  const patient = await User.findById(patientId);
  const doctor = await User.findById(doctorId);

  if (!patient || !doctor) {
    throw new Error("Unknown patient or doctor");
  }

  doctor.patients.splice(doctor.patient.indexOf(patient._id), 1);
  doctor.save();
  return doctor.patients;
};

module.exports = {
  getAllDoctorsInfo,
  getDoctorInfo,
  addPatientToDoctorList,
  removePatientFromDoctorList,
  getAllPatientsFromDoctorList,
};
