const Prescription = require("../models/prescriptionsModel");
const Medicine = require("../models/medicineModel");
const User = require("../models/userModel");
const { generateRxNumber } = require("../utils/generateRxNumber");

const getAllPrescriptions = async (
  skip,
  limit,
  search = null,
  sortFields = ["issuedOn"]
) => {
  try {
    let query = {};

    if (search) {
      query.prescriptionId = { $regex: new RegExp(search, "i") }; // Case-insensitive search
    }

    const prescriptions = await Prescription.find(query)
      .populate("medicines")
      .populate({
        path: "prescribedTo",
        select: "-password", // Exclude the 'password' field
      })
      .populate({
        path: "prescribedBy",
        select: "-password", // Exclude the 'password' field
      })
      .sort(sortFields.join(" ")) // Join sorting fields with a space
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Prescription.countDocuments(query);
    const numberPages = Math.ceil(totalCount / limit);

    return { prescriptions, numberPages };
  } catch (error) {
    throw error;
  }
};

const getPrescription = async (id) => {
  const prescription = await Prescription.findById(id)
    .populate("medicines")
    .populate({
      path: "prescribedTo",
      select: "-password", // Exclude the 'password' field
    })
    .populate({
      path: "prescribedBy",
      select: "-password", // Exclude the 'password' field
    });
  if (!prescription) {
    throw new Error("Prescription not found");
  }
  return prescription;
};

const createPrescription = async (prescribedBy, prescribedTo, medicines) => {
  const patient = await User.findOne({ _id: prescribedTo, role: "patient" });
  const doctor = await User.findOne({ _id: prescribedBy, role: "doctor" });

  const rxNumber = generateRxNumber();
  if (!patient || !doctor) {
    throw new Error("Patient or Doctor does not exist");
  }

  const prescription = await Prescription.create({
    prescriptionId: rxNumber,
    prescribedTo,
    prescribedBy,
  })

  if (!prescription) {
    throw new Error("Error creating prescription");
  }

  const savedMedicines = await Promise.all(
    medicines.map(async (medicineInfo) => {
      const medicine = await Medicine.create({
        ...medicineInfo,
        prescriptionId: prescription._id,
      });
      return medicine._id;
    })
  );
  prescription.medicines.push(...savedMedicines);
  await prescription.save();

  patient.prescriptions = [...patient.prescriptions, prescription._id];

  doctor.prescriptions = [...doctor.prescriptions, prescription._id];

  await patient.save();
  await doctor.save();

  return prescription
    .populate("prescribedBy")
    .populate("prescribedTo");
};

const deletePrescription = async (prescriptionId) => {
  const prescription = await Prescription.findByIdAndDelete(prescriptionId);

  prescription.medicines?.map((medicineId) =>
    Medicine.findByIdAndDelete(medicineId)
  );

  return prescription;
};

const updatePrescription = async (
  prescriptionId,
  updatedPatientId,
  updatedMedicationsList
) => {
  const prescription = await Prescription.findById(prescriptionId);
  if (!prescription) {
    throw new Error("Unknown Prescription");
  }
  if (prescription.isCompleted) {
    throw new Error("Prescription is Completed");
  }

  if (updatedPatientId) {
    prescription.prescribedTo = updatedPatientId;
  }

  if (updatedMedicationsList) {
    const newMedicationsList = await Promise.all(
      updatedMedicationsList.medicationsToAdd.map(async (medicineInfo) => {
        const { medicineName, prescriptionId, signature } = medicineInfo;
        const medicine = await Medicine.create({
          medicineName,
          prescriptionId,
          signature,
        });
        return medicine._id;
      })
    );
    updatedMedicationsList.medicationsToRemove.map((medications) => {
      prescription.medicines.slice(
        prescription.medicines.indexOf(medications._id),
        1
      );
    });
    prescription.medicines = [...prescription.medicines, ...newMedicationsList];
  }

  prescription.save();

  return prescription;
};

const completePartialPrescription = async (
  prescriptionId,
  updatedMedicinesIds,
  pharmacistId
) => {
  const prescription = await Prescription.findById(prescriptionId).populate(
    "medicines"
  );
  // const pharmacist = await User.findById(pharmacistId);

  // if (!pharmacist || pharmacist.role !== "pharmacist") {
  //   throw new Error("Unknown pharmacist");
  // }

  if (!prescription) {
    throw new Error("Prescription not found");
  }
  // Update the medicines in the prescription
  const allMedicines = await Promise.all(
    prescription.medicines.map(async (medicine) => {
      if (updatedMedicinesIds.includes(String(medicine._id))) {
        // Update the completed for the medical
        medicine.isCompleted = true;
        medicine.save();
        return medicine;
      } else {
        return medicine;
      }
    })
  );

  prescription.medicines = allMedicines;

  // Check if all medicines have completedQuantity equal to zero
  const allMedicinesCompleted = allMedicines.every(
    (updatedMedicine) => updatedMedicine.isCompleted === true
  );

  // Find and update the prescription's completed field based on all medicines Completed

  if (allMedicinesCompleted) {
    prescription.isCompleted = true;
  }
  prescription.save();

  // if (!pharmacist.prescriptions.includes(prescription._id)) {
  //   pharmacist.prescriptions.push(prescription._id);
  // }
  // pharmacist.save();

  return prescription;
};

const completeFullPrescription = async (prescriptionId) => {
  const prescription = await Prescription.findById(prescriptionId)
    .populate("medicines")
    .populate({
      path: "prescribedTo",
      select: "-password", // Exclude the 'password' field
    })
    .populate({
      path: "prescribedBy",
      select: "-password", // Exclude the 'password' field
    });

  prescription.isCompleted = true;
  prescription.save();

  return prescription;
};
module.exports = {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  deletePrescription,
  updatePrescription,
  completePartialPrescription,
  completeFullPrescription,
};
