const Prescription = require("../models/prescriptionsModel");
const Medicine = require("../models/medicineModel");
const User = require("../models/userModel");

const getAllPrescriptions = async () => await Prescription.find({});

const getPrescription = async () => {
  const prescription = await Prescription.findById(req.params.id).populate(
    "medicines"
  );
  if (!prescription) {
    throw new Error("Prescription not found");
  }
  return prescription;
};

const createPrescription = async (prescribedBy, prescribedTo, medicines) => {
  const patient = await User.findOne({ _id: prescribedTo, role: "patient" });
  const doctor = await User.findOne({ _id: prescribedBy, role: "doctor" });

  if (!patient || !doctor) {
    throw new Error("Patient or Doctor does not exist");
  }

  const prescription = await Prescription.create({
    prescribedTo,
    prescribedBy,
  });

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

  return prescription;
};

const deletePrescription = async (prescriptionId) => {
  const prescription = await Prescription.findByIdAndRemove(prescriptionId);
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
  const pharmacist = await User.findById(pharmacistId);

  if (!pharmacist || !(pharmacist.role === "pharmacist")) {
    throw new Error("Unknown pharmacist");
  }

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
    (updatedMedical) => updatedMedical.isCompleted === true
  );

  // Find and update the prescription's completed field based on all medicines Completed

  if (allMedicinesCompleted) {
    prescription.isCompleted = true;
  }
  prescription.save();

  if (!pharmacist.prescriptions.includes(prescription._id)) {
    pharmacist.prescriptions.push(prescription._id);
  }
  pharmacist.save();

  return prescription;
};

const completeFullPrescription = async (prescriptionId) => {
  const prescription = await Prescription.findById(prescriptionId).populate(
    "medicines"
  );

  const pharmacist = await User.findById(pharmacistId);

  if (!pharmacist || !(pharmacist.role === "pharmacist")) {
    throw new Error("Unknown pharmacist");
  }

  const completed = req.body.completed;

  if (completed) {
    const allMedicines = await Promise.all(
      prescription.medicines.map(async (medicine) => {
        medicine.isCompleted = true;
        medicine.save();
        return medicine;
      })
    );
    prescription.medicines = allMedicines;
  }
  prescription.isCompleted = completed;
  prescription.save();

  if (!pharmacist.prescriptions.includes(prescription._id)) {
    pharmacist.prescriptions.push(prescription._id);
  }
  pharmacist.save();

  return prescription;
};
module.exports = {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  deletePrescription,
  completePartialPrescription,
  completeFullPrescription,
};
