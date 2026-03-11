import { User } from "../models/User.js";
import RendezVous from "../models/RendezVous.js";

// =====================
// PATIENTS
// =====================
export const getPatients = async (req, res) => {
  const patients = await User.find({ role: "patient" }).select("-password");
  res.json(patients);
};

export const deletePatient = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient supprimé" });
};

// =====================
// MEDECINS
// =====================
export const getDoctors = async (req, res) => {
  const doctors = await User.find({ role: "medecin" }).select("-password");
  res.json(doctors);
};

export const createDoctor = async (req, res) => {
  const { name, email, password, speciality } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Médecin déjà existant" });
  }

  const doctor = await User.create({
    name,
    email,
    password,
    role: "medecin",
    speciality
  });

  res.status(201).json(doctor);
};

export const deleteDoctor = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Médecin supprimé" });
};


export const getStatsAdmin = async (req, res) => {
  try {
    const nbMedecins = await User.countDocuments({ role: "medecin" });
    const nbPatients = await User.countDocuments({ role: "patient" });
    const nbRDVs = await RendezVous.countDocuments();

    res.json({
      medecins: nbMedecins,
      patients: nbPatients,
      rdvs: nbRDVs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
