const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PharmacistProfileSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  dateOfBird: {
    type: Date,
  },
  workCode: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("PharmacistProfile", PharmacistProfileSchema);
