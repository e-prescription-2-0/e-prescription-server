const User = require("../models/userModel");

const getAllPatientsInfo = async (
  skip,
  limit,
  search = null,
  sortFields = ["firstName", "lastName"]
) => {
  try {
    let query = { role: "patient" };

    if (search) {
      query.patientId = { $regex: new RegExp(search, "i") }; // Case-insensitive search
    }

    const patients = await User.find(query)
      .select("-password")
      .sort(sortFields.join(" ")) // Join sorting fields with a space
      .skip(skip)
      .limit(limit)
      .populate({
        path: "prescriptions",
        match: {
          isCompleted: false,
        },
      })
      .exec();

    const totalCount = await User.countDocuments(query);
    const numberPages = Math.ceil(totalCount / limit);

    return { patients, numberPages };
  } catch (error) {
    throw error;
  }
};

const getPatientInfo = async (patientId) =>
  await User.findOne({ patientId: patientId, role: "patient" });

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
  getAllPatientsInfo,
};
