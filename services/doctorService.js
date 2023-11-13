const User = require("../models/userModel");

const getAllDoctorsInfo = async () => {
  const doctors = await User.find({ role: "doctor" })
    .select("firstName lastName email role specialty")
    .exec();
  return doctors;
};

const getDoctorInfo = async (doctorId) => {
  const doctor = await User.findById(doctorId)
    .select("firstName lastName email role specialty")
    .exec();
  return doctor;
};

module.exports = {
  getAllDoctorsInfo,
  getDoctorInfo,
};
