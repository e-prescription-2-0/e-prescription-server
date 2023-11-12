const User = require("../models/userModel");

const getAllDoctorsInfo = async () =>
  await User.find({ role: "doctor" })
    .select("firstName lastName email role specialty")
    .exec();

const getDoctorInfo = async (doctorId) =>
  await User.findById(doctorId)
    .select("firstName lastName email role specialty")
    .exec();

module.exports = {
  getAllDoctorsInfo,
  getDoctorInfo,
};
