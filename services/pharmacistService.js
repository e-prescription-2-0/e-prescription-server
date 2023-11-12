const User = require("../models/userModel");

const getAllPharmacistsInfo = async () =>
  await User.find({ role: "pharmacist" })
    .select("firstName lastName email role pharmacy")
    .exec();

const getPharmacistInfo = async (pharmacistId) =>
  await User.findById(pharmacistId)
    .select("firstName lastName email role pharmacy")
    .exec();

module.exports = {
  getAllPharmacistsInfo,
  getPharmacistInfo,
};
