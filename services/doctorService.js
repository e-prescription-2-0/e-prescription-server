const User = require("../models/userModel");

const getAllDoctorsInfo = async (
  skip,
  limit,
  search = null,
  sortFields = ["firstName", "lastName"]
) => {
  try {
    let query = { role: "doctor" };

    if (search) {
      query.email = { $regex: new RegExp(search, "i") }; // Case-insensitive search
    }

    const doctors = await User.find(query)
      .select("firstName lastName email doctorId hospitalName role specialty")
      .sort(sortFields.join(" ")) // Join sorting fields with a space
      .skip(skip)
      .limit(limit)
      .exec();

    return doctors;
  } catch (error) {
    throw error;
  }
};

const getDoctorInfo = async (doctorId) =>
  await User.findById(doctorId)
    .select("firstName lastName email  doctorId hospitalName  role specialty")
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
