const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./userModel");

const PharmacistProfileSchema = new Schema({
  pharmacyName: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = User.discriminator(
  "Pharmacist",
  PharmacistProfileSchema
);