const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["patient", "pharmacist ", "doctor"], // Define the available roles
    default: "patient", // Set a default role if necessary
  },
  CreatedOn: {
    type: String,
    default: Date(),
    required: true,
  },
});



module.exports = mongoose.model("User", userSchema);