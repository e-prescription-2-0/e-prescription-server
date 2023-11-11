const Prescription = require("../models/prescriptionsModel");
const Medicine = require("../models/medicalModel");
const User = require("../models/userModel");

const getAllPrescriptions = async () => {
  const prescriptions = await Prescription.find({});
  return prescriptions;
};

const getSinglePrescription = async () => {
  const prescription = await Prescription.findById(req.params.id).populate(
    "medicals"
  );
  if (!prescription) {
    throw new Error("Prescription not found");
  }
  return prescription;
};

const createPrescription = async (prescribedBy, prescribedTo, medicals) => {
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

  const savedMedicals = await Promise.all(
    medicals.map(async (medicineInfo) => {
      const medicine = await Medicine.create({
        ...medicineInfo,
        prescriptionId: prescription._id,
      });
      return medicine._id;
    })
  );
  prescription.medicals.push(...savedMedicals);
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
  updatedMedicalsIds
) => {
  const prescription = await Prescription.findById(prescriptionId).populate(
    "medicals"
  );

  if (!prescription) {
    throw new Error("Prescription not found");
  }
  // Update the medicals in the prescription
  const allMedicals = await Promise.all(
    prescription.medicals.map(async (medicine) => {
      if (updatedMedicalsIds.includes(String(medicine._id))) {
        // Update the completed for the medical
        medicine.completed = true;
        medicine.save();
        return medicine;
      } else {
        return medicine;
      }
    })
  );

  prescription.medicals = allMedicals;

  // Check if all medicals have completedQuantity equal to zero
  const allMedicalsCompleted = allMedicals.every(
    (updatedMedical) => updatedMedical.completed === true
  );

  // Find and update the prescription's completed field based on all Medicals Completed

  if (allMedicalsCompleted) {
    prescription.completed = true;
  }
  prescription.save();
  return prescription;
};

const completeFullPrescription = async (prescriptionId) => {
  const prescription = await Prescription.findById(prescriptionId).populate(
    "medicals"
  );
  const completed = req.body.completed;

  if (completed === true) {
    const allMedicals = await Promise.all(
      prescription.medicals.map(async (medical) => {
        medical.completed = true;
        medical.save();
        return medical;
      })
    );
    prescription.medicals = allMedicals;
  }
  prescription.completed = completed;
  prescription.save();
  return prescription;
};
module.exports = {
  getAllPrescriptions,
  getSinglePrescription,
  createPrescription,
  deletePrescription,
  completePartialPrescription,
  completeFullPrescription,
};
