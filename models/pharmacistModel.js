const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./userModel");

const PharmacistProfileSchema = new Schema({
  pharmacistId: {
    type: String,
    unique: true,
    required: true,
  },
  pharmacyName: {
    type: String,
    required: true,
  },
  patients: [],
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescriptions",
    },
  ],
});

module.exports = User.discriminator("Pharmacist", PharmacistProfileSchema);
